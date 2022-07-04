const mssql = require("mssql/msnodesqlv8");
let pool = null;

//this method is to connect to a database and also it creates the database models in the database if they are
//not exist yet
exports.connect = function connect(dbName) {
  //on error listener
  mssql.on("error", (err) => {
    console.log(err);
  });
  //setting up mssql
  const sqlServerConfig = {
    driver: "msnodesqlv8",
    server: process.env.SERVER,
    database: dbName,
    options: {
      trustedConnection: true,
      useUTC: true,
    },
  };
  return (
    //checking if there are an already connected pool and closing it
    new Promise((resolve, reject) => {
      if (pool) resolve(pool.close());
      resolve(true);
    })
      //creating a new pool and connecting to it
      .then(() => {
        pool = new mssql.ConnectionPool(sqlServerConfig);
        return pool.connect().then(() => {});
      })
      //sending Exist query to the database to check if the tables are exisst
      .then(() => {
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
      //if the tables are not exists then sending queries to create them
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
            "account_password NVARCHAR(100) NOT NULL," +
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
            "publisher_id INT NOT NULL," +
            "number_of_downloads INT DEFAULT 0," +
            ")";
        return pool.request().query(queryText);
      })
      //inform the successfull connection to the database
      .then(() => {
        console.log("Connected to SQL Server on database: " + dbName);
        return pool;
      })
      .catch((err) => {
        console.log(err);
      })
  );
};
//-------------------------------------------------------------------------------------------------

//this method will get the current connection pool
exports.getCurrentPool = () => pool;
