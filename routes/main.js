var ejs= require("ejs");
var mysql = require('./mysql');

exports.listuserSensorDetails = function (req, res) {
    var username = req.body.username;
    var userSensorsInfo = "select * from sensor where UserName = '" + username + "' and Status != 'terminated';";
    var sensorlist = {};
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results != null) {
                sensorlist = results;
            }
            var json_response={"statusCode":200,"sensorlist":sensorlist};
            res.send(json_response);
        }
    }, userSensorsInfo);
};

exports.listsensorhub = function(req, res){
    var username = req.body.username;
    var getHubName = "select distinct SensorHubName from sensor where UserName = '" + username + "' and Status != 'terminated';";
    var hubnamelist = {};
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results != null) {
                hubnamelist = results;
            }
            console.log("Entered here :" + JSON.stringify(hubnamelist));
            var json_response={"statusCode":200,"hubnamelist":hubnamelist};
            res.send(json_response);
        }
    }, getHubName);
};

exports.getSensorTypeCount = function(req, res){
    var username = req.body.username;
    var sensorhubname = req.body.hubname;
    var sensorType = req.body.sensorType;
    var getSensorCount = "select *  from sensor where UserName = '" + username + "' and SensorHubName = '" + sensorhubname + "' and SensorType= '"+ sensorType + "' and Status != 'terminated';";
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {

            console.log(results);
            var json_response={"statusCode":200,"count": results.length};
            res.send(json_response);
        }
    }, getSensorCount);
};

exports.listsensors = function(req, res){
    var username = req.body.username;
    var sensorhubname = req.body.hubname;
    var getSensorList = "select distinct SensorType from sensor where UserName = '" + username + "' and SensorHubName = '" + sensorhubname + "' and Status != 'terminated';";
    var sensorlist = {};
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results != null) {
                sensorlist = results;
            }
            var json_response={"statusCode":200,"sensorlist":sensorlist};
            res.send(json_response);
        }
    }, getSensorList);
};

exports.listSensorsInstances = function(req, res){

    var username = req.body.username;
    var sensorType = req.body.sensorType;
    var hubname = req.body.hubname;
    var getSensorInstancesList = "select * from usersensorhubdetails where username = '" + username + "' and SensorHubName = '" + hubname + "' and SensorType = '"
        + sensorType + "';";
    console.log(getSensorInstancesList);
    var sensorInstanceslist = {};
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results != null) {
                sensorInstanceslist = results;
            }
            var json_response={"statusCode":200,"sensorInstanceslist":sensorInstanceslist};
            res.send(json_response);
        }
    }, getSensorInstancesList);
};

exports.getSensorData = function(req,res){
    var username = req.body.username;
    var sensorId = req.body.sensorid;
    var startDate = req.body.startDate;
    var getSensorData = "select * from sensorData where sensorId = '" + sensorId + "';";
    console.log(getSensorData);
    var sensorData = {};
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results != null) {
                sensorData = results;
            }
            var json_response={"statusCode":200,"sensorData":sensorData};
            console.log("Hey there"+sensorData[0].TimeStamp);
            res.send(json_response);
        }
    }, getSensorData);
};

exports.getAllSensorHubBilling = function(req,res){
    var username = req.body.username;
    var getSensorHubList = "SELECT SC.id, S.SensorHubName, SUM(SD.ChargePerHour*S.ActiveHours) AS Charges FROM sensor S JOIN sensordetails SD ON SD.SensorType = S.SensorType JOIN sensorcluster SC ON SC.SensorHubName = S.SensorHubName WHERE SC.UserName = '"+username+"' GROUP BY S.SensorHubName, SC.id;";
    var total=0;
    console.log(getSensorHubList);
    var sensorHubList = [];
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else  {
            if (results.length > 0) {
                for(var i=0;i<results.length;i++){
                    var sensorHub={}
                    sensorHub.id = results[i].id;
                    sensorHub.SensorHubName = results[i].SensorHubName;
                    sensorHub.cost = results[i].Charges;
                    sensorHubList.push(sensorHub);
                    total = total +parseInt(results[i].Charges);
                }
                var json_response={"statusCode":200,"sensorHubList":sensorHubList,"totalCost":total};
                res.send(json_response);

            }else{
                console.log("came-----------------------");
            }
        }
    }, getSensorHubList);
};

exports.getIndividualSensorHubBilling = function(req, res){

    var username = req.body.username;
    var hubname = req.body.sensorHubName;
    var getSensorInstancesList = "select A.sensorId, A.activehours, B.ChargePerHour,(B.ChargePerHour * A.ActiveHours) AS 'Charges' from sensor A join sensordetails B where A.SensorType = B.SensorType and A.SensorHubName = '"+hubname+"';";;
    var total=0;
    console.log(getSensorInstancesList);
    var sensorInstanceslist = [];
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else  {
            if (results.length > 0) {
                for(var i=0;i<results.length;i++){
                    var sensorHub={}
                    sensorHub.sensorId = results[i].sensorId;
                    sensorHub.usage = results[i].activehours;
                    sensorHub.chargesPerHour = results[i].ChargePerHour;
                    sensorHub.cost = results[i].Charges;
                    sensorInstanceslist.push(sensorHub);
                    total = total +parseInt(results[i].Charges);

                }
                var json_response={"statusCode":200,"sensorInstanceslist":sensorInstanceslist,"totalCost":total};
                res.send(json_response);

            }else{
                console.log("came-----------------------");
            }
        }
    }, getSensorInstancesList);
};