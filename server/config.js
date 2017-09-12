exports.DATABASE_URL = global.TEST_DATABASE_URL || process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7";
exports.CV_APIKEY = process.env.CV_APIKEY;