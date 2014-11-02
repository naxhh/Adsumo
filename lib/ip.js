module.exports = {
    toIp: function toIp(num) {
        var d = num%256;
        for (var i = 3; i > 0; i--)
        {
            num = Math.floor(num/256);
            d = num%256 + '.' + d;
        }

        return d;
    },

    toLong: function toLong(ip) {
        var d = ip.split('.');
        return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
    }
};