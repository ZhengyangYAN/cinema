jQuery(function() {
    var selectedArray = []
    var selectedHall = 'hall1'
    function updateAppearence(unavailable){
        $('.seat').each(function() {
            var seatIndex = $(this).index();
            if(unavailable.includes(seatIndex)){
                $(this).addClass("booked")
                $(this).removeClass("selected")
                
            }
            else{
                $(this).removeClass("booked")
                $(this).removeClass("selected")
            }
            //if (bookingInfo.includes(seatIndex)) 
            //    $(this).addClass('booked');
        });
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

    $(".seat").on("click",function(){
        
        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selectedArray.splice(selectedArray.indexOf($(this).index()),1)
        }
        else {
            $(this).addClass('selected');
            selectedArray.push($(this).index())
        }

    })
    for(let i = 1;i<=3;i ++){
        $("#hall"+i).on("click",function(){
            $.ajax({
                data:{
                    name:"hall"+i
                },
                method:"POST",
                dataType:"json",
                url:"/backend/seat-availability"
            }).done(function(res){
                updateAppearence(res);
                selectedArray = []
                selectedHall = 'hall' + i
            }).fail(function(err){
                alert("Error, Plase try again.")
            })
            
        })
    }
    $("#hall1").trigger("click")

    $("#unable").on("click",function(){
        //console.log(selectedArray)
        $.ajax({
            data:{
                selectedArray:JSON.stringify(selectedArray),
                name:selectedHall
            },
            url:"/backend/seat-unable",
            dataType:"json",
            method:"POST"
        }).done(function(res){
            updateAppearence(res);
            selectedArray = []
        }).fail(function(){
            alert("Error, Plase try again.")
        })
    })
    
    $("#enable").on("click",function(){
        //console.log(selectedArray)
        $.ajax({
            data:{
                selectedArray:JSON.stringify(selectedArray),
                name:selectedHall
            },
            url:"/backend/seat-enable",
            dataType:"json",
            method:"POST"
        }).done(function(res){
            updateAppearence(res);
            selectedArray = []
        }).fail(function(){
            alert("Error, Plase try again.")
        })
    })
    
})