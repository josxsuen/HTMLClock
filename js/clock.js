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

    for (var m=0; m<60; m+=5) {
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

function removeAlarm(object, alarm)
{
    object.destroy({
        success: function(object) {
            alarm.remove();
            checkNoAlarms();
        }
    });
}

function insertAlarm(object)
{
    var newAlarm = $("<div>").addClass("flexable alarm");
    var text = $("<div>");

    text.append($("<div>").addClass("time").html(object.get('time') + " " + object.get('ampm')));
    text.append($("<div>").addClass("name").html(object.get('alarmName')));

    var removeButton = $("<input>").addClass("button");

    removeButton.attr("type", "button");
    removeButton.val("Remove");
    removeButton.click(function() {
        removeAlarm(object, newAlarm);
    });

    newAlarm.append(text);
    newAlarm.append(removeButton);

    $("#alarms").append(newAlarm);

    numAlarms++;
}

function addAlarm()
{
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();

    var time = hours + ":" + mins;
    var alarmName = $("#alarmName").val();

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();

    gapi.client.plus.people.get({
        'userId' : 'me'
    }).then(function(res) {
        alarmObject.save({
            "time"      : time,
            "ampm"      : ampm,
            "alarmName" : alarmName,
            "userid"    : res.result.id
        }, {
            success: function(object) {
                insertAlarm(object);
                checkNoAlarms();
                hideAlarmPopup();
            }
        });
    });
}

function getAllAlarms(userid)
{
    Parse.initialize(
        "bI3vLxElIBBHN4KSEq0SFVk2fWZi3ZOYgGSf0hQk",
        "fFzh4GOb6fQKHHrsLsgHFdFO2Apj1zIWaSJQVA41"
        );

    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.equalTo("userid", userid);
    query.ascending("ampm");
    query.ascending("time");
    query.find({
        success: function(results) {
            for (var i=0; i<results.length; i++) {
                insertAlarm(results[i]);
            }
            checkNoAlarms();
        }
    });
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
});

/***** AUTHENTICATION *****/

function signin(userid) {
    console.log("signed in: " + userid);
    $('#signinButton').addClass("hide");
    $("#signoutButton", "#addAlarm").removeClass("hide");

    getAllAlarms(userid); // display alarms for user
}

function signout() {
    console.log("signed out");
    $("#signinButton").removeClass("hide");
    $("#signoutButton", "#addAlarm", "#noAlarms").addClass("hide");

    $("#alarms").find(":not(#noAlarms)").remove(); // clear any alarms
}

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        gapi.client.load('plus','v1').then(function() {

            gapi.client.plus.people.get({
                'userId' : 'me'
            }).then(function(res) {
                signin(res.result.id);
            });

        });
    }
    else if (authResult['error'] === 'user_signed_out') {
        signout();
    }
    else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult['error']);
    }
}
