const cityName = 'Scottsdale, AZ';

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
    

    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/search?entity_id=' + cityID + '&entity_type=city',
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
        console.log(restName);
        const restAddress = randRest.restaurant.location.address;
        console.log(restAddress);
        const restHours = randRest.restaurant.timings;
        console.log(restHours);
        const restAVGfor2 = randRest.restaurant.average_cost_for_two;
        console.log(restAVGfor2);
        const restMenuLink = randRest.restaurant.menu_url;
        console.log(restMenuLink);
    })

})