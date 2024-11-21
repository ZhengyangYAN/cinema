jQuery(function() {
    //localStorage.removeItem("bookedTable");
    let bookingInfo = JSON.parse(localStorage.getItem("bookedTable")) || [];
    updateAppearence();

    function updateAppearence(){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            
            if (bookingInfo.includes(seatIndex)) 
                $(this).addClass('booked');
        });
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
                localStorage.setItem("bookedTable", JSON.stringify(bookingInfo));
            }
        });
        updateAppearence();
    });

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

    updateAppearence();
});