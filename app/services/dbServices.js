
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const dbServices = {
    InitDB: function(){
        client.connect();

        client.query('CREATE TABLE drawplayers (lineid VARCHAR(100) PRIMARY KEY, name VARCHAR(50), sendto VARCHAR(30), year INT, activeno SMALLINT);') 
                .then((result) => {
                    console.log(JSON.stringify(result));
                    client.end();
                })
                .catch(e => console.log(e));
    },
    AttendDrawing: function(name, lineID, year, activeNO){
        client.connect();
        let queryParams = [lineID, year, activeNO];
        let insertParams = [lineID, name, year, activeNO];
        return client.query('SELECT * FROM drawplayers WHERE lineid = $1 AND year = $2 AND activeno = $3', queryParams)
            .then((result) => {
                if(result.rows.length == 0){
                    client.query('INSERT INTO drawplayers(lineid, name, year, activeno) values($1, $2, $3, $4)', insertParams)
                        .then((result) => {
                            console.log(JSON.stringify(result));
                            client.query('SELECT * FROM drawplayers WHERE lineid = $1 AND year = $2 AND activeno = $3', queryParams)
                                .then((result) => {
                                })
                                .catch(e => console.log(e));
                            return "Done";
                        })
                        .catch(e => console.log(e))
                        .then(() => client.end());
                }else{
                    return "Attened";
                }
            })
            .catch(e => console.log(e));
    },

    Drawing: function(name, lineID, year, groupType){
        client.connect();
    }

}



module.exports = dbServices;