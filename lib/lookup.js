var debug = require('debug')('lookup:lookup');

/**
 * Lookups for a specific IP and retrieves information from there.
 * @param {Array<Integer>} filesList List of file names where we want to search the ip.
 * @param {Object} Cache     The cache object.
 * @param {Object} config    Configuration with the path of the files.
 */
var Lookup = function(filesList, Cache, config) {
    this._filesList = filesList;
    this._cache = Cache;
    this._config = config;
};

/**
 * Retrieves a country for a specific IP.
 * @param  {String}   ip       A valid ipv4 ip.
 * @param  {Function} callback The callback will be called with an error (if any) and a country (if any).
 */
Lookup.prototype.getCountry = function getCountry(ip, callback) {
    var self = this,
        ipLong = ipToLong(ip)
    ;

    if (isNaN(ipLong)) {
        callback('Not a valid IP', null);
        return;
    }

    getListFor.call(this, ipLong, function(err, list) {
        if (err) {
            callback('Not valid file for the IP', null);
            return;
        }

        getCountryFromList.call(self, ipLong, list, callback);

    });
}

/**
 * Converts a ip to a long.
 *
 * @private
 * @param  {String} ip The ip to convert.
 * @return {Integer}   The long value of the given IP.
 */
function ipToLong(ip) {
    var d = ip.split('.');
    return ((((( (+d[0])*256) + (+d[1]))*256) + (+d[2]))*256) + (+d[3]);
}

/**
 * Get a list of files and returns the content of the file where the ip should be.
 * It applies binary search for a long list of files.
 *
 * @private
 * @param  {Integer}   ipLong  The IP whe are searching.
 * @param  {Function} callback
 */
function getListFor(ipLong, callback) {
    var self = this,
        ipList = this._filesList.slice(0),
        Lb = 0,
        Ub = ipList.length -1,
        M = Math.floor((Lb + Ub) / 2),
        record = ipList[M],
        isInRange,
        dataInCache
    ;

    while (true) {
        isInRange = ipLong >= record && (typeof ipList[M+1] == 'undefined' || ipLong < ipList[M+1]);

        if (isInRange) {
            if (dataInCache = this._cache.get(record)) {
                callback(null, dataInCache);
                return;
            }

            jf.readFile(this._config["generated_files_path"] + record, function(err, data) {
                if (!err) {
                    self._cache.set(record, data, self._config.file_ttl);
                }

                callback(err, data);
            });
            return;

        } else if (!isInRange && M <= 0 && ipList.length <= 0) {
            callback('No file for the ip', null);
            return;
        }

        if (ipLong > record) {
            ipList = ipList.slice(-(M+1));
        } else {
            ipList = ipList.slice(Lb, M);
        }

        Ub = ipList.length - 1;
        M = Math.floor((Lb + Ub) / 2);
        record = ipList[M];
    }
}

/**
 * Searchs for the country of a specific ip in a list of ips ranges.
 *
 * @private
 * @param  {Integer}   ipLong  The ip we are searching.
 * @param  {List<Object>}   ipList   List of ip ranges and countries for each range.
 * @param  {Function} callback
 */
function getCountryFromList(ipLong, ipList, callback) {
    var Lb = 0,
        Ub = ipList.length - 1,
        M = Math.floor((Lb + Ub) / 2),
        record = ipList[M],
        isInRange
    ;

    while (true) {
        isInRange = ipLong >= record.first && ipLong <= record.last;

        // Check the M record.
        if (isInRange) {

            callback(null, record.country);
            return;

        // No more records to check.
        } else if (!isInRange && M <= 0 && ipList.length == 1) {
            callback('IP not found', null);
            return;
        }

        // Check in the Ub
        if (ipLong > record.last) {
            ipList = ipList.slice(-(M+1));

        // Check in the Lb
        } else {
            ipList = ipList.slice(Lb, M);
        }

        Ub = ipList.length - 1;
        M = Math.floor((Lb + Ub) / 2);
        record = ipList[M];
    }
}

module.exports = Lookup;