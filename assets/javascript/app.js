

$(document).ready(function() {
  // //initialize firebase
var config = {
  apiKey: "AIzaSyBu8rTbNifHBZ0s0KA_5o7HDfIJTQ1pE7o",
  authDomain: "soundcheck-3312a.firebaseapp.com",
  databaseURL: "https://soundcheck-3312a.firebaseio.com",
  projectId: "soundcheck-3312a",
  storageBucket: "soundcheck-3312a.appspot.com",
  messagingSenderId: "402339358373"
};

firebase.initializeApp(config);

//set global variables
var database = firebase.database();
var relatedArtists = [];


var getuid = function() {

  var nav = window.navigator;
  var screen = window.screen;
  var uid = nav.mimeTypes.length;
  uid += nav.userAgent.replace(/\D+/g, '');
  uid += nav.plugins.length;
  uid += screen.height || '';
  uid += screen.width || '';
  uid += screen.pixelDepth || '';

  return uid;
  
};
var usersid = getuid();
var userRef = database.ref('users/' + usersid);
var favartref = database.ref('users/' + usersid + '/favartists');


console.log("favcart ref" + favartref);
var favartistarray = [];

favartref.on("child_added", function(childSnapshot) {
  console.log("callin child");
  snap = childSnapshot.val();
  favartistarray.push(snap);
  console.log(snap);
  var favDiv = $("<div class = 'favart'>");
  var favnameDiv = $("<p>").text(snap);
  favnameDiv.attr("data-name", snap);
  favnameDiv.addClass("favartists");
  favDiv.append(favnameDiv);
  $("#b2").append(favDiv);
});


//call last.fm API
$("#submit").on("click", function(event) {
  $("#a").empty();
  event.preventDefault();
  var artist = $("#input-form").val().trim();
  function displayrelart() {

  var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + artist + "&limit=10&api_key=424ba3add1c40d8f176064e658978ecb&format=json";

  var headline = $("<h3 class = 'related-head'>").text("Similar Artists");
  $("#a").append(headline);

  $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    var data = response.similarartists.artist
    console.log(response)
    for (i =0; i < data.length; i++) {
      console.log(data[i].name);
      console.log(data[i].url);
      console.log(data[i].image[1]);
      var artname = data[i].name;
      relatedArtists.push(data[i].name)
      var artlink = data[i].url;
      var artimag = Object.values(data[i].image[5]);
     
      var artDiv = $("<div class = 'relart'>");
      var imgDiv = $('<img>');
      imgDiv.attr('src', artimag);
      artDiv.append(imgDiv);
      var infoDiv = $("<div class = 'art-info'>");
      var nameDiv = $('<h4>').text(artname);
      var moreDiv = $("<button>").text("Learn More");
      var plusSpan = $("<span>").text("Fav")
      plusSpan.attr("data-name", data[i].name);
      plusSpan.addClass("fas fa-plus");
      plusSpan.addClass("favartist");
      moreDiv.attr("data-name", data[i].name);
      moreDiv.addClass("artists");
      infoDiv.append(nameDiv);
      infoDiv.append(moreDiv);
      infoDiv.append(plusSpan);

      var artBox = $("<div class = 'art-box'>");
      artBox.append(artDiv);
      artBox.append(infoDiv);

   

     // var link = $("<a>").text("Link").attr("href", artlink);
     // artDiv.append(link);
     $("#a").append(artBox);
    };

    // Scroll/function used to scroll through related artist in left column
    var controller = new ScrollMagic.Controller({
      container: "#a"
      });
      
      $('.art-box').each(function () {
      var tween = TweenMax.from($(this), 0.3, {
        autoAlpha: 0,
        scale: 0.5,
        y: '+=30'
      });
      
      var scene = new ScrollMagic.Scene({
          triggerElement: this,
          duration: '90%',
          triggerHook: 0.8
        })
        .setTween(tween)
        .addTo(controller);
      });
    
  });


  };
  displayrelart();
  $("#form")[0].reset();
  });

$(document).on("click", ".favartist", function(event) {
  event.preventDefault();
  console.log( "herererer" + favartistarray);
  var artist3 = $(this).attr("data-name");
  var old_favartists = favartistarray;
  old_favartists.push(artist3);
  function writeUserData() {
    userRef.set({
      favartists: old_favartists
    });
  };
  writeUserData();
});

$(document).on("click", ".artists", function(event) {
  event.preventDefault();
  var artist2 = $(this).attr("data-name");
  var queryURL = "https://rest.bandsintown.com/artists/" + artist2 + "?app_id=codingbootcamp";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var artistName = $("<h2>").text(response.name);
    var artistURL = $("<a>").attr("href", 'https://www.last.fm/music/' + response.name).append(artistName).attr("target", "_blank");    var artistImage = $("<img>").attr("src", response.thumb_url);
    var trackerCount = $("<h4>").text(response.tracker_count + " fans tracking this artist");
    var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " upcoming events");
    var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates").attr("target", "_blank");

    $("#b1").empty();
   // $("#").empty();
    $("#b1").append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
   
  });
});
});



