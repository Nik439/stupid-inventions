const config = {
  port: 5000,
  db:
    'mongodb+srv://' +
    process.env.DB_NAME +
    ':' +
    process.env.DB_PASS +
    '@' +
    process.env.DB_URL,
};

module.exports = config;
