    //Not the real url ist a place holder
    const weather = "https://api.openweathermap.org/data/2.5/weather?zip=85140,us&units=imperial&appid=15976d84b292c4206f0104225b002459"
    const zip = $("<button>");

    $('.buttons').click(function(zip){

    });

   $.ajax({
       url: weather,
       method: "GET"
   }).then(function(response){
    console.log(response);
    
   const temp = response.main.temp;
   console.log(temp);

   const rain = response.weather[0].main;
   console.log(rain)





   });