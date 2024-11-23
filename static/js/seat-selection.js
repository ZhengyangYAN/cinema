jQuery(function() {
    console.log(window.location.search);
    var search = window.location.search;
    const id = search.split("=")[1];

    localStorage.removeItem(id);
    let bookingInfo = JSON.parse(localStorage.getItem(id)) || [];
    updateAppearence();

    function updateAppearence(){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            
            if (bookingInfo.includes(seatIndex)) 
                $(this).addClass('booked');
        });
    }
    
    function calculatePrice(){
        //var size = document.querySelector('input[name="size"]:checked');
        //var drink = document.getElementById('drinkSelection').value;
        var price = 0;
        $('.seat').each(function() {
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected')) price += 50;
            }
        });
        $('#price').text(price);
    }

    $(".seat").on("click", function(){
        if($(this).hasClass('seat') && !$(this).hasClass('booked')){
            if($(this).hasClass('selected')) $(this).removeClass('selected');
            else $(this).addClass('selected');
        }
        calculatePrice();
    });

    $("#Confirm").on("click", function(){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            
            if ($(this).hasClass('selected')) {
                $(this).addClass('booked');
                $(this).removeClass('selected');
                //alert($(this).index());
                bookingInfo.push($(this).index());
                localStorage.setItem(id, JSON.stringify(bookingInfo));
            }
        });
        updateAppearence();
    });

    updateAppearence();
    
})
jQuery(function() {
    function grade2star(grade){
        var star = ""
        while(grade >= 1){
            star += "★"
            grade -= 1
        }
        if(grade >= 0.5) star += "✬"
        while(star.length < 5){
            star += "✩"
        }
        console.log(star)
        return star
    }

    console.log(window.location.search);
    var search = window.location.search;
    const id = search.split("=")[1];
    //alert(id)
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/movie/all-movies"
    }).done(function(res){
        console.log(res)
        for(let i in res){
            if (res[i]._id == id){
                $("#content").append(`
                    <div class = "row">
                    <div class = "text-white text-center">
                        <h1 id = "title">${res[i].title}</h1>
                        <p><small>release: ${res[i].release}, Duration: ${res[i].duration} mins</small></p>
                    </div>
                    <div class = "">
                        <img src = "${res[i].poster}" class = "poster" alt = "poster">
                    </div>
                </div>
            `)
            }
        }
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
})
    