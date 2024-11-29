//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
jQuery(function() {
    console.log(window.location.search);
    var search = window.location.search;
    const id = search.split("=")[1];
    var selectedArray = []
    var selectedHall = ''
    localStorage.removeItem(id);
    let bookingInfo = JSON.parse(localStorage.getItem(id)) || [];
    //updateAppearence();

    function updateAppearence(res){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            
            if (res.includes(seatIndex)){
                $(this).addClass('booked');
                $(this).removeClass('selected');
            }
            else{
                $(this).removeClass('booked');
                $(this).removeClass('selected');
            }
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
        const endHour = (parseInt((startMinute + mins) / 60 + startHour + hours) % 24).toString().padStart(2,'0');
        const endMin = ((startMinute + mins) % 60).toString().padStart(2,'0');
        const endTime = endHour + ":" + endMin;
        return endTime;
    }
    function initial(name){
        var hall = "hall" + name.split('_')[1].split(" ")[2]
        var unable = []
        $.ajax({
            url:"/backend/seat-availability",
            data:{name:hall},
            dataType:"json",
            method:"POST"
        }).done(function(res){
            unable = res;
            selectedArray = []
            selectedHall = hall
        }).fail(function(err){
            alert("Error, Plase try again.")
        })
        $.ajax({
            url:"/movie/seat-availability",
            data:{name: name},
            dataType:"json",
            method:"POST"
        }).done(function(res){
            unable = unable.concat(res);
            selectedArray = []
            selectedHall = hall
            updateAppearence(unable)
        }).fail(function(err){
            alert("Error, Plase try again.")
        })

        //console.log(hall)
        //console.log(name)
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
            if(j==0) initial(timeslot+ "_" +venue)
           
            $("#select-timeslot").append(`
                <input type="radio" class="btn-check" name="slot" id="${timeslot}_${venue}" ${j == 0? "checked": ""} autocomplete="off">
                <label class="btn btn-outline-light" for="${timeslot}_${venue}">${timeslot}  (${venue})</label>
            `)
        }
        
        $(`#select-timeslot`).on("click",'input',function(){
            var name = $(this).attr('id')
            var hall = "hall" + name.split('_')[1].split(" ")[2]
            var unable = []
            $.ajax({
                url:"/backend/seat-availability",
                data:{name:hall},
                dataType:"json",
                method:"POST"
            }).done(function(res){
                unable = res;
                selectedArray = []
                selectedHall = hall
            }).fail(function(err){
                alert("Error, Plase try again.")
            })
            $.ajax({
                url:"/movie/seat-availability",
                data:{name: name},
                dataType:"json",
                method:"POST"
            }).done(function(res){
                unable = unable.concat(res);
                selectedArray = []
                selectedHall = hall
                updateAppearence(unable)
                $('#price').text(0);

            }).fail(function(err){
                alert("Error, Plase try again.")
            })

            //console.log(hall)
            //console.log(name)
        })

        $(".seat").on("click", function(){
            if($(this).hasClass('seat') && !$(this).hasClass('booked')){
                if($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    selectedArray.splice(selectedArray.indexOf($(this).index()),1)
                }
                else {
                    $(this).addClass('selected');
                    selectedArray.push($(this).index())
                }
            }
            calculatePrice(res.price);
        });
        $("#Confirm").on("click", function(){
            const confirmSeat =  confirm('Confirm with the time and seats?');
            if (confirmSeat) {
                let ticketNo = getTicketNo();
                if(ticketNo == 0){
                    alert("You should select at least one ticket.")
                    return
                }
                $.ajax({
                    url:"/auth/me",
                    method:"GET",
                    dataType:"json"
                }).done(function(){
                    let price = calculatePrice(res.price);
                    timeslot = document.querySelector('input[name="slot"]:checked').id;
                    selectedArray = JSON.stringify(selectedArray);
                    window.location.href = `payment.html?id=${id}&timeslot=${timeslot}&ticketNo=${ticketNo}&price=${price}&seats=${selectedArray}`//, "_blank");
                })
                .fail(function(err){
                    if(err.responseJSON.status == "fail"){
                        alert("You should login first.")
                        window.location.href = "/login.html"
                    }
                    else{
                        alert("Error, please try again.")
                    }
                })
            }
        })
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
    
    //updateAppearence();
    
})
