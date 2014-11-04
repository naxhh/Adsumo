var port = 3000,
    express = require('express'),
    app = express(),
    debug = require('debug')('lookup:init'),
    ipParser = require('./lib/ipParser'),
    LookupLib = require('./lib/lookup'),
    Cache = require('./lib/cache'),
    Lookup
;

app.get('/api/v1/ip/:ip', function(req, res, next) {
    var ip = req.param("ip");

    debug('Searching for %s', ip);

    Lookup.getCountry(ip, function(err, country) {
        debug('%s, %s', err, country);

        if (err) {
            res.json({country: null});
            return;
        }

        res.json({country: country});
    });
});

ipParser.getStruct(__dirname + '/var/partial.csv', function(err, filesList) {
    Lookup = new LookupLib(filesList, new Cache);

    app.listen(port, function() {
        debug('App listening in %d', port)
    });

});