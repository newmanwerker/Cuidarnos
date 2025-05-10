const { Pool } = require('pg');

const pool = new Pool({
  user: 'avnadmin', //db user
  host: 'cuidarnosdb-cuidarnosapp.j.aivencloud.com', //db host
  database: 'cuidarnodb', // db name
  password: 'AVNS_Wg-HpBDgRr-paqEj5OJ', // db psw
  port: 10854,
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;