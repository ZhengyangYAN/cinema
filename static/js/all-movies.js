jQuery(function(){
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/movie/all-movies"
    }).done(function(res){

        for(let i in res){
            $("#movie-container").append(`
                <div class = "card col-6 col-md-3 col-lg-2 bg-black" id = ${res[i]._id}>
                        <img class = "card-img-top poster" src = "${res[i].poster}" alt = "1">
                        <div class = "card-body">
                            <h5 class = "card-title text-white fw-bold">${res[i].title}</h5>
                        </div>
                    </div>
                `)
            $("#"+res[i]._id).on("click",function(){
                window.open(`movie-detail.html?id=${res[i]._id}`, "_blank");
            }).css("cursor","pointer")
        }
    }).fail(function(err){
        alert(err.status)
    })



})