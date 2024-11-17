document.addEventListener('DOMContentLoaded',async function () {
    document.getElementById('Register').addEventListener('click', function (event) {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const repeatPassword = document.getElementById('repeatPassword').value;
      const nickname = document.getElementById('nickname').value;
      const email = document.getElementById('email').value;
      const gender = document.getElementById('gender').value;
      const birthday = document.getElementById('birthday').value;
      //const fileInput = document.getElementById('imageInput');
      //const file = fileInput.files[0];
  
      if (!username || !password) {
        alert('Username and password cannot be empty');
        return;
      } 
      else if (password != repeatPassword) {
        alert('Password mismatch!');
        return;
      }
      
      const formData = new Object();
      //formData.append('profileImage', file);
      const encryptedPassword = sha256(password)
      formData.username = username
      formData.encryptedPassword = encryptedPassword
      formData.email = email
      formData.gender = gender
      formData.birthday = birthday
      formData.role = "user"

      $.ajax({
        data:formData,
        url:"/auth/register",
        method:"POST",
        dataTypeL:"json"
      }).done(function(res){
        if (data.status === 'success') {
          alert(`Welcome, ${data.user.username}!\nYou can login with your account now!`);
          window.location.href = '/login.html';
        } else if (data.status === 'failed') {
          alert(data.message);
        } else {
          alert('error');
        }
    }).fail(function(err){
        alert(err.responseJSON.message)
    })
  });
    document.getElementById('profile-container').addEventListener('click', function() {
      document.getElementById('imageUpload').click();
  });
    document.getElementById('imageUpload').addEventListener('change', function() {
      var file = this.files[0];
      var reader = new FileReader();
  
      reader.onload = function(e) {
          var image = document.createElement('img');
          image.src = e.target.result;
          image.style.maxWidth = '200px';
          document.getElementById('profile-container').innerHTML = '';
          document.getElementById('profile-container').appendChild(image);

      };
  
      reader.readAsDataURL(file);
  });
  });

  /*
  jQuery(function() {
    $("#Register").on("click",function(){
        var password = $("#username").val().trim()
        var username = $("#password").val().trim()
        var repeatPassword = $("#repeatPassword").val().trim()
        var nickname = $("#nickname").val().trim()
        var email = $("#email").val().trim()
        var gender = $("#gender").val().trim()
        var birthday = $("#birthday").val().trim()
        encryptedPassword = sha256(password)
        if(!password || !username){
            alert("Username and Password cannot be blank.")
            return
        }
        else if (password != repeatPassword) {
          alert('Password mismatch!');
          return
        }
        $.ajax({
            url: "/auth/register",
            method: "POST",
            dataType:"JSON",
            data:{
                username,
                encryptedPassword,
                nickname,
                email,
                gender,
                birthday

            }
        }).done(function(res){
            console.log(res)
        }).fail(function(err){
            alert(err.responseJSON.message)
        })
    })
});*/