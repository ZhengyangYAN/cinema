jQuery(async function() {
    var table = new DataTable('#transaction-data');
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/payment/all-history"
    }).done(function(res){
        console.log(res)
        for(let i in res){
            const date = new Date(res[i].time)
            var hour = date.getHours()>12?date.getHours()%13 + 1:date.getHours();
            hour = hour.toString().padStart(2,'0');
            const dayPeriod = date.getHours()>12?"PM":"AM";
            const dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + 
            ", " + hour + ":" + date.getMinutes().toString().padStart(2,'0') + ":" + date.getSeconds().toString().padStart(2,'0')
            + " " + dayPeriod;
            table.row
                .add([
                    res[i].orderNum,
                    res[i].title,
                    res[i].timeslot,
                    res[i].venue,
                    res[i].totalPrice,
                    res[i].username,
                    res[i].status,
                    dateString
                ]) .draw(false);
        }
        
    }).fail(function(err){
        alert(err.status)
    })
    $('#transaction-data tbody').on('click', 'tr', function() {
        $.ajax({
            url:"/backend/get-history",
            method:"POST",
            dataType:"json",
            data:{
                orderNum:table.row(this).data()[0]
            }
        }).done(function(history){
            $("#info").empty()
            $("#data-table").addClass("d-none")
            const date = new Date(history.time)
            var hour = date.getHours()>12?date.getHours()%13 + 1:date.getHours();
            hour = hour.toString().padStart(2,'0');
            const dayPeriod = date.getHours()>12?"PM":"AM";
            const dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + 
            ", " + hour + ":" + date.getMinutes().toString().padStart(2,'0') + ":" + date.getSeconds().toString().padStart(2,'0')
            + " " + dayPeriod;
            $("#info").append(`
            <div class="payment_container">
                <h3>Order Time: ${dateString}</h3>
                <div id = "transaction">
                <h5>Movie: ${history.title}</h5>
                <h5>Venue: ${history.venue}</h5>
                <h5>Timeslot: ${history.timeslot}</h5>
                
                <h5>Seats:</h5>
                </div>
                <hr>
                <h5>Total: <span class="price"><b>$${history.totalPrice}</b></span></h5>
                <hr>
                <h5>Useranme: ${history.username}</h5>
                <h5>Full Name: ${history.orderNum}</h5>
                <h5>Email: ${history.email}</h5>
                <h5>City: ${history.city}</h5>
                <h5>State: ${history.state}</h5>
                <h5>Address: ${history.address}</h5>
                <h5>Zip: ${history.zip}</h5>
                <h5>Status: ${history.status}</h5>
            </div>`)
            for(let j in history.seatInfo){
            $("#transaction").append(`
                <h5><b>${history.seatInfo[j].seatNo} --- </b><span class="price">$${history.seatInfo[j].price}</span></h5>`)
            }

            $(".payment_container").append(`<button class = "btn btn-warning w-25" id = "refund" >Refund</button>`)
            $(".payment_container").append(`<button class = "btn btn-secondary mx-2 w-25" id = "back" >Back</button>`)


            $("#back").on("click",function(){
                $("#info").empty()
                $("#data-table").removeClass("d-none")
            })
            $("#refund").on("click",function(){
                $.ajax({
                    url:"/backend/refund",
                    data:{
                        orderNum:history.orderNum,
                        name:history.name,
                        seatIndex: JSON.stringify(history.seatIndex)
                    },
                    dataType:"json",
                    method:"POST"
                }).done(function(){
                    alert("Refund Success.")
                    window.location.href = "/m/transaction-management.html"
                }).fail(function(){
                    alert("Error, try again later.")
                })
            })

        }).fail(function(){
            alert("Error, try again later.")
        })
    })

});