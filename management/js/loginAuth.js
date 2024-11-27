jQuery(function(){
    $.ajax({
        url:"/auth/me",
        method:"GET",
        dataType:"json"
    }).done(function(result){
        $("#login-a").attr("href","/personal-center.html").empty().append(result.user.nickname)
        if(result.user.role != "admin"){
            alert("You don't have the access!")
            window.location.href = "/dashboard.html"
        }
    }).fail(function(){
        alert("You should login first.")
        window.location.href = "/login.html"
    })
})