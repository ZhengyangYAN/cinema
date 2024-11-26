document.addEventListener('DOMContentLoaded',async function () {
  var img = null

  jQuery(function(){
    $.ajax({
        url:"/auth/me",
        method:"GET",
        dataType:"json"
    }).done(function(result){
      window.location.href = "/dashboard.html"
    }).fail()
})
  var formData = new FormData();
  $("#profileImage").on("click",function(){$("#imageUpload").trigger("click")})
    $("#imageUpload").on("change",function(){
        var filePath = new FileReader()
        img = this.files[0]
        filePath.readAsDataURL(img)
        filePath.onload = function(){
            $("#profileImage").attr("src",this.result)
        }
        formData.append('avatar', img);
    })
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
      if(!img){
        alert("The avatar cannot be empty.")
        return
      }
      
      //formData.append('profileImage', file);
      const encryptedPassword = sha256(password)
      formData.append("username",username)
      formData.append("encryptedPassword",encryptedPassword)
      formData.append("email",email)
      formData.append("gender",gender)
      formData.append("birthday",birthday)
      formData.append("nickname",nickname)
      formData.append("role","user")

      $.ajax({
        data:formData,
        url:"/auth/register",
        method:"POST",
        contentType: false,
        processData: false,
        dataTypeL:"json"
      }).done(function(data){
        if (data.status === 'success') {
          alert(`Welcome, ${data.user.username}!\nYou can login with your account now!`);
          window.location.href = '/login.html';
        }
      }).fail(function(err){
          alert(err.responseJSON.message)
      })

  });
  });