// const cityName = $('#searchBar').val();
const cityName = 'flagstaff, az'

//The onclick function that starts the page's seach from the search box.
$('#generate').on('click', function(){

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
            const restAVGfor2 = randRest.restaurant.average_cost_for_two;
            const restMenuLink = randRest.restaurant.menu_url;
            
        })
    
    })

});

//How the $$$$$ system will add into the page's search.
// ------------------------------------------------------------------
// $('.stars').doStuff({
//     rating: $('.stars').data('rating')
// })
// ------------------------------------------------------------------
// let div = document.getElementByClassName('stars');
// // let spans = div.getElementsByTagName('span');
// let spans = div.getElementsByClass('star');
// console.log(spans);
// ------------------------------------------------------------------
// for (let i = 0; i < spans.length; i++) {
//     // const element = array[i];
//     console.log(spans[i].innerHTML);
// }
// ------------------------------------------------------------------
// $('.star').on('click', function(){
//     // let dollarRating = $('.stars');
//     let dollarRating = $('.star rated');
//     console.log(dollarRating);
//     // console.log(dollarRating[0].childElementCount);
//     let dollar = $('.stars').data('rating');
//         console.log(dollar);
//     // $('.stars').each(function(){
//     //     let dollar = $('.stars').data('rating')
//     //     console.log(dollar);
//     // })
// ------------------------------------------------------------------
// This is the closest I've come to getting the value of how many dollar signs have been chosen. It's SOOOO close, but for some reason, it's not accurate 100% of the time. Any suggestions would be great.
$('.star').mouseup(function(){
    let dollarRating = $('.star.rated').length;
    // let dollarRating = $('.star.rating')
    console.log(dollarRating);
});


// });



//Front-end css stuff
document.addEventListener('DOMContentLoaded', function(){
    let stars = document.querySelectorAll('.star');
    stars.forEach(function(star){
        star.addEventListener('click', setRating); 
    });
    
    let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
    let target = stars[rating - 1];
    target.dispatchEvent(new MouseEvent('click'));
});
function setRating(ev){
    let span = ev.currentTarget;
    let stars = document.querySelectorAll('.star');
    let match = false;
    let num = 0;
    stars.forEach(function(star, index){
        if(match){
            star.classList.remove('rated');
        }else{
            star.classList.add('rated');
        }
        //are we currently looking at the span that was clicked
        if(star === span){
            match = true;
            num = index + 1;
        }
    });
    document.querySelector('.stars').setAttribute('data-rating', num);
}
