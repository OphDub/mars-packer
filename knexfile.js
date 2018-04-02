module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/mars_packer',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
};
