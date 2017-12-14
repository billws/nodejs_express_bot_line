
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
    InitDB: function(lineClient, lineevent){
        let client = this.InitDBClient();
        client.connect();
        
        client.query('CREATE TABLE drawplayers (lineid VARCHAR(100) PRIMARY KEY, name VARCHAR(50), sendto VARCHAR(50), year INT, activeno SMALLINT);') 
                .then((result) => {
                    console.log(JSON.stringify(result));
                    const echo = { type: 'text', text: "Active Success！" };
                    return lineClient.replyMessage(lineevent.replyToken, echo);
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
                    client.end();
                    return lineClient.replyMessage(replyToken, echo);
                }
            })
            .catch(e => {
                console.log(e);
                client.end();
            });
    },

    CheckDrawingPlayers: function(lineClient, replyToken, name, lineID, year, activeNO){
        let client = this.InitDBClient();
        client.connect();
        let queryParams = [year, activeNO];
        client.query('SELECT * FROM drawplayers WHERE year = $1 AND activeno = $2', queryParams)
            .then((result) => {
                let allPlayer = "";
                for (let row of result.rows) {
                    console.log(JSON.stringify(row));
                    //allPlayer += `ID: ${row.lineid}, NAME: ${row.name}\n`;
                    allPlayer += `${row.name}\n`;
                }
                const echo = { type: 'text', text: allPlayer };
                return lineClient.replyMessage(replyToken, echo);
            })
            .catch(e => console.log(e))
            .then(() => client.end());
    },

    Drawing: function(lineClient, lineEvent, lineID, year, activeNO){
        let client = this.InitDBClient();
        client.connect();
        let queryParams = [year, activeNO];
        client.query('SELECT * FROM drawplayers WHERE year = $1 AND activeno = $2', queryParams)
        .then((result) => {
            let datas = {};
            let own = {};
            let other = [];
            let hasSendTo = false;
            console.log(result.rows.length);
            if(result.rows.length > 0) {
                datas.length = result.rows.length;
                datas.rows = result.rows;
                for (let row of datas.rows) {
                    if(row.lineid === lineID){
                        own = row;
                    }else{
                        other.push(row);
                    }
                }
                if(own.sendto){
                    hasSendTo = true;
                }
                datas.own = own;
                datas.hasSendTo = hasSendTo;
                datas.other = other;
            } else {
                datas.length = 0;
                datas.own = own;
                datas.hasSendTo = hasSendTo;
            }
            return datas;
        })
        .then((datas) => {
            console.log(datas);
            if(datas.length > 0 && Object.keys(datas.own).length > 0 && !datas.hasSendTo && datas.other.length > 0){
                let otherNumber = datas.other.length;
                let randomNumber = Math.floor(Math.random() * (otherNumber - 1) + 1);
                let sendTo = datas.other[randomNumber - 1].name;
                let insertParams = [sendTo, lineID];
                client.query('UPDATE drawplayers SET sendto=($1) WHERE lineid=($2)', insertParams)
                .then((result) => {
                    const echo = { type: 'text', text: `您送禮物的對象是${sendTo}` };
                    return lineClient.replyMessage(replyToken, echo);
                })
                .catch(e => console.log(e))
                .then(() => client.end());
            } else if(datas.hasSendTo) {
                const echo = { type: 'text', text: `您送禮物的對象是${datas.own.sendto}` };
                client.end();
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            } else {
                const echo = { type: 'text', text: "沒有人給你抽喔..." };
                client.end();
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            }
        })
        .catch(e => {
            console.log(e);
            client.end();
        });
    }

}



module.exports = dbServices;