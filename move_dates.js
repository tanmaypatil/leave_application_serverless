var AWS = require("aws-sdk");
let date_util = require('./date_util');

AWS.config.update({
    region: "ap-south-1",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

function process_alarms(alarms) {
    for (let a of alarms) {
        insert_alarm(a);
    }
}

// move dates for successful alarms
function move_dates(alarms) {
    let alarm = {
        alarm_date: '20211008',
        frequency: 'Monthly',
        user_id: "u1",
        entity_id: "a3",
        description: "electricity bill",
        frequency: "Monthly",
        day: "08"
    };
    insertAlarm(alarm);

}

function insertAlarm(alarm) {
    return new Promise(function (resolve, reject) {
        let old_date = alarm.alarm_date;
        let duration_type = alarm.frequency;
        let new_alarmdate = date_util.addDuration(duration_type, 1, old_date);
        console.log('old_date is : ' + old_date);
        console.log('new_alarmdate is : ' + new_alarmdate);
        // generate new alarm id 
        let id = alarm.entity_id.substr(1);
        let new_id =  parseInt(id) + 1 ;
        let entity_id = 'a' + new_id.toString();
        console.log(' new alarm id '+entity_id);
        // want to insert a new alarm with new_alarmdate 
        var params = {
            TableName: "user_alarms",
            Item: {
                "alarm_type": "reminder",
                "alarm_date": new_alarmdate,
                "user_id": alarm.user_id,
                "entity_id": entity_id,
                "description": alarm.description,
                "frequency": alarm.frequency,
                "day": alarm.day,
                "type": "generated"

            }
        };
        console.log("adding new alaram");
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

module.exports = {
    insertAlarm : insertAlarm

}
move_dates();
