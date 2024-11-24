jQuery(function() {
    //alert(id)
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/payment"
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
            }
        }
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
})