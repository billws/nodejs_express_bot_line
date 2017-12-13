
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const dbServices = {
    init: function(){
        client.connect();

        client.query('CREATE TABLE players (id UUID, name VARCHAR(30), lineid VARCHAR(100), sendto VARCHAR(30));', (err, res) => {
            if (err) throw err;
            console.log(JSON.stringify(row));
        });
        client.query('INSERT INTO players (name) VALUES("小左"), ("卡卡"), ("書包"), ("瑋誠"), ("香香"), ("旅人");', (err, res) => {
            if (err) throw err;
            console.log(JSON.stringify(row));
        });

        client.query('SELECT * FROM players;', (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
              console.log(JSON.stringify(row));
            }
          });

        client.end();
    }
}



module.exports = dbServices;