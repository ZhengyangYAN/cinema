//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
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