var numAlarms = 0;

var colorMin = {
    hot     : 90,
    warm    : 80,
    nice    : 70,
    chilly  : 60,
    cold    : -Infinity
};

function pad(num, width)
{
    var num = num.toString();
    while (num.length < width) {
        num = "0" + num;
    }
    return num;
}

/***** CLOCK *****/

function getTime()
{
    var d = new Date();

    document.getElementById("clock").innerHTML = d.toLocaleTimeString();

    setTimeout(getTime, 1000);
}

/***** WEATHER *****/

function getTempColor(tempMax)
{
    for (var color in colorMin) {
        if (tempMax >= colorMin[color]) {
            return color;
        }
    }
}

function getTempIcon(icon)
{
    return "img/" + icon + ".png";
}

function getTempAt(location)
{
    $.getJSON(
        "https://api.forecast.io/forecast/01fbf82a270e1727c3a718749c5309c5/" + location + "?callback=?",
        function(data) {
            $("#forecastLabel").html(data["daily"]["summary"]);
            $("#forecastLocation").html("Location: " + location);
            $("#forecastIcon").attr("src", getTempIcon(data["daily"]["icon"]));
            $("body").addClass(getTempColor(data["daily"]["data"][0]["temperatureMax"]));
        }
    );
}

function getTemp()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            getTempAt(position.coords.latitude + "," + position.coords.longitude);
        });
    }
    else {
        alert("Geolocation is not supported.");
    }
}

/***** ALARM *****/

function initTimeContainer()
{
    for (var h=1; h<=12; h++) {
        $("#hours").append("<option>" + pad(h, 2) + "</option>");
    }

    for (var m=0; m<60; m++) {
        $("#mins").append("<option>" + pad(m, 2) + "</option>");
    }
}

function showAlarmPopup()
{
    $("#mask, #popup").removeClass("hide");
}

function hideAlarmPopup()
{
    $("#mask, #popup").addClass("hide");
}

function insertAlarm(time, alarmName)
{
    var newAlarm = $("<div>").addClass("flexable");

    newAlarm.append($("<div>").addClass("name").html(alarmName));
    newAlarm.append($("<div>").addClass("time").html(time));

    $("#alarms").append(newAlarm);

    numAlarms++;
}

function addAlarm()
{
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();

    var time = hours + ":" + mins + " " + ampm;
    var alarmName = $("#alarmName").val();

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
    alarmObject.save({
        "time"      : time,
        "alarmName" : alarmName
    }, {
        success: function(object) {
            insertAlarm(time, alarmName);
            checkNoAlarms();
            hideAlarmPopup();
        }
    });
}

function getAllAlarms()
{
    Parse.initialize("bI3vLxElIBBHN4KSEq0SFVk2fWZi3ZOYgGSf0hQk",
        "fFzh4GOb6fQKHHrsLsgHFdFO2Apj1zIWaSJQVA41");

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
            for (var i=0; i<results.length; i++) {
                var object = results[i];
                insertAlarm(object.get('time'), object.get('alarmName'));
            }
            checkNoAlarms();
        }
    })
}

function checkNoAlarms()
{
    if (numAlarms === 0) {
        $("#noAlarms").removeClass("hide");
    }
    else {
        $("#noAlarms").addClass("hide");
    }
}

$(document).ready(function() {
    getTime();
    getTemp();
    initTimeContainer();
    getAllAlarms();
});
