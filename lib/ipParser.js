var debug = require('debug')('lookup:parser')
    csv = require('ya-csv'),
    ipList = []
;

module.exports = {
    getStruct: function getStruct(fileDir, callback) {
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
}