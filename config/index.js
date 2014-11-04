var config = {
    // App Config.
    port: 3000,

    // File split system Config.
    generated_files_path: __dirname + '/../var/normalized/',
    records_per_file: 100000,
    file_ttl: 25000 // 25s
};

module.exports = config;