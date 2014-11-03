var port = 3000,
    express = require('express'),
    app = express(),
    debug = require('debug')('lookup:init'),
    ipParser = require('./lib/ipParser'),
    lookup = require('./lib/lookup'),
    ipList = []
;

app.get('/api/v1/ip/:ip', function(req, res, next) {
    var ip = req.param("ip"),
        ipLong = ipParser.ipToLong(ip)
    ;

    if(isNaN(ipLong)) {
        res.json({country: null});
        return;
    }

    debug('Searching for %s as %s', ip, ipLong);

    lookup.getCountry(ipLong, ipList, function(err, country) {
        debug('%s, %s', err, country);

        if (err) {
            res.json({country: null});
            return;
        }

        res.json({country: country});
    });
});

ipParser.getStruct(__dirname + '/var/partial.csv', function(err, list) {
    ipList = list;

    app.listen(port, function() {
        debug('App listening in %d', port)
    });

});