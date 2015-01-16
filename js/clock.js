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
