function getTime()
{
    var d = new Date();

    document.getElementById("clock").innerHTML = d.toLocaleTimeString();

    setTimeout(getTime, 1000);
}

function getTempColor(tempMax)
{
    if (tempMax >= 90) {
        return "hot";
    }
    else if (tempMax >= 80) {
        return "nice";
    }
    else if (tempMax >= 70) {
        return "warm";
    }
    else if (tempMax >= 60) {
        return "chilly";
    }
    else {
        return "cold";
    }
}

function getTemp()
{
    $.getJSON(
        "https://api.forecast.io/forecast/01fbf82a270e1727c3a718749c5309c5/35.300399,-120.662362?callback=?",
        function(data) {
            $("#forecastLabel").html(data["daily"]["summary"]);
            $("#forecastIcon").attr("src", "img/"+data["daily"]["icon"]+".png");
            $("body").addClass(getTempColor(data["daily"]["data"][0]["temperatureMax"]));
        }
    );
}
