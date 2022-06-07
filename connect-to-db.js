const mssql = require("mssql/msnodesqlv8");

//connect to a database
function connect(dbName) {
  const sqlServerConfig = {
    driver: "msnodesqlv8",
    server: process.env.SERVER,
    database: dbName,
    options: {
      trustedConnection: true,
      useUTC: true,
    },
  };
  const pool = new mssql.ConnectionPool(sqlServerConfig);
  pool
    .connect()
    .then(() => {
      console.log("Connected to SQL Server on database: " + dbName);
    })
    .catch((err) => {
      console.log(err);
    });
  return pool;
}

module.exports = connect;
