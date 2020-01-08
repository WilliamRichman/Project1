const cityName = $('#searchBar').val();
// const cityName = 'flagstaff, az';

//The onclick function that starts the page's seach from the search box.
$('#generate').on('click', function(){
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
    
            const arrayLength = res.results_shown;
            const randRest = res.restaurants[Math.floor(Math.random()*(arrayLength))];
            console.log(randRest);
            const restName = randRest.restaurant.name;
            const restAddress = randRest.restaurant.location.address;
            const restZip = restAddress.slice(-5);
            const restHours = randRest.restaurant.timings;
            const restPrice = randRest.restaurant.price_range;
            const restAVGfor2 = randRest.restaurant.average_cost_for_two;
            const restMenuLink = randRest.restaurant.menu_url;
            console.log(restName);
            console.log(restAddress);
            console.log(restZip);
            console.log(restHours);
            console.log(restPrice);
            console.log(restAVGfor2);
            console.log(restMenuLink);


            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + restZip + ',us&units=imperial&appid=15976d84b292c4206f0104225b002459',
                method: "GET"
            }).then(function(response){
                console.log(response);
                const currentTemp = response.main.temp;
                console.log(currentTemp);
         
                const currentWeather = response.weather[0].main;
                console.log(currentWeather);
            });

        });
    
    });
  
});