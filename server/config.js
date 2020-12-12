const config = {
  port: 5000,
  db:
    process.env.NODE_ENV === 'production'
      ? 'mongodb+srv://' +
        process.env.DB_NAME +
        ':' +
        process.env.DB_PASS +
        '@' +
        process.env.DB_URL
      : 'mongodb://localhost:27017/stupid-inventions-db',
};

module.exports = config;
