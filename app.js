"use strict";
//initial data
var placeData = [
	{
        name : 'Pike Place Market',
        wikiName:'Pike_Place_Market',
        type: 'Attraction',
        location: {lat: 47.6101, lng: -122.3421}
      
    },
    {
        name : 'Space Needle',
        wikiName: 'Space_Needle',
        type: 'Attraction',
        location: {lat: 47.6205, lng: -122.3493}
        
    },
    {
        
        name : 'Lake Union',
        wikiName : 'Lake_Union',
        type: 'Nature',
        location: {lat: 47.6392, lng: -122.3337}
     
    },
    {
        
        name : 'Olympic Sculpture Park',
        wikiName : 'Olympic_Sculpture_Park',
        type: 'Park',
        location: {lat: 47.6166, lng: -122.3553}
     
    },
    {
        
        name : 'Seattle Art Museum',
        wikiName : 'Seattle_Art_Museum',
        type : 'Museum/Arboretum',
        location: {lat: 47.6073, lng: -122.3381}
     
    },
    {
        
        name : 'Gas Works Park',
        wikiName : 'Gas_Works_Park',
        type: 'Park',
        location: {lat: 47.6456, lng: -122.3344}
     
    },
    {
    	name : 'Washington Park Arboretum',
    	wikiName: 'Washington_Park_Arboretum',
      type: 'Museum/Arboretum',
    	location: {lat: 47.6398, lng: -122.2945}
    },
    {
      name : 'Seattle Japanese Garden',
      wikiName: 'Seattle_Japanese_Garden',
      type: 'Museum/Arboretum',
      location: {lat: 47.6290, lng: -122.2963}
    },
    {
      name : 'Burke-Gilman Trail',
      wikiName: 'Burke-Gilman_Trail',
      type: 'Nature',
      location: {lat: 47.6957, lng: -122.2783}
    },
    {
    	name : 'Discovery Park',
    	wikiName: 'Discovery_Park_(Seattle)',
      type: 'Park',
    	location: {lat: 47.6573, lng: -122.4055}
    	
    },
    {
    	name : 'Fremont Troll', 
    	wikiName: 'Fremont_Troll', 
      type: 'Attraction',
    	location: {lat: 47.6510, lng: -122.3473}
    }, 
    {
    	name : 'Ballard Locks', 
    	wikiName: 'Ballard_Locks', 
      type: 'Attraction',
    	location: {lat: 47.6655, lng: -122.3970}
    }
];

var map;
var markers =[];
var wikiData = {};

/**
* @description initialize a google map with the specified styles
*/
function initMap() {
	var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#5abcd8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }, {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
          },  {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              }
        ];
// Create a new map 
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 47.6101, lng: -122.3421},
	  zoom: 20,
	  styles:styles
	});
	ko.applyBindings(new viewNeiborhoodModel());
};

// place variable constructor
var Place = function(data){
  this.name = ko.observable(data.name);
  this.wikiName = ko.observable(data.wikiName);
  this.location = ko.observable(data.location);
  this.type = ko.observable(data.type);
  this.marker = ko.observable();
};



var viewNeiborhoodModel = function(){
  var self=this;
	var infowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // favoritePlaces for the base data store
  // selectedPlaces for the subset of data depending on the filter 
  this.favoritePlaces = ko.observableArray([]);
  this.selectedPlaces=ko.observableArray([]);

  // types for dropdown filtering
  this.typeOfPlaces = ko.observableArray(['Show all', 'Attraction', 'Museum/Arboretum', 'Nature', 'Park']);
  
  placeData.forEach(function(data){    
    self.favoritePlaces.push(new Place(data));
  });


  // initialize the currentplace as the first one - indicate which one is active (chosen)
  this.currentPlace = ko.observable(this.favoritePlaces()[0]);

  for (var i = 0; i < this.favoritePlaces().length; i++) {
  	  
  	var position = self.favoritePlaces()[i].location();
    var name = self.favoritePlaces()[i].name();
    var info = self.favoritePlaces()[i].wikiName();

    var defaultIcon = makeMarkerIcon('0750af');
    var activeIcon = makeMarkerIcon('f7f01d');

  	var marker = new google.maps.Marker({
    	  map: map,
    	  position: position,
        name: name,
        animation: google.maps.Animation.DROP,
        id: i,
        icon: defaultIcon,
        info: info
      
  	});
    
    this.favoritePlaces()[i].marker = marker;
   	markers.push(marker);

   	marker.addListener('mouseover', function() {
      if (this.getAnimation() !== null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    });
   

    marker.addListener('mouseout', function(){
      this.setAnimation(null);
    });

    marker.addListener('click', function(){
      this.setAnimation(null);
      populateInfoWindow(this, infowindow);

    })

    	bounds.extend(markers[i].position);
  }

  
  map.fitBounds(bounds);


  // when the user click the name of place from the list, it sets the active place and change the marker color - and populate the window
  this.setPlace = function(clickedPlace){
    if (self.currentPlace != clickedPlace){
      self.currentPlace().marker.setIcon(defaultIcon)
    };
    
    
    self.currentPlace(clickedPlace) 
    populateInfoWindow(self.currentPlace().marker, infowindow)
    self.currentPlace().marker.setIcon(activeIcon)
    
  };

  // when the user filter the type with dropdown menu, it filters out the list view and also markers on the map
  this.selectedPlaces(this.favoritePlaces.slice(0));
  this.selectedType = function filterType(type){
    showAllMarkers();
    if (type == 'Show all'){
      this.selectedPlaces([]);
      this.selectedPlaces(this.favoritePlaces.slice(0));
    }
    else{
      this.selectedPlaces([]);
      for (var i = 0; i < this.favoritePlaces().length; i++) {
        var marker = this.favoritePlaces()[i].marker
        
        if (this.favoritePlaces()[i].type() != type){
          marker.setVisible(false);
        }
        else{
          this.selectedPlaces.push(this.favoritePlaces()[i]);
          marker.setVisible(true);
        }
      } 
    } 
    
  };

  /**
  *@description whenever the infowindow is populated, it requests the data
  * from wikipedia, showing a breif description and offers the link to the 
  * wiki page.
  * @params {object} marker - google map marker which is clicked
  * @params {object} infowindow - google map infowindow object
  */ 
  function getWikiData(marker, infowindow){
    window.infowindow = infowindow
    
  	$.ajax({
    	url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.info + "&format=json&callback=wikiCallback",
    	dataType:"jsonp",
      error: function(){
        var error_message = '<div><strong> Oh no! somthing must have broken. Please try it again in a minute </strong></div>'
        window.infowindow.setContent(error_message);
        infowindow.open(map, marker);
      }, 
      success: function(response){ 
        var description = (response[2].length == 1 ? response[2] : response[2][0])
        var wikiUrl = (response[3].length == 1 ? response[3] : response[3][0])
        var content = '<div><strong>' + marker.name + '</strong></div><br>' + '<div><p>' + description + '</p></div>' + '<br><div> Want to know more about this place?<a href="' + wikiUrl +'"> <strong>Continute to wikipedia page</a>'
        window.infowindow.setContent(content);
        infowindow.open(map, marker);
      },
      timeout: 2000
    })
  };
  
  /*
  @description Populates the infowindow on the connected marker
  @params {object} marker - the selected marker, google map marker object
  @params {object} infowindow - google map infowindow object
  */
  function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.

      if (infowindow.marker != marker) {

          if (infowindow.marker){

            infowindow.marker.setIcon(defaultIcon);

          }
          infowindow.marker = marker;
          marker.setIcon(activeIcon);
          infowindow.close()
        	infowindow.setContent(getWikiData(marker, infowindow));
        	// Make sure the marker property is cleared if the infowindow is closed.
        	infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
            marker.setIcon(defaultIcon);
        	});
    	}
  }

  /**
  *@description Makes all markers visible on the map
  */
  function showAllMarkers() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
          markers[i].setVisible(true);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

  /**
  *@description Makes a marker with a spcified color
  *@params {string} - hex color code
  */
  function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }


    
}
