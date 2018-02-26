var map;
var markers= [];
var infowindows = [];
var geocoder;
var CLIENT_ID = "O0HFWZAZW5VB1LL42BCW5VQQBNCETBVHXEHXFLU2MWKKS5GC";
	var CLIENT_SECRET = "KCVBNGHC3P4RV401J0RJOVP4RNJ1GJL3PCUPVYAAIRM2ZFEE";


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.098005, lng: -94.581834},
    zoom: 15
    });
	
	geocoder = new google.maps.Geocoder();
	ko.applyBindings(new ViewModel());
	
}



var kcList = [
		{
			name:'Up-Down KC',
         address: '101 Southwest Blvd, Kansas City, MO 64108',
		 id: '5531913c498ea6903c5eabc1'
		},
		
		{
			name: 'Jack Stack Barbecue',
		 address: '101 W 22nd St #300, Kansas City, MO 64108',
		 id: '4ad92984f964a520b31821e3'
		},
		{
			name: 'Union Station Kansas City',
		 address: '30 W Pershing Rd, Kansas City, MO 64108',
		 id: '4f885099e4b0cec3aa2c928a'
		},
		
		{
			name: 'LEGOLAND Discovery Center Kansas City',
		 address: '2475 Grand Blvd, Kansas City, MO 64108',
		 id:'4e83423c93ad9516fc9aa3a5'
		},
		
		{
			name: 'National World War I Museum and Memorial',
		 address: '2 Memorial Dr, Kansas City, MO 64108',
			  id:'4f9c0ba5e4b04dd7353a754d'
		}
];

var Place = function(data){
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.id = ko.observable(data.id);
}

var ViewModel= function(){
	var self= this;
	
	this.locations = ko.observableArray([]);
	kcList.forEach(function(locationItem){
	   self.locations.push(new Place(locationItem));
	   geocodeAddress(geocoder, map, locationItem);
		
});
		
	

function geocodeAddress(geocoder, resultsMap, myLocation) {
	  var address = myLocation.address;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location); 
			 var infowindow = new google.maps.InfoWindow(); 
			
            //TODO: Insert code here to take the first result's formatted address, and LOCATION.
            var marker = new google.maps.Marker({
				map : resultsMap,
				position: results[0].geometry.location,
				animation: google.maps.Animation.DROP
			});
			markers.push(marker);
//Ajax call to get Foursquare information about my different locations. 
			$.ajax({
					type: "GET",
					dataType: 'json',
					cache: false,
					async: true, 
					url: "https://api.foursquare.com/v2/venues/"+ myLocation.id +"?client_id="+ CLIENT_ID +"&client_secret=" +CLIENT_SECRET+"&v=20180224"
				})
				.done(function( data ) { 
					infowindow.setContent("<div> Name: "+ data.response.venue.name + "<br/>" 
					+ " Contacts:" + data.response.venue.contact.formattedPhone + "<br/>"
					+ "Rating:" + data.response.venue.rating + "</div>");
					console.log("Data returned successfully.");
	
				})
				.fail(function() {
					console.log( "Unable to retrieve  foursquare data about this location ");
				});
			infowindows.push(infowindow);
			//Create an onclick event to open an Infowindow at each marker
			marker.addListener('click', function(){
			//Show the infoWindow
			infowindow.open(map, marker);
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(marker.setAnimation(null), 15000);
			
			});
		
						
			marker.addListener('closeclick', function(){
			    marker.setAnimation(null);
				infowindow.marker = null;
				});
			
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
	  


		
	
		
}




	

