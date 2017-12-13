
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const allName = ['小左', '書包', '卡卡', '旅人', '阿賓', '松鼠'];

const dbServices = {
    init: function(){
        console.log(process.env.DATABASE_URL);
        client.connect();

        client.query('CREATE TABLE players (id UUID, name VARCHAR(30), lineid VARCHAR(100), sendto VARCHAR(30));', (err, res) => {
            if (err) throw err;
            console.log(JSON.stringify(res));
            client.query('INSERT INTO players (name) VALUES($1), ($2), ($3), ($4), ($5), ($6);', allName, (err, res) => {
                if (err) throw err;
                console.log(JSON.stringify(res));
                client.query('SELECT * FROM players;', (err, res) => {
                    if (err) throw err;
                    for (let row of res.rows) {
                      console.log(JSON.stringify(row));
                    }
                    client.end();
                });
            });
        });
    }
}



module.exports = dbServices;