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
function saveUserId() {
    var userId = document.getElementById('userId').value;
    var rememberMe = document.getElementById('rememberMe').checked;

    if (rememberMe) {
        localStorage.setItem('userId', userId);
        alert('User ID saved for future logins');
    } else {
        localStorage.removeItem('userId');
        alert('User ID removed from saved data');
    }

    // Perform login logic here
    // You can redirect the user to the dashboard or another page upon successful login
}

// Check if there is a saved user ID and populate the input field
document.addEventListener('DOMContentLoaded', function() {
    var savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
        document.getElementById('userId').value = savedUserId;
        document.getElementById('rememberMe').checked = true;
    }
});