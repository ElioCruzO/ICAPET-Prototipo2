// src/lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'DMR003QP10#a',
  database: 'agendaicapet',
});
