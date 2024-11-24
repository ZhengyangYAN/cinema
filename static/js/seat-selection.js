jQuery(function() {
    console.log(window.location.search);
    var search = window.location.search;
    var selectedSeats = new Array()
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
        var price = 0;
        $('.seat').each(function() {
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected') && !$(this).hasClass('first-class')) price += ticketPrice;
                else if ($(this).hasClass('selected') && $(this).hasClass('first-class')) price += 1.2 * ticketPrice;
            }
        });
        $('#price').text(price);
        return price;
    }

    function getTicketNo(){
        var ticketNo = 0;
        $('.seat').each(function() {
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected')) ticketNo += 1;
            }
        });
        return ticketNo;
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

    function getSeatNo(index){
        if (index >= 8 && index <= 14){
            return "A"+(index%8+1)
        }
        else if (index >= 16 && index <= 22){
            return "A"+(index%16+1)
        }
        else if (index >= 25 && index <= 31){
            return "C"+(index%25+1)
        }
        else if (index >= 33 && index <= 39){
            return "D"+(index%33+1)
        }
        else if (index >= 41 && index <= 47){
            return "E"+(index%41+1)
        }
        else if (index >= 49 && index <= 55){
            return "F"+(index%49+1)
        }
    }

    $.ajax({
        method:"POST",
        dataType:"json",
        url:"/movie/movie-detail",
        data:{
            id:id
        }
    }).done(function(res){
        console.log(res)
            $("#content").append(`
                <div class = "row">
                <div class = "text-white text-center">
                    <h1 id = "title">${res.title}</h1>
                    <p><small>release: ${res.release}, Duration: ${res.duration} mins</small></p>
                </div>
                <div class = "">
                    <img src = "${res.poster}" class = "poster" alt = "poster">
                </div>
            </div>
        `)
        
        for (let j in res.slots){
            var timeslot = res.slots[j]["start"].slice(11) + "-" + endTime(res.slots[j]["start"].slice(11), res.duration);
            var venue = res.slots[j]["venue"];
            $("#select-timeslot").append(`
                <input type="radio" class="btn-check" name="time" id="${timeslot+j}_${venue}" autocomplete="off">
                <label class="btn btn-outline-light" for="${timeslot+j}_${venue}">${timeslot}  (${venue})</label>
            `)

        }
        $(".seat").on("click", function(){
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected')) $(this).removeClass('selected');
                else $(this).addClass('selected');
            }
            calculatePrice(res.price);
        });
        $("#Confirm").on("click", function(){
            let ticketNo = getTicketNo();
            let price = calculatePrice(res.price);
            $('.seat').each(function() {
                var seatIndex = $(this).index();
                
                if ($(this).hasClass('selected')) {
                    $(this).addClass('booked');
                    $(this).removeClass('selected');
                    //alert($(this).index());
                    bookingInfo.push($(this).index());
                    localStorage.setItem(id, JSON.stringify(bookingInfo));
                    selectedSeats.push({
                        "seatNo": getSeatNo($(this).index()),
                        "seatIndex": $(this).index()
                    })
                }
            })
            updateAppearence();
            const title = res.title;
            timeslot = document.querySelector('input[name="time"]:checked').id;
            selectedSeats = JSON.stringify(selectedSeats);
            $.ajax({
                url: "/payment",
                method: "POST",
                dataType:"JSON",
                data:{
                    "title": title,
                    "timeslot": timeslot,
                    "ticketNo": ticketNo,
                    "seats": selectedSeats
                }
            }).done(function(res){
                console.log(res)
            }).fail(function(err){
                alert(err.responseJSON.message)
            })
            window.open(`payment.html?id=${id}&timeslot=${timeslot}&ticketNo=${ticketNo}&price=${price}&seats=${selectedSeats}`, "_blank");
        })
    }).fail(function(err){
        alert(err.responseJSON.message)
    })

    updateAppearence();
})