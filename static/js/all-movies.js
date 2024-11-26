jQuery(function(){
    var list
    var fuse
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
        const options = {
            keys: ['title', 'genres', 'description', 'relase'],
            threshold: 0.3,
            location: 0,
            distance: 100,
            includeMatches: true,
            includeScore: true,
            useExtendedSearch: true
        };
        fuse = new Fuse(res, options);
    }).fail(function(err){
        alert(err.status)
    })
    
    
    $("#search").on("click",function(){
        $("#movie-container").empty()
        const searchResult = fuse.search($("#movie-search").val());
        if(searchResult.length == 0){
            $("#movie-container").append(`<div class = "text-white"><h2>No record, please try other key words.</h2></div>`)
        }
        else{
            for(let i in searchResult){
                $("#movie-container").append(`
                    <div class = "card col-6 col-md-3 col-lg-2 bg-black" id = ${searchResult[i].item._id}>
                            <img class = "card-img-top poster" src = "${searchResult[i].item.poster}" alt = "1">
                            <div class = "card-body">
                                <h5 class = "card-title text-white fw-bold">${searchResult[i].item.title}</h5>
                            </div>
                        </div>
                    `)
                $("#"+searchResult[i].item._id).on("click",function(){
                    window.open(`movie-detail.html?id=${searchResult[i].item._id}`, "_blank");
                }).css("cursor","pointer")
            }
        }
    })
  

})