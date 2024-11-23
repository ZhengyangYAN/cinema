jQuery(function() {
    var img = null
    var slots = new Array()
    var slotsNum = 0
    var formData = new FormData();

    $("#profileImage").on("click",function(){$("#imageUpload").trigger("click")})
    $("#imageUpload").on("change",function(){
        var filePath = new FileReader()
        img = this.files[0]
        filePath.readAsDataURL(img)
        filePath.onload = function(){
            $("#profileImage").attr("src",this.result)
        }
        formData.append('poster', img);
    })
    $("#add").on("click",function(){
        $("#slot-container").append(`
            <div class = "my-2 p-2" id = "slot${slotsNum + 1}">
                <label class = "text-white">Slot ${slotsNum + 1}</label> <br>
                <label for="venue${slotsNum + 1}" class = "text-white">Venue:</label>
                <select id = "venue${slotsNum + 1}" class = "form-control" name = "venue${slotsNum + 1}">
                    <option>Exhibition Hall 1</option>
                    <option>Exhibition Hall 2</option>
                    <option>Exhibition Hall 3</option>
                </select>
                <label for = "start${slotsNum + 1}" class = "text-white">Start:</label> <br>
                <input type = "datetime-local" id = "start${slotsNum + 1}" name = "start${slotsNum + 1}" /> <br>
                <button type = "button" id = "delete${slotsNum + 1}" class = "btn btn-danger mt-2">Delete</button>
            </div>
        `)
        slotsNum += 1
        $("#delete"+slotsNum).on("click", function(){
            $("#slot"+slotsNum).remove()
            slotsNum -= 1;
        })
        
    })
    $("#Create").on("click",function(){
        for(let i = 1; i<=slotsNum; i++){
            slots.push({
                "venue":$("#venue"+i).val(),
                "start":$("#start"+i).val(),
                "end": $("#end"+i).val()
            })
        }
        
        formData.append("slots",JSON.stringify(slots))
        formData.append("description",$("#description").val())
        formData.append("grade",$("#grade").val())
        formData.append("title",$("#movieTitle").val())
        formData.append("duration",$("#duration").val())
        formData.append("release",$("#release").val())
        formData.append("price",$("#price").val())
        formData.append("genres",$("#genres").val())
        $.ajax({
            url:"/backend/create",
            method: "POST",
            dataType:"json",
            contentType: false,
            processData: false,
            // data:{
            //     "slots" : JSON.stringify(slots),
            //     "description":$("#description").val(),
            //     "title": $("#movieTitle").val(),
            //     "grade": $("#grade").val(),
            //     "duration": $("#duration").val(),
            //     "release": $("#release").val(),
            //     "file":formData

            // }
            data:formData

        }).done(function(res){
            slots = []
            formData = new FormData()
            formData.append('poster', img);
            alert("Success Creation")
        })
        .fail(function(err){
            slots = []
            formData = new FormData()
            formData.append('poster', img);
            console.log(err)
        })
    })
    
});