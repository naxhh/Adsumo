var debug = require('debug')('lookup:parser')
    csv = require('ya-csv'),
    fs = require('fs'),

    filesList = [],

    generated_file_path = __dirname + '/../var/normalized/',
    records_per_file = 1000,
    current_line = 1,
    ipList = []
;

/**
 * Builds an in-memory struct for a range of long ips and their country.
 *
 * @param  {String}   fileDir   The path of the dir to load in-memory.
 * @param  {Function} callback
 * @return {void}
 */
var buildStruct = function buildStruct(fileDir, callback) {
        debug('CSV parsing start');

        var reader = csv.createCsvFileReader(fileDir);

        reader.addListener('data', function(data) {
            var record = {first: parseInt(data[0]), last: parseInt(data[1]), country: data[3]}

            current_line += 1;
            ipList.push(record);

            if (current_line % records_per_file == 0) {
                var file_name = generated_file_path + ipList[0].first;

                fs.writeFile(file_name, JSON.stringify(ipList), function(err) {
                    if (err) {debug("File: %s error: %s", file_name, err);}
                });

                filesList.push(ipList[0].first);
                ipList = [];
            }
        });

        reader.addListener('end', function() {
            debug('CSV parsing done');

            callback(null, new Lookup(filesList));
        });
    }

var Lookup = function(filesList) {
    var self = this,
        _filesList = filesList
    ;

    var ipToLong = function ipToLong(ip) {
        var d = ip.split('.');
        return ((((( (+d[0])*256) + (+d[1]))*256) + (+d[2]))*256) + (+d[3]);
    }

    var getListFor = function getListFor(ipLong) {
        var files = self._filesList,
            file;

        while(files) {
            file = files.pop();

            if (ipLong >= file) {
                return require(generated_file_path + file);
            }
        }

        return null;
    }

    var getCountryFromList = function getCountryFromList(ipLong) {

    }
};

Lookup.prototype.getCountry = function getCountry(ip, callback) {
    debug(self.ipToLong(ip));
    var ipLong = self.ipToLong(ip);

    if (isNaN(ipLong)) {
        callback('Not a valid IP', null);
        return;
    }

    list = self.getListFor(ipLong);

    if (!list) {
        callback('Not valid file for the IP', null);
        return;
    }

    debug(list);
    // callback(null, self.getCountryFromList(ipLong));
}

/**
 * Converts an ip to long.
 *
 * @param  {String} ip The ip to convert.
 * @return {[Integer]} The long value of the ip.
 */
var ipToLong = function ipToLong(ip) {
    var d = ip.split('.');
    return ((((( (+d[0])*256) + (+d[1]))*256) + (+d[2]))*256) + (+d[3]);
}

module.exports = {
    getStruct: buildStruct,
    ipToLong: ipToLong
}