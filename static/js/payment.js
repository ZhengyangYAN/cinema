jQuery(function() {
    console.log(window.location.search)
    var search = window.location.search
    const searchParams = new URLSearchParams(search);
    const id = searchParams.get('id')
    const timeslot = searchParams.get('timeslot').slice(0, 11)
    const venue = searchParams.get('timeslot').slice(13).split("%20")
    const ticketNo = searchParams.get('ticketNo')
    const price = searchParams.get('price')
    const seats = JSON.parse(searchParams.get('seats'))

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
        $('#info').append(`
        <h5>Movie: ${res.title}</h5>
        <h5>Venue: ${venue}</h5>
        <h5>Timeslot: ${timeslot}</h5>
        <h5>Seats:</h5>
    `)
    seats.forEach(seat => {
        $('#info').append(`
        <h5><b>${seat["seatNo"]}</b><span class="price">$${getSeatPrice(res.price, seat["seatIndex"])}</span></h5>
    `)
    });
    }).fail(function(err){
        alert(err.responseJSON.message)
    })

    $('#ticketNo').text(`${ticketNo}`)
    $('#price').text(`${price}`)
})