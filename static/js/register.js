document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Register').addEventListener('click', function (event) {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const repeatPassword = document.getElementById('repeatPassword').value;
      const nickname = document.getElementById('nickname').value;
      const email = document.getElementById('email').value;
      const gender = document.getElementById('gender').value;
      const birthday = document.getElementById('birthday').value;
      const fileInput = document.getElementById('imageInput');
      const file = fileInput.files[0];
  
      if (!username || !password) {
        alert('Username and password cannot be empty');
        return;
      } 
      else if (password != repeatPassword) {
        alert('Password mismatch!');
        return;
      }
  
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('nickname', nickname);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('birthday', birthday);
      formData.append('role', "user"); // all account that can be registered are users.
      
  
      fetch('/auth/register', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            alert(`Welcome, ${data.user.username}!\nYou can login with your account now!`);
            window.location.href = '/login.html';
          } else if (data.status === 'failed') {
            alert(data.message);
          } else {
            alert('error');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(error);
        });
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