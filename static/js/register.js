document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Register').addEventListener('click', function (event) {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const repeatPassword = document.getElementById('repeatPassword').value;
      const nickname = document.getElementById('nickname').value;
      const email = document.getElementById('email').value;
      const gender = document.getElementById('gender').value;
      const birthday = document.getElementById('birthday').value;
  
      if (!username || !password) {
        alert('Username and password cannot be empty');
        return;
      } 
      else if (password != repeatPassword) {
        alert('Password mismatch!');
        return;
      }
  
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('nickname', nickname);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('birthday', birthday);
      
  
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
  });
  