
const { Client } = require('pg');

/*
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
*/

const dbServices = {
    InitDBClient: function(){
        return new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    },
    InitDB: function(){
        let client = this.InitDBClient();
        client.connect();

        client.query('CREATE TABLE drawplayers (lineid VARCHAR(100) PRIMARY KEY, name VARCHAR(50), sendto VARCHAR(30), year INT, activeno SMALLINT);') 
                .then((result) => {
                    console.log(JSON.stringify(result));
                })
                .catch(e => console.log(e))
                .then(() => client.end());
    },
    AttendDrawing: function(lineClient, replyToken, name, lineID, year, activeNO){
        let client = this.InitDBClient();
        client.connect();
        let queryParams = [lineID, year, activeNO];
        let insertParams = [lineID, name, year, activeNO];
        return client.query('SELECT * FROM drawplayers WHERE lineid = $1 AND year = $2 AND activeno = $3', queryParams)
            .then((result) => {
                if(result.rows.length == 0){
                    return 0;
                }else{
                    client.end();
                    return 1;
                }
            })
            .then((rowNumber) => {
                if(rowNumber == 0){
                    client.query('INSERT INTO drawplayers(lineid, name, year, activeno) values($1, $2, $3, $4)', insertParams)
                    .then((result) => {
                        const echo = { type: 'text', text: "報名完成！" };
                        return lineClient.replyMessage(replyToken, echo);
                    })
                    .catch(e => console.log(e))
                    .then(() => client.end());
                }else{
                    const echo = { type: 'text', text: "已經報名過了喔！" };
                    return lineClient.replyMessage(replyToken, echo);
                }
            })
            .catch(e => {
                console.log(e);
                client.end();
            });
    },

    CheckDrawingPlayers: function(){
        let client = this.InitDBClient();
        client.connect();
        client.query('SELECT * FROM drawplayers WHERE year = $2 AND activeno = $3', queryParams)
            .then((result) => {
                let allPlayer = "";
                for (let row of result.rows) {
                    console.log(JSON.stringify(row));
                    allPlayer += `ID: ${row.lineid}, NAME: ${row.name}\n`;
                }
                const echo = { type: 'text', text: allPlayer };
                return lineClient.replyMessage(replyToken, echo);
            })
            .catch(e => console.log(e))
            .then(() => client.end());
    },

    Drawing: function(name, lineID, year, groupType){
        let client = this.InitDBClient();
        client.connect();
    }

}



module.exports = dbServices;