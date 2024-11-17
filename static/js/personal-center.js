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

fetch('/auth/me')
  .then((response) => response.json())
  .then((data) => {
    if (data.status === 'success') {
        document.getElementById('profileImage').src = data.user.profileImage;
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Unkonw error');
  });