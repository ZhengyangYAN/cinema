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
    
    function calculatePrice(ticketPrice){
        //var size = document.querySelector('input[name="size"]:checked');
        //var drink = document.getElementById('drinkSelection').value;
        var price = 0;
        $('.seat').each(function() {
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected') && !$(this).hasClass('first-class')) price += ticketPrice;
                else if ($(this).hasClass('selected') && $(this).hasClass('first-class')) price += 1.2 * ticketPrice;
            }
        });
        $('#price').text(price);
    }

    function endTime(start, duration){
        const hours = duration / 60;
        const mins = duration % 60;
        const startHour = parseInt(start.slice(0,2));
        const startMinute = parseInt(start.slice(3,5));
        const endHour = parseInt((startMinute + mins) / 60 + startHour + hours);
        const endMin = (startMinute + mins) % 60;
        const endTime = endHour + ":" + endMin;
        return endTime;
    }

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
            for (let j in res[i].slots){
                alert(endTime(res[i].slots[j]["start"].slice(11), res[i].duration));

                $("#select-timeslot").append(`
                    <input type="radio" class="btn-check" name="time" id="timeslot${j}" autocomplete="off">
                    <label class="btn btn-outline-light" for="timeslot${j}">${res[i].slots[j]["start"].slice(11)}-${endTime(res[i].slots[j]["start"].slice(11), res[i].duration)}</label>
                `)
                alert(res[i].slots[j]["start"].slice(11))
            }
            $(".seat").on("click", function(){
                if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                    if($(this).hasClass('selected')) $(this).removeClass('selected');
                    else $(this).addClass('selected');
                }
                calculatePrice(res[i].price);
            });
            }
        }
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
})