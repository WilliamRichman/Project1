    //Not the real url ist a place holder
    const weather = "http://samples.openweathermap.org/data/2.5/weather?zip=94040,us&appid=15976d84b292c4206f0104225b002459"
    const zip = $("<button>");

    $('.buttons').click(function(zip){

    });

   $.ajax({
       url: weather,
       method: "GET"
   }).then(function(response){
    console.log(response);
   });