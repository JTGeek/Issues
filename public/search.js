const {
    CV_APIKEY
} = require('../config');

const filter = ''; //will get from clientside input. 
$.ajax({
    type: "GET",
    url: "http://comicvine.gamespot.com/api/characters/?api_key=" + CV_APIKEY + "&format=json&filter=" + filter,
    async: true,
    dataType: "json",
    success: function (json) {
        //filter out json array, for images and embedded subdoc
        // console.log(json);
        var events = json._embedded.events;
        var e = document.getElementById("events");
        e.innerHTML = events.length + " events found. Click the markers on the map for more information on a specific venue.";

        console.log(json);
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            addMarker(map, event);
        };

    },
    error: function (xhr, status, err) {
        console.log(err);
    }
});