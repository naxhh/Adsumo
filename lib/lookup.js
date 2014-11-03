var debug = require('debug')('lookup:lookup');

module.exports = {
    getCountry: function getCountry(ipLong, ipList, callback) {
        var Lb = 0,
            Ub = ipList.length - 1,
            M = Math.floor((Lb + Ub) / 2),
            record = ipList[M],
            UbList,
            LbList
        ;

        // No more nodes to match :)
        if (M < 0 ) {
            callback('IP not found', null);
            return;
        }

        // Check if middle node matches.
        if (ipLong >= record.first && ipLong <= record.last ) {
            
            callback(null, record.country);
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
}