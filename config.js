exports.DATABASE_URL = global.TEST_DATABASE_URL || process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'comicsarecool';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.CV_APIKEY = process.env.CV_APIKEY || '811257a1a6ca2c21707f7ad0207533f431883722';