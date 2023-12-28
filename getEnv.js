function getEnv() {
  if (process.env.env == 'dev') {
    return String(process.env.database_dev);
  } else {
    return String(process.env.database_prod);
  }
}

module.exports = getEnv;
