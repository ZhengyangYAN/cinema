jQuery(async function() {
    var table = new DataTable('#movie-data');
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/movie/all-movies"
    }).done(function(res){
        for(let i in res){
            table.row
                .add([
                    res[i]._id,
                    res[i].title,
                    res[i].release,
                    res[i].price,
                    res[i].duration,
                    res[i].genres,
                    res[i].grade,
                ]) .draw(false);
        }
        var img = null
        var slots = new Array()
        var slotsNum = 0
        var formData = new FormData();
        var isImg = 0
        var imgUrl = null
        var id = null
        $("#profileImage").on("click",function(){$("#imageUpload").trigger("click")})
        $("#imageUpload").on("change",function(){
            var filePath = new FileReader()
            img = this.files[0]
            filePath.readAsDataURL(img)
            filePath.onload = function(){
                $("#profileImage").attr("src",this.result)
            }
            formData.append('poster', img);
            isImg = 1
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
        $('#movie-data tbody').on('click', 'tr', function() {
            $("#data-table").addClass("d-none")
            $.ajax({
                data:{id : table.row(this).data()[0]},
                method:"POST",
                dataType:"json",
                url:"/movie/movie-detail"
            }).done(function(res){
                $("#movie-form").removeClass("d-none")
                $("#price").val(res.price)
                $("#duration").val(res.duration)
                $("#grade").val(res.grade)
                $("#release").val(res.release)
                $("#description").val(res.description)
                $("#movieTitle").val(res.title)
                $("#genres").val(res.genres)
                $("#profileImage").attr("src","/"+res.poster)
                id = res._id
                imgUrl = res.poster
                isImg = 0
                slotsNum = 0
                $("#slot-container").empty()
                for(let i in res.slots){
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
                    $("#start"+slotsNum).val(res.slots[i].start)
                    $("#venue"+slotsNum).val(res.slots[i].venue)
                }

            }).fail(function(err){
                alert("Error, please try agian.")
            })
            $("#movie-form").removeClass("d-none")
            //console.log('clicked: ' + )
        }).css("cursor","pointer")
        $("#update").on("click",function(){
            for(let i = 1; i<=slotsNum; i++){
                slots.push({
                    "venue":$("#venue"+i).val(),
                    "start":$("#start"+i).val(),
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
            formData.append("isImg",isImg)
            formData.append("imgUrl",imgUrl)
            formData.append("id",id)
            $.ajax({
                url:"/backend/manage-movie",
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
                alert("Success Modification")
                formData = new FormData()
                slots = []
                $("#movie-form").addClass("d-none")
                $("#data-table").removeClass("d-none")
            })
            .fail(function(err){
                alert("error")
                formData = new FormData()
                slots = []
                $("#movie-form").addClass("d-none")
                $("#data-table").removeClass("d-none")
                console.log(err)
            })
        })
        $("#cancel").on("click",function(){
            $("#movie-form").addClass("d-none")
            $("#data-table").removeClass("d-none")
        })
    }).fail(function(err){
        alert(err.status)
    })
});