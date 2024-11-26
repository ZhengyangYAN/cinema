var loginInfo = null
jQuery(function(){
    $.ajax({
        url:"/auth/me",
        method:"GET",
        dataType:"json"
    }).done(function(result){
        $("#login-a").attr("href","/personal-center.html").empty().append(result.user.nickname)
        if(result.user.role == "admin"){
            $("#management-nagivation").removeClass("d-none")
        }
        loginInfo = null
    }).fail()
})