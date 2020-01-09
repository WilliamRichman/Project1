const cityName = $('#searchBar').val();
// const cityName = 'flagstaff, az';

//The onclick function that starts the page's seach from the search box.
$('#generate').on('click', function(){
    $( "#resultsDisplay" ).empty();
    $( "#menuLink" ).empty();
    $( "#resultsWeather" ).empty();
    $( "#tempMessage" ).empty();
    $( "#weatherMessage" ).empty();
    const cityName = $('#searchBar').val();
    // const cityName = 'mesa, az'
    console.log(cityName);

// The initial AJAX call that identifies the user's searched city, grabs the latitude, longitude, and cityID.    
    $.ajax({
        url:'https://developers.zomato.com/api/v2.1/locations?query=' + cityName,
        method: "GET",
        headers: {
            'user-key': 'b5075be7d6cf56502c175fb9e26c2396'
        }
    }).then(function(response){
        console.log(response);
    
        const cityID = response.location_suggestions[0].city_id;
        const lat = response.location_suggestions[0].latitude;
        const lon = response.location_suggestions[0].longitude;
        
    //This AJAX call searches through Zomato given the cityID from the previous call and will return one random restaurant.
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/search?entity_id=' + cityID + '&entity_type=city&count50',
            method: 'GET',
            headers: {
                'user-key': 'b5075be7d6cf56502c175fb9e26c2396'
            }
        }).then(function(res){
            console.log(res);

        // Setting variables to use for the filtered price range search
            const userPriceRange = 2;
            let filteredRestaurants = [];
        // For loop that actually filters out any result not less than or equal to the userPriceRange
            for (let i = 0; i < res.restaurants.length; i++) {                
                const filterPrice = res.restaurants[i].restaurant.price_range;
                console.log(filterPrice);
                if (userPriceRange <= filterPrice){
                    filteredRestaurants.push(res.restaurants[i]);
                }                
            }
        // If loop that tells the user there wasn't a result within that monitary range
            if (filteredRestaurants === 0) {
                alert("No restaurants found within that monitary range. Sorry!")
            }
        
            console.log(filteredRestaurants);
            
        // Declared variables to use for appending results to results div
            const arrayLength = res.results_shown;
            const randRest = filteredRestaurants[Math.floor(Math.random()*(arrayLength))];
            // const randRest = res.restaurants[Math.floor(Math.random()*(arrayLength))];
            console.log(randRest);
            const restName = randRest.restaurant.name;
            const restAddress = randRest.restaurant.location.address;
            const restZip = restAddress.slice(-5);
            const restHours = randRest.restaurant.timings;
            const restPrice = randRest.restaurant.price_range;
            const restAVGfor2 = randRest.restaurant.average_cost_for_two;
            const restMenuLink = randRest.restaurant.menu_url;
            $("#resultsDisplay").append('Restaurant Name: ' + restName + '<br>');
            $("#resultsDisplay").append('Restaurant Address: ' + restAddress + '<br>');      
            $("#resultsDisplay").append('Hours Open: ' + restHours + '<br>');
            $("#resultsDisplay").append('Average Price for two: $' + restAVGfor2 + '<br>');
            $("#menuLink").append('<a target="_blank" href="' + restMenuLink + '">Menu Link</a>');
        

            console.log(restName);
            console.log(restAddress);
            console.log(restZip);
            console.log(restHours);
            console.log(restPrice);
            console.log(restAVGfor2);
            console.log(restMenuLink);
           

        //AJAX call to OpenWeather API using restZip
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + restZip + ',us&units=imperial&appid=15976d84b292c4206f0104225b002459',
                method: "GET"
            }).then(function(response){
                console.log(response);
                const currentTemp = response.main.temp;
                currentTemp.toFixed(0);
                console.log(currentTemp.toFixed(0));
         
                const currentWeather = response.weather[0].main
                $("#resultsWeather").append('The current temperature is ' + currentTemp.toFixed(0) + ' and expect a ' + currentWeather + ' day');
                console.log(currentWeather);

                if (currentTemp < 30){
                    console.log("Holy Guacamole! It's VERY cold! Bundle up!");
                    $("#tempMessage").append("Holy Guacamole! It's VERY cold! Bundle up!");
                }
                if (currentTemp > 30.01 && currentTemp < 55){
                    console.log("Brr! It's a bit chilly! Dress warmly.");
                    $("#tempMessage").append("Brr! It's a bit chilly! Dress warmly.");
                }
                if (currentTemp > 55.01 && currentTemp < 80){
                    console.log("Not too hot or too cold!");
                    $("#tempMessage").append("Not too hot or too cold!");
                }
                if (currentTemp >80.01 && currentTemp < 100){
                    console.log("Oof, it's getting warm. Wear something light!");
                    $("#tempMessage").append("Oof, it's getting warm. Wear something light!");
                }

                if (currentTemp >100.01 && currentTemp < 130){
                    console.log("HOT, HOT, HOT!");
                    $("#tempMessage").append("HOT, HOT, HOT!")
                }

                // seperated weather from temp for two messages that'll be more accurate based on conditions

                if (currentWeather === "Rain"){
                    console.log("And don't forget your umbrella");
                    $("#weatherMessage").append("And don't forget an umbrella");
                    $("#resultsWeather").append('  <img id="rain" src="assets/img/rain2.png" />')
                    $('#rain').width(50); // Units are assumed to be pixels
                    $('#rain').height(50);
                } 

                if (currentWeather === "Clouds"){
                    console.log("If it looks like it could rain then maybe grab an umbrella");
                    $("#weatherMessage").append("If it looks like it could rain then maybe grab an umbrella");
                    $("#resultsWeather").append('  <img id="clouds" src="assets/img/clouds.png" />')
                    $('#clouds').width(50); // Units are assumed to be pixels
                    $('#clouds').height(50);
                }

                if (currentWeather === "Clear"){
                    console.log("Looks like it'll be a beautiful day");
                    $("#weatherMessage").append("Looks like it'll be a beautiful day");
                    $("#resultsWeather").append('<img id="sunny" src="assets/img/sunny.png" />')
                    $('#sunny').width(50); // Units are assumed to be pixels
                    $('#sunny').height(50);
                }

                if (currentWeather === "Snow"){
                    console.log("Be careful as you travel!");
                    $("#weatherMessage").append("Be careful as you travel!");
                    $("#resultsWeather").append('<img id="snow" src="assets/img/snow.png" />')
                    $('#snow').width(50); // Units are assumed to be pixels
                    $('#snow').height(50);
                }
            });

        });
    
    });
  
});