jQuery(function() {
    $("#login").on("click",function(){
        var password = $("#username").val().trim()
        var username = $("#password").val().trim()
        encryptedPassword = sha256(password)
        if(!password || !username){
            alert("Username and Password cannot be blank.")
            return
        }
        $.ajax({
            url: "/auth/login",
            method: "POST",
            dataType:"JSON",
            data:{
                username,
                encryptedPassword
            }
        }).done(function(res){
            console.log(res)
        }).fail(function(err){
            alert(err.responseJSON.message)
        })
    })
})