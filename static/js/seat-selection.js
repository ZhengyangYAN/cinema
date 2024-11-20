jQuery(function() {
    //localStorage.removeItem("bookedTable");
    let bookingInfo = JSON.parse(localStorage.getItem("bookedTable")) || [];
    let selectedTable = null;
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
    });

    $("#Confirm").on("click", function(){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            
            if ($(this).hasClass('selected')) {
                $(this).addClass('booked');
                $(this).removeClass('selected');
                alert($(this).index());
                bookingInfo.push($(this).index());
                localStorage.setItem("bookedTable", JSON.stringify(bookingInfo));
            }
        });
        updateAppearence();
    });

    updateAppearence();
});