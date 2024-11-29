//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
jQuery(function(){
  var img = null
  var username = null
  var isImg = 0
  var formData = new FormData();
  $("#transaction").on("click",function(){
    $.ajax({
      url:"/auth/me",
      method:"GET",
      dataType:"json"
    }).done(function(res){
      img = null
      isImg = 0
      username = res.user.username
      $("#avatar").attr("src",res.user.avatarUrl)
      $("#nname").empty().append(res.user.nickname)
      $("#uname").empty().append(res.user.username)
      $("#rrole").empty().append(res.user.role)
      $.ajax({
        url:"/payment/history",
        method:"POST",
        data:{
          id: res.user.id
        }
      }).done(function(history){
        if(!history) $("#info").empty().append(`<h2 class = "text-white">No Record.</h2>`)
        else{
          $("#info").empty()
          for(let i in history){
            const date = new Date(history[i].time)
            var hour = date.getHours()>12?date.getHours()%13 + 1:date.getHours();
            hour = hour.toString().padStart(2,'0');
            const dayPeriod = date.getHours()>12?"PM":"AM";
            const dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + 
            ", " + hour + ":" + date.getMinutes().toString().padStart(2,'0') + ":" + date.getSeconds().toString().padStart(2,'0')
            + " " + dayPeriod;
            $("#info").append(`
              <div class="payment_container">
                <h3>Order Time: ${dateString}</h3>
                <div id = "transaction${i}">
                  <h5>Movie: ${history[i].title}</h5>
                  <h5>Venue: ${history[i].venue}</h5>
                  <h5>Timeslot: ${history[i].timeslot}</h5>
                  <h5>Order Number: ${history[i].orderNum}</h5>
                  <h5>Status: ${history[i].status}</h5>
                  <h5>Seats:</h5>
                </div>
                <hr>
                <h5>Total: <span class="price"><b>$${history[i].totalPrice}</b></span></h5>
              </div>`)
            for(let j in history[i].seatInfo){
              $("#transaction"+i).append(`
                <h5><b>${history[i].seatInfo[j].seatNo} --- </b><span class="price">$${history[i].seatInfo[j].price}</span></h5>`)
            }
          }
        }
      }).fail(function(err){
        alert(err.responseJSON.message)
      })
    }).fail(function(){
      alert("You are not logged in, go login.")
      window.location.href = "/login.html"
    })
  })
  $("#transaction").trigger("click")
  

  $("#setting").on("click",function(){
    $.ajax({
      url:"/auth/me",
      method:"GET",
      dataType:"json"
    }).done(function(res){
      $("#info").empty().append(`
        <form>
          <h2 class = "text-white  fw-bold mt-3">Edit Profile</h2>
          <div class="form-group text-white mb-3">
              <div id="profile-container" >
                  <image id="profileImage" alt = "" src = "${res.user.avatarUrl}" />
                </div>
              <input id="imageUpload" type="file" name="profile_photo" placeholder="Photo" required="" class = "d-none" input>
              <label for="username" class="form-label"  >Username:</label>
              <input type="text" class="form-control" value = "${res.user.username}" id="username" name="username" /> 
              <label for="nickname" class="form-label">Nickname:</label>
              <input type="text" class="form-control" id="nickname" name="nickname" value = "${res.user.nickname}"/>
              <label for="email" class="form-label" >Email:</label>
              <input type="text" class="form-control" value = "${res.user.email}"id="email" required name="email" />
              <label for="gender">Gender:</label>
              <select id="gender" name="gender" class="form-control mb-3" value = "" >
                <option disabled >-- Please Select --</option>
                <option value="male" >Male</option>
                <option value="female" >Female</option>
              </select>
              <label for="birthday">Birthday:</label>
              <input type="date" id="birthday" name="birthday" value = "${res.user.birthday}">
          </div>
          <button type = "button" class = "btn mt-3 btn-danger" id = "update">Update Profile</button>
        </form>
        `)
        $("#gender").val(res.user.gender)
        $("#profileImage").on("click",function(){$("#imageUpload").trigger("click")})
        $("#imageUpload").on("change",function(){
            var filePath = new FileReader()
            img = this.files[0]
            isImg = 1
            filePath.readAsDataURL(img)
            filePath.onload = function(){
                $("#profileImage").attr("src",this.result)
            }
            formData.append('avatar', img);
        })
        $("#update").on("click",function(){
          console.log($("#username").val())
          formData.append("username",$("#username").val())
          formData.append("email",$("#email").val())
          formData.append("gender",$("#gender").val())
          formData.append("birthday",$("#birthday").val())
          formData.append("nickname",$("#nickname").val())
          formData.append("role",res.user.role)
          formData.append("currentAvatar",res.user.avatarUrl)
          formData.append("isImg",isImg)
          formData.append("id",res.user.id)
          $.ajax({
            data:formData,
            dataType:"json",
            contentType: false,
            processData: false,
            url:"auth/update",
            method:"POST"
          }).done(function(res){
            formData = new FormData()
            alert("Success update, login again.")
            window.location.href = "/login.html"
          }).fail(function(){
            alert("Error, try again.")
            formData = new FormData()
          })
        })
    }).fail(function(){
      alert("You are not logged in, go login.")
      window.location.href = "/login.html"
    })
  })
  $("#change").on("click",function(){
    $("#info").empty().append(`
      <form>
        <h2 class = "text-white  fw-bold mt-3">Change Password</h2>
        <div class="form-group text-white mb-3">
            <label for="password" class="form-label">*New Password:</label>
            <input type="text" class="form-control" id="password" name="password" />  
            <label for="repeatPassword" class="form-label">*Repeat your Password:</label>
            <input type="text" class="form-control" id="repeatPassword" name="repeatPassword" /> 
        </div>
        <button type = "button" class = "btn mt-3 btn-danger" id = "confirm">Confirm</button>
      </form>
      `)
      $("#confirm").on("click",function(){
        $.ajax({
          method:"POST",
          data:{
            username:username,
            encryptedPassword: sha256($("#password").val())
          },
          url:"auth/password"
        }).done(function(){
          alert("Change success, please log in again.")
          window.location.href = "/login.html"
        }).fail(function(err){
          alert(err.responseJSON.message)
        })
      })
    })
    
    $("#logout").on("click",function(){
      $.ajax({
        method:"GET",
        url:"auth/logout"
      }).done(function(){
        alert("Logout success.")
        window.location.href = "/dashboard.html"
      }).fail(function(err){
        alert(err.responseJSON.message)
      })
    })
})