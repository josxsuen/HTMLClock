var colorMin = {
    hot     : 90,
    warm    : 80,
    nice    : 70,
    chilly  : 60,
    cold    : -Infinity
};

function getTime()
{
    var d = new Date();

    document.getElementById("clock").innerHTML = d.toLocaleTimeString();

    setTimeout(getTime, 1000);
}

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

function pad(num, width)
{
    var num = num.toString();
    while (num.length < width) {
        num = "0" + num;
    }
    return num;
}

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

function insertAlarm(hours, mins, ampm, alarmName)
{
    var newAlarm = $("<div>").addClass("flexable");

    newAlarm.append($("<div>").addClass("name").html(alarmName));
    newAlarm.append($("<div>").addClass("time").html(hours + ":" + mins + " " + ampm));

    $("#alarms").append(newAlarm);
}

function addAlarm()
{
    var hours = $("#hours option:selected").text();
    var mins  = $("#mins option:selected").text();
    var ampm  = $("#ampm option:selected").text();
    var alarmName = $("#alarmName").val();

    insertAlarm(hours, mins, ampm, alarmName);
    hideAlarmPopup();
}
