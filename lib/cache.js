var debug = require('debug')('lookup:cache'),
    instance;

/**
 * Yes! This is my own cache system.
 * Because I can't use things like Redis for this task I'm using a very-basic in-memory cache system.
 * But please, never use this in production, use redis. Is just more funnier.
 */
var Cache = function Cache() {
    var self = this;

    /**
     * The in-memory data object.
     * @type {Object}
     */
    this._data = {};

    /**
     * A list of keys with the specified ttls for each item.
     * @type {Array<Object>}
     */
    this._ttls = [];

    /**
     * Garbage collector for the cache system.
     */
    setInterval(function() {
        var time = Date.now();

        self._ttls.forEach(function(item, key) {
            if (item.ttl <= time) {
                self._ttls.splice(key, 1);
                self._data[item.key] = null;
            }
        });
    }, 1000);
}

/**
 * Saves the data in the cache.
 * @param {String} key
 * @param {Mixed} value Any kind of value tu store, null is not allowed :(
 * @param {Integer} ttl Time to die in miliseconds by default is 1000
 */
Cache.prototype.set = function set(key, value, ttl) {
    ttl = ttl || 1000;

    this._ttls.push({key: key, ttl: (Date.now() + ttl) })
    this._data[key] = value;
};

/**
 * Retrieves data stored in a specific key.
 * @param  {String} key
 * @return {Mixed}  Null if was not found.
 */
Cache.prototype.get = function(key) {
    return this._data[key] || null;
};

module.exports = {
    getInstance: function getInstance() {
        if (!instance) {
            instance = new Cache();
        }

        return instance;
    }
};