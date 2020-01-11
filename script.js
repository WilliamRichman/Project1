const cityName = $('#searchBar').val();
let dollarId;
let restName = "";
let restAddress = "";
let restZip = "";
let restHours = "";
let restPrice = "";
let restAVGfor2 = "";
let restMenuLink = "";
let cuisineType = "";


// Waiting for someone to click on a dollar sign
document.addEventListener('DOMContentLoaded', function () {
    let stars = document.querySelectorAll('.star');
    stars.forEach(function (star) {
        star.addEventListener('click', setRating);
    });

    let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
    let target = stars[rating - 1];
    target.dispatchEvent(new MouseEvent('click'));
});

// What tells us which dollar sign is being clicked
$('.star').on('click', function () {
    const dollars = $(this).attr('id')
    dollarId = dollars
});

// This is what changes the diamond to the dollar sign
function setRating(ev) {
    let span = ev.currentTarget;
    let stars = document.querySelectorAll('.star');
    let match = false;
    let num = '';
    stars.forEach(function (star, index) {
        if (match) {
            star.classList.remove('rated');
        } else {
            star.classList.add('rated');
        }

        if (star === span) {
            match = true;
            num = index + 1;
        }

    });
    document.querySelector('.stars').setAttribute('data-rating', num);

};

//The onclick function that starts the page's seach from the search box.
$('#generate').on('click', function () {
    $("#resultsDisplay").empty();
    $("#menuLink").empty();
    $("#resultsWeather").empty();
    $("#tempMessage").empty();
    $("#weatherMessage").empty();
    const cityName = $('#searchBar').val();
    console.log(cityName);

    // The initial AJAX call that identifies the user's searched city, grabs the latitude, longitude, and cityID.    
    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/locations?query=' + cityName,
        method: "GET",
        headers: {
            'user-key': 'b5075be7d6cf56502c175fb9e26c2396'
        }
    }).then(function (response) {
        console.log(response);
        let start = 0;
        const cityID = response.location_suggestions[0].city_id;
        lat = response.location_suggestions[0].latitude;
        lon = response.location_suggestions[0].longitude;

    //Starts the doStuff function
        doStuff(start, cityID);
        

    });

});


//AJAX call to OpenWeather API using restZip

function weatherCall(){
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + restZip + ',us&units=imperial&appid=15976d84b292c4206f0104225b002459',
        method: "GET"
    }).then(function (response) {
        const currentTemp = response.main.temp;
        currentTemp.toFixed(0);

        const currentWeather = response.weather[0].main
        $("#resultsWeather").append('The current temperature is ' + currentTemp.toFixed(0) + ' and expect a ' + currentWeather + ' day');

        if (currentTemp < 30) {
        $("#tempMessage").append("Holy Guacamole! It's VERY cold! Bundle up!");
        }
        if (currentTemp > 30.01 && currentTemp < 55) {
        $("#tempMessage").append("Brr! It's a bit chilly! Dress warmly.");
        }
        if (currentTemp > 55.01 && currentTemp < 80) {
        $("#tempMessage").append("Not too hot or too cold!");
        }
        if (currentTemp > 80.01 && currentTemp < 100) {
        $("#tempMessage").append("Oof, it's getting warm. Wear something light!");
        }

        if (currentTemp > 100.01 && currentTemp < 130) {
        $("#tempMessage").append("HOT, HOT, HOT!")
        }

        // seperated weather from temp for two messages that'll be more accurate based on conditions

        if (currentWeather === "Rain") {
        $("#weatherMessage").append("And don't forget an umbrella");
        $("#resultsWeather").append('  <img id="rain" src="assets/img/rain2.png" />')
        $('#rain').width(50); // Units are assumed to be pixels
        $('#rain').height(50);
        }

        if (currentWeather === "Clouds") {
        $("#weatherMessage").append("If it looks like it could rain then maybe grab an umbrella");
        $("#resultsWeather").append('  <img id="clouds" src="assets/img/clouds.png" />')
        $('#clouds').width(50); // Units are assumed to be pixels
        $('#clouds').height(50);
        }

        if (currentWeather === "Clear") {
        $("#weatherMessage").append("Looks like it'll be a beautiful day");
        $("#resultsWeather").append('<img id="sunny" src="assets/img/sunny.png" />')
        $('#sunny').width(50); // Units are assumed to be pixels
        $('#sunny').height(50);
        }

        if (currentWeather === "Snow") {
        $("#weatherMessage").append("Be careful as you travel!");
        $("#resultsWeather").append('<img id="snow" src="assets/img/snow.png" />')
        $('#snow').width(50); // Units are assumed to be pixels
        $('#snow').height(50);
        }
    })
};


function doStuff(start, cityID){
    //This AJAX call searches through Zomato given the cityID from the previous call and will return one random restaurant.
    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/search?entity_id=' + cityID + '&entity_type=city&start='+ start +'&count=40',
        method: 'GET',
        headers: {
            'user-key': 'b5075be7d6cf56502c175fb9e26c2396'
        }
    }).then(function (res) {
        console.log(res);

        const userPriceRange = dollarId;
        let filteredRestaurants = [];
        // For loop that actually filters out any result not less than or equal to the userPriceRange
        for (let i = 0; i < res.restaurants.length; i++) {
            const filterPrice = res.restaurants[i].restaurant.price_range;
            // console.log(filterPrice);
            if (parseInt(userPriceRange) === filterPrice) {
                filteredRestaurants.push(res.restaurants[i]);
            }
        }
        // If loop that tells the user there wasn't a result within that monitary range
        if (filteredRestaurants.length === 0) {
           if (start <= 80) {
               start += 20;
                doStuff(start, cityID);
            }
            else {
                alert("Sorry!");
            }
        }
        else {
            console.log(filteredRestaurants);

            // Declared variables to use for appending results to results div
            const arrayLength = res.results_shown;
            const randRest = filteredRestaurants[Math.floor(Math.random() * (filteredRestaurants.length))];
            console.log(randRest);
            restName = randRest.restaurant.name;
            restAddress = randRest.restaurant.location.address;
            restZip = restAddress.slice(-5);
            restHours = randRest.restaurant.timings;
            restPrice = randRest.restaurant.price_range;
            restAVGfor2 = randRest.restaurant.average_cost_for_two;
            restMenuLink = randRest.restaurant.menu_url;
            cuisineType = randRest.restaurant.cuisines
            $("#resultsDisplay").append('Restaurant Name: ' + restName + '<br>');
            $("resultsDisplay").append('Cuisine Type: ' + cuisineType + '<br>')
            $("#resultsDisplay").append('Restaurant Address: ' + restAddress + '<br>');
            $("#resultsDisplay").append('Hours Open: ' + restHours + '<br>');
            $("#resultsDisplay").append('Average Price for two: $' + restAVGfor2 + '<br>');
            $("#menuLink").append('<a target="_blank" href="' + restMenuLink + '">Menu Link</a>');
            weatherCall();

            console.log(restName);
            console.log(restAddress);
            console.log(restZip);
            console.log(restHours);
            console.log(restPrice);
            console.log(restAVGfor2);
            console.log(restMenuLink);
        }


});
};