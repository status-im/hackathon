module.exports = {
  migrations_directory: "./migrations",
  networks: {
    remote: {
      host: "10.0.2.67",
      port: 8546,
      network_id: "*" // Match any network id
    },
    local: {
      host: "localhost",
      port: 8546,
      network_id: "*"
    },
    development: {
      host: "localhost",
      port: 8546,
      network_id: "*"
    }
  }
};
