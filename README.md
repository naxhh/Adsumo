# Adsumo Test - IpLookup implementation

This code is an iplookup system using nodeJS.

### Challenge
The main challenge was to don't use external databases or cache systems like redis or memcached.

### Architecture
The server splits the original file in chunks of specified size.
This chunks are kept in a in-memory list.
When an IP is requested we apply binary search to the list of files to find where the IP should be.

We open that file (or load it from memory) and we apply a second binary-search inside that file.

### Cache system.
The main challenge was not to use an external cache system. But we weren't able to provide a good speed loading files from IO all the time.
So I've created an internal cache system.
This wrapper saves in cache the opened files. It keeps the files for the given ttl and deltes old entries.