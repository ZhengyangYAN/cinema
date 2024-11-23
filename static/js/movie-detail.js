function grade2star(grade){
    var star = ""
    while(grade >= 1){
        star += "★"
        grade -= 1
    }
    if(grade >= 0.5) star += "✬"
    while(star.length < 5){
        star += "✩"
    }
    console.log(star)
    return star
}
jQuery(function(){
    console.log(window.location.search)
    var search = window.location.search
    const id = search.split("=")[1]
    $.ajax({
        method: "POST",
        dataType:"json",
        data:{id:id},
        url:"/movie/movie-detail"
    }).done(function(res){

        console.log(res)
        $("#content").append(`
                    <div class = "row">
                    <div class = "col-md-6 col-12">
                        <img src = "${res.poster}" class = "poster" alt = "poster">
                    </div>
                    <div class = "col-md-6 col-12 text-white">
                        <h1 id = "title">${res.title}</h1>
                        <p><small>release: ${res.release}, Duration: ${res.duration} mins</small></p>
                        <p class = "fs-4">${res.grade} ${grade2star(res.grade)}</p>
                        
                        <p>${res.description}</p>
                        
                        <button type = "button" class = "btn btn-warning w-100 mt-auto mb-5" id = "showtime">Showtime</button>
                    </div>
                </div>
            `)
        $("#showtime").on("click",function(){
            window.open(`seat-selection.html?id=${id}`, "_blank");
        }).css("cursor","pointer")
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
})