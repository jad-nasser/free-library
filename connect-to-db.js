const mssql = require("mssql/msnodesqlv8");

//this method is to connect to a database and also it creates the database models in the database if they are
//not exist yet
function connect(dbName) {
  mssql.on("error", (err) => {
    console.log(err);
  });
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
      //checking if tables exists in the database
      let query1 =
        "IF OBJECT_ID('Publishers','U') IS NOT NULL" +
        " " +
        "SELECT 1 AS isExists ELSE SELECT 0 AS	isExists";
      let query2 =
        "IF OBJECT_ID('Books','U') IS NOT NULL" +
        " " +
        "SELECT 1 AS isExists ELSE SELECT 0 AS	isExists";
      return pool.request().query(query1 + " " + query2);
    })
    .then((results) => {
      let queryText = "";
      //if Publishers table not exist then creating the table
      if (!results.recordsets[0][0].isExists)
        queryText =
          queryText +
          "CREATE TABLE Publishers (" +
          "id INT IDENTITY(1,1) PRIMARY KEY," +
          "first_name NVARCHAR(50) NOT NULL," +
          "last_name NVARCHAR(50) NOT NULL," +
          "email NVARCHAR(50) UNIQUE NOT NULL," +
          "account_password NVARCHAR(50) NOT NULL," +
          ")";
      //if Books table not exist then creating the table
      if (!results.recordsets[1][0].isExists)
        queryText =
          queryText +
          " " +
          "CREATE TABLE Books (" +
          "id INT IDENTITY(1,1) PRIMARY KEY," +
          "book_name NVARCHAR(50) NOT NULL," +
          "author NVARCHAR(50) NOT NULL," +
          "file_path NVARCHAR(100) NOT NULL," +
          "publisher_id INT FOREIGN KEY REFERENCES Publishers(id) NOT NULL," +
          ")";
      return pool.request().query(queryText);
    })
    .then(() => {
      console.log("Connected to SQL Server on database: " + dbName);
    })
    .catch((err) => {
      console.log(err);
    });
  return pool;
}

module.exports = connect;
