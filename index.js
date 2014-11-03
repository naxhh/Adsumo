var port = 3000,
    express = require('express'),
    app = express(),
    debug = require('debug')('lookup:init'),
    ipConverter = require('./lib/ip'),
    ipParser = require('./lib/ipParser'),

    ipList = []
;

app.get('/api/v1/ip/:ip', function(req, res, next) {
    var ip = req.param("ip"),
        ipLong = ipConverter.toLong(ip)
    ;

    if(isNaN(ipLong)) {
        res.json({ip: ip, country: null});
        return;
    }

    debug('Searching for %s as %s', ip, ipLong);

    getCountry(ipLong, function(err, country) {
        debug('%s, %s', err, country);

        if (err) {
            res.json({ip: ip, country: null});
            return;
        }

        res.json({ip: ip, country: country});
    });
});

ipParser.getStruct(__dirname + '/var/partial.csv', function(err, list) {
    ipList = list;

    app.listen(port, function() {
        debug('App listening in %d', port)
    });

});


function getCountry(ipLong, callback) {
    var found = false;

    ipList.forEach(function(record) {
        if (ipLong >= record.first && ipLong <= record.last) {
            found = true;
            callback(null, record.country);
            return;
        }
    });

    if (!found) { // temporal fix...
        callback('es', null);
        
    }
}