var debug = require('debug')('lookup:parser')
    csv = require('ya-csv'),
    fs = require('fs'),
    jf = require('jsonfile'),

    filesList = [],
    ipList = [],
    currentLine = 1
;

/**
 * Builds an in-memory struct for a range of long ips and their country.
 *
 * @param  {String}   fileDir   The path of the dir to load in-memory.
 * @param  {Object}   config    The configuration object
 * @param  {Function} callback
 * @return {void}
 */
var buildStruct = function buildStruct(fileDir, config, callback) {
    debug('CSV parsing start');

    var reader = csv.createCsvFileReader(fileDir);

    reader.addListener('data', function(data) {
        var record = {first: parseInt(data[0]), last: parseInt(data[1]), country: data[3]}

        currentLine += 1;
        ipList.push(record);

        if (currentLine % config.records_per_file == 0) {
            var file_name = config["generated_files_path"] + ipList[0].first;

            fs.writeFile(file_name, JSON.stringify(ipList), function(err) {
                if (err) {debug("File: %s error: %s", file_name, err);}
            });

            filesList.push(ipList[0].first);
            ipList = [];
        }
    });

    reader.addListener('end', function() {
        debug('CSV parsing done');

        callback(null, filesList);
    });
}

module.exports = {
    getStruct: buildStruct,
}