import mysql from 'mysql2/promise';

declare global {
  var connection: mysql.Pool | undefined;
}

if (!process.env.MYSQL_HOST) throw new Error("MYSQL_HOST is not defined");
if (!process.env.MYSQL_USER) throw new Error("MYSQL_USER is not defined");
if (!process.env.MYSQL_PASSWORD) throw new Error("MYSQL_PASSWORD is not defined");
if (!process.env.MYSQL_DATABASE) throw new Error("MYSQL_DATABASE is not defined");


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export const db = pool;
