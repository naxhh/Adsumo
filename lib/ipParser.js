var debug = require('debug')('lookup:parser')
    csv = require('ya-csv'),
    ipList = []
;

/**
 * Builds an in-memory struct for a range of long ips and their country.
 * 
 * @param  {String}   fileDir   The path of the dir to load in-memory.
 * @param  {Function} callback
 * @return {void}
 */
var buildStruct = function getStruct(fileDir, callback) {
        debug('CSV parsing start');

        var reader = csv.createCsvFileReader(fileDir);

        reader.addListener('data', function(data) {
            var record = {first: parseInt(data[0]), last: parseInt(data[1]), country: data[3]}

            ipList.push(record);
        });

        reader.addListener('end', function() {
            debug('CSV parsing done');

            callback(null, ipList);
        });
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