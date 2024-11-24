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