const config = {
  endpoint:
    process.env.NODE_ENV === 'production'
      ? 'https://stupid-inventions.herokuapp.com'
      : 'localhost:5000',
};

export default config;
