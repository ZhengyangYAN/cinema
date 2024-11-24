jQuery(function() {
    $("#login").on("click",function(){
        var password = $("#password").val().trim()
        var username = $("#username").val().trim()
        encryptedPassword = sha256(password)
        if(!password || !username){
            alert("Username and Password cannot be blank.")
            return
        }
        $.ajax({
            url: "/auth/login",
            method: "POST",
            dataType:"json",
            data:{
                username,
                encryptedPassword
            }
        }).done(function(res){
            saveUserId()
            alert("Welcome " + username + "!")
            history.back()
        }).fail(function(err){
            alert(err.responseJSON.message)
        })
    })
    $("#Register").on("click", function(){
        window.location.href = './register.html';
    })
    $("#username").val(localStorage.getItem('username'))
})
function saveUserId() {
    var userId = $("#username").val()
    var rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        localStorage.setItem('username', userId);
        
    } else {
        localStorage.removeItem('userId');
    }
}