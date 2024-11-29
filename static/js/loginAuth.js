//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
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
    }).fail()
})