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
        var ipList = this._filesList.slice(0),
            Lb = 0,
            Ub = ipList.length -1,
            M = Math.floor((Lb + Ub) / 2),
            record = ipList[M],
            isInRange
        ;

        while (true) {
            isInRange = ipLong >= record && (typeof ipList[M+1] == 'undefined' || ipLong < ipList[M+1]);

            if (isInRange) {
                jf.readFile(generated_file_path + record, callback)
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
            } else if (ipLong < record.first) { // else only?
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