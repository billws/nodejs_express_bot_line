
const { Client } = require('pg');

/*
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
*/

const dbServices = {
    InitDB: function(){
        client.connect();

        client.query('CREATE TABLE drawplayers (lineid VARCHAR(100) PRIMARY KEY, name VARCHAR(50), sendto VARCHAR(30), year INT, activeno SMALLINT);') 
                .then((result) => {
                    console.log(JSON.stringify(result));
                })
                .catch(e => console.log(e))
                .then(() => client.end());
    },
    AttendDrawing: function(lineClient, replyToken, name, lineID, year, activeNO){
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
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
                console.log("22222222");
                console.log(rowNumber);
                if(rowNumber == 0){
                    client.query('INSERT INTO drawplayers(lineid, name, year, activeno) values($1, $2, $3, $4)', insertParams)
                    .then((result) => {
                        console.log("3333333333");
                        console.log(result);
                        /*console.log(JSON.stringify(result));
                        client.query('SELECT * FROM drawplayers WHERE lineid = $1 AND year = $2 AND activeno = $3', queryParams)
                            .then((result) => {
                            })
                            .catch(e => console.log(e));*/
                            
                            
                        // create a echoing text message
                        const echo = { type: 'text', text: "報名完成" };
                          
                        // use reply API
                        return lineClient.replyMessage(replyToken, echo);
                    })
                    .catch(e => console.log(e))
                    .then(() => client.end());
                }else{
                    // create a echoing text message
                    const echo = { type: 'text', text: "已經報名過了喔" };
                    
                    // use reply API
                    return lineClient.replyMessage(replyToken, echo);
                }
            })
            .catch(e => {
                console.log(e);
                client.end();
            });
    },

    CheckDrawingPlayers: function(){
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        client.connect();
    },

    Drawing: function(name, lineID, year, groupType){
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        client.connect();
    }

}



module.exports = dbServices;