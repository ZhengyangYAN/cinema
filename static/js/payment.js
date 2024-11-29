jQuery(function() {
    console.log(window.location.search)
    var search = window.location.search
    console.log(search)
    const searchParams = new URLSearchParams(search);
    const id = searchParams.get('id')
    const timeslot = searchParams.get('timeslot').slice(0, 11)
    const venue = searchParams.get('timeslot').slice(12).split("%20")
    const ticketNo = searchParams.get('ticketNo')
    const price = searchParams.get('price')
    const seats = JSON.parse(searchParams.get('seats'))
    const transactionId = Date.now() + Math.floor((Math.random() * 10e13))
    var title
    var singlePrice
    function getSeatNo(index){
        if (index >= 8 && index <= 14){
            return "A"+(index%8+1)
        }
        else if (index >= 16 && index <= 22){
            return "B"+(index%16+1)
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
    function getSeatPrice(price, index){
        if((index >= 27 && index <= 29) || (index >= 35 && index <= 37)) return price * 1.2 + " (first-class)";
        else return price;
    }
    $.ajax({
        method:"POST",
        dataType:"json",
        url:"/movie/movie-detail",
        data:{
            id:id
        }
    }).done(function(res){
        title = res.title
        singlePrice = res.price
        $('#info').append(`
            <h5>Movie: ${res.title}</h5>
            <h5>Venue: ${venue}</h5>
            <h5>Timeslot: ${timeslot}</h5>
            <h5>Order Number: ${transactionId}</h5>
            <h5>Seats:</h5>
        `)
        seats.forEach(seat => {
            $('#info').append(`
            <h5><b>${getSeatNo(seat)}</b><span class="price">$${getSeatPrice(res.price, seat)}</span></h5>
        `)
        });
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
    $('#ticketNo').text(`${ticketNo}`)
    $('#price').text(`${price}`)
    $("#check-out").on("click",function(){
        var seatInfo = []
        for(let i in seats){
            var item = new Object()
            item.seatNo = getSeatNo(seats[i])
            item.price = getSeatPrice(singlePrice,seats[i])
            seatInfo.push(item)
        }
        $.ajax({
            data:{
                orderNum : transactionId.toString(),
                title: title,
                seatIndex: JSON.stringify(seats),
                venue: venue.toString(),
                timeslot: timeslot,
                name: timeslot + "_" + venue,
                fname: $("#fname").val(),
                email: $("#email").val(),
                address: $("#adr").val(),
                city: $("#city").val(),
                seatInfo: JSON.stringify(seatInfo),
                state: $("#state").val(),
                zip:$("#zip").val(),
                totalPrice: price,
                status:"paied"
            },
            url:"/payment",
            method:"POST",
            dataType:"json"
        }).done(function(response){
            alert("Success payment, you can view your transaction in personal center.")
            window.location.href = "/personal-center.html"
        })
        .fail(function(err){
            alert(err.responseJSON.message)
        })


    })
    
})