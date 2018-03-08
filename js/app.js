var map;
var markers = [];
var infowindows = [];
var geocoder;
var visible;
var CLIENT_ID = "O0HFWZAZW5VB1LL42BCW5VQQBNCETBVHXEHXFLU2MWKKS5GC";
var CLIENT_SECRET = "KCVBNGHC3P4RV401J0RJOVP4RNJ1GJL3PCUPVYAAIRM2ZFEE";


function initMap() {
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 39.098005,
                lng: -94.581834
            },
            zoom: 15
        });
    } catch (e) {
        alert("Something went wrong. Unable to load the map.");
    }

    geocoder = new google.maps.Geocoder();
    ko.applyBindings(new ViewModel());

}


//Creation of the array of locations in Kansas City
var kcList = [{
        name: 'Up-Down KC',
        address: '101 Southwest Blvd, Kansas City, MO 64108',
        id: '5531913c498ea6903c5eabc1',
        category: 'Entertainment',
        visible: ko.observable(true)

    },

    {
        name: 'Jack Stack Barbecue',
        address: '101 W 22nd St #300, Kansas City, MO 64108',
        id: '4ad92984f964a520b31821e3',
        category: 'Restaurant',
        visible: ko.observable(true)
    },
    {
        name: 'Union Station Kansas City',
        address: '30 W Pershing Rd, Kansas City, MO 64108',
        id: '4f885099e4b0cec3aa2c928a',
        category: 'Museums and Monuments',
        visible: ko.observable(true)
    },

    {
        name: 'LEGOLAND Discovery Center Kansas City',
        address: '2475 Grand Blvd, Kansas City, MO 64108',
        id: '4e83423c93ad9516fc9aa3a5',
        category: 'Entertainment',
        visible: ko.observable(true)
    },

    {
        name: 'National World War I Museum and Memorial',
        address: '2 Memorial Dr, Kansas City, MO 64108',
        id: '4f9c0ba5e4b04dd7353a754d',
        category: 'Museums and Monuments',
        visible: ko.observable(true)
    }
];


var ViewModel = function() {
    var self = this;
    //var visible = ko.observable(true);
    this.categories = ko.observableArray(["All", "Restaurant", "Museums and Monuments", "Entertainment"]);
    this.selectedCategory = ko.observable("All");
    this.locations = ko.observableArray([]);
    kcList.forEach(function(locationItem) {
        geocodeAddress(geocoder, map, locationItem);
        self.locations.push(locationItem);
    });

    this.controlMarker = function(location) {
        //Show the element infowindow each time the list element is clicked
        markers.forEach(function(markerItem) {
            if (markerItem.name == location.name) {
                google.maps.event.trigger(markerItem.marker, 'click');
            }

        });

    };

    this.filterLocation = function() {
        for (var i = 0; i < this.locations().length; i++) {
            //Get the selected category. If it matches the category of the current location in the array, show that location, or else hide it.
            if (self.selectedCategory() === "All") {
                (this.locations()[i]).visible(true);
            } else if (this.locations()[i].category == self.selectedCategory()) {
                (this.locations()[i]).visible(true);
            } else if (this.locations()[i].category != self.selectedCategory()) {
                (this.locations()[i]).visible(false);
            }

        }

        //Show or hide the marker
        markers.forEach(function(markerItem) {
            if (self.selectedCategory() === "All") {
                markerItem.marker.setVisible(true);
                console.log("Nothing else to do here");
            } else if (markerItem.category == self.selectedCategory()) {
                markerItem.marker.setVisible(true);
            } else if (markerItem.category != self.selectedCategory()) {
                markerItem.marker.setVisible(false);
            }


        });
    };



    function geocodeAddress(geocoder, resultsMap, myLocation) {
        var address = myLocation.address;
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                var infowindow = new google.maps.InfoWindow();

                //TODO: Insert code here to take the first result's formatted address, and LOCATION.
                myLocation.marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                    animation: google.maps.Animation.DROP
                });

                markers.push({
                    name: myLocation.name,
                    marker: myLocation.marker,
                    category: myLocation.category
                });

                //Ajax call to Foursquare API for information about my different locations. 
                $.ajax({
                        type: "GET",
                        dataType: 'json',
                        cache: false,
                        async: true,
                        url: "https://api.foursquare.com/v2/venues/" + myLocation.id + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20180224"
                    })
                    .done(function(data) {
                        infowindow.setContent("<div> Name: " + data.response.venue.name +
                            "<br/>" + " Contacts:" + data.response.venue.contact.formattedPhone +
                            "<br/>" + "Rating:" + data.response.venue.rating + "</div>");


                    }) //Error message to post on the console.
                    .fail(function() {
                        alert("Unable to retrieve  foursquare data about this location ");
                    });

                myLocation.infowindow = infowindow;
                infowindows.push(myLocation.infowindow);
                //Create an onclick event to open an Infowindow at each marker
                myLocation.marker.addListener('click', function() {
                    //Show the infoWindow
                    myLocation.infowindow.open(map, myLocation.marker);
                    myLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(myLocation.marker.setAnimation(null), 15000);

                });



            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });

    }




};