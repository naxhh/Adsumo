var debug = require('debug')('lookup:lookup'),
    generated_file_path = __dirname + '/../var/normalized/'
;

var Lookup = function(filesList) {
    this._filesList = filesList;

    this.ipToLong = function ipToLong(ip) {
        var d = ip.split('.');
        return ((((( (+d[0])*256) + (+d[1]))*256) + (+d[2]))*256) + (+d[3]);
    }

    this.getListFor = function getListFor(ipLong, callback) {
        var files = this._filesList.slice(0),
            file;

        while(files.length > 0) {
            file = files.pop();

            if (ipLong >= file) {
                jf.readFile(generated_file_path + file, callback);
                return;
            }
        }

        callback('File not found', null);
        return;
    }

    this.getCountryFromList = function getCountryFromList(ipLong, ipList, callback) {
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
            } else if (ipLong < record.first) {
                ipList = ipList.slice(Lb, M);
            }

            Ub = ipList.length - 1;
            M = Math.floor((Lb + Ub) / 2);
            record = ipList[M];
        }
    }
};

Lookup.prototype.getCountry = function getCountry(ip, callback) {
    var self = this,
        ipLong = this.ipToLong(ip)
    ;

    if (isNaN(ipLong)) {
        callback('Not a valid IP', null);
        return;
    }

    this.getListFor(ipLong, function(err, list) {
        if (err) {
            callback('Not valid file for the IP', null);
            return;
        }

        self.getCountryFromList(ipLong, list, callback);
        
    });
}

module.exports = Lookup;











// Remove :D

/**
 * Retrieves the country for the given ip.
 *
 * @param  {Integer}   ipLong    The long representation of the IP.
 * @param  {List}      ipList    A list of long ranges with the country for each range.
 * @param  {Function}  callback  The callback to call when operation ends.
 * @return {void}
 */
var getCountry = function getCountry(ipLong, ipList, callback) {
    var Lb = 0,
        Ub = ipList.length - 1,
        M = Math.floor((Lb + Ub) / 2),
        record = ipList[M],
        UbList,
        LbList,
        isInRange = ipLong >= record.first && ipLong <= record.last
    ;

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
        UbList = ipList.slice(-(M+1));

        getCountry(ipLong, UbList, callback);
        return;

    // Check in the Lb
    } else if (ipLong < record.first) {
        LbList = ipList.slice(Lb, M);

        getCountry(ipLong, LbList, callback);
        return;
    }
}

/**
 * Same implementation as getCountry but without recursivity, because v8 is not TCO.
 *
 * @param  {Integer}   ipLong    The long representation of the IP.
 * @param  {List}      ipList    A list of long ranges with the country for each range.
 * @param  {Function}  callback  The callback to call when operation ends.
 * @return {void}
 */
var getCountryNotRecursive = function getCountryNotRecursive(ipLong, ipList, callback) {
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
        } else if (ipLong < record.first) {
            ipList = ipList.slice(Lb, M);
        }

        Ub = ipList.length - 1;
        M = Math.floor((Lb + Ub) / 2);
        record = ipList[M];
    }
}

// module.exports = {
//     getCountry: getCountryNotRecursive
// }