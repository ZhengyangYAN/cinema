//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
jQuery(async function() {
    var table = new DataTable('#user-data');
    $.ajax({
        method:"GET",
        dataType:"json",
        url:"/backend/all-users"
    }).done(function(res){
        console.log(res)
        for(let i in res){
            table.row
                .add([
                    res[i]._id,
                    res[i].username,
                    res[i].nickname,
                    res[i].birthday,
                    res[i].email,
                    res[i].gender,
                    res[i].role
                ]) .draw(false);
        }
        
    }).fail(function(err){
        alert(err.status)
    })
    var img = null
    var formData = new FormData();
    var isImg = 0
    var imgUrl = null
       
    $('#user-data tbody').on('click', 'tr', function() {

        $.ajax({
            url:"/auth/user",
            method:"POST",
            dataType:"json",
            data:{
                id:table.row(this).data()[0]
            }
        }).done(function(res){
            console.log(res)
            $("#data-table").addClass("d-none")
            $("#info").empty().append(`
            <form>
                <h2 class = "text-white  fw-bold mt-3">Edit Profile</h2>
                <div class="form-group text-white mb-3">
                    <div id="profile-container" >
                        <image id="profileImage" alt = "" />
                    </div>
                    <input id="imageUpload" type="file" name="profile_photo" placeholder="Photo" required="" class = "d-none" input>
                    <label for="username" class="form-label"  >Username:</label>
                    <input type="text" class="form-control" value = "${res.username}" id="username" name="username" /> 
                    <label for="nickname" class="form-label">Nickname:</label>
                    <input type="text" class="form-control" id="nickname" name="nickname" value = "${res.nickname}"/>
                    <label for="email" class="form-label" >Email:</label>
                    <input type="text" class="form-control" value = "${res.email}"id="email" required name="email" />
                    
                    <label for="gender">Gender:</label>
                    <select id="gender" name="gender" class="form-control" value = "" >
                    <option disabled >-- Please Select --</option>
                    <option value="male" >Male</option>
                    <option value="female" >Female</option>
                    </select>
                    <label for="role">Role:</label>
                    <select id="role" name="role" class="form-control mb-3" value = "" >
                    <option disabled >-- Please Select --</option>
                    <option value="admin" >Admin</option>
                    <option value="user" >User</option>
                    </select>
                    <label for="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" value = "${res.birthday}">
                </div>
                
                <button type = "button" class = "btn mt-3 btn-danger" id = "update">Update</button>
                <button type = "button" class = "btn mt-3 btn-secondary" id = "cancel">Cancel</button>
            </form>
            `)
            $("#profileImage").attr("src","/"+res.avatarUrl)
            $("#gender").val(res.gender)
            $("#role").val(res.role)
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
            $("#cancel").on("click",function(){
                $("#info").empty()
                $("#data-table").removeClass("d-none")
            })
            $("#update").on("click",function(){
                console.log($("#username").val())
                formData.append("username",$("#username").val())
                formData.append("email",$("#email").val())
                formData.append("gender",$("#gender").val())
                formData.append("birthday",$("#birthday").val())
                formData.append("nickname",$("#nickname").val())
                formData.append("role",$("#role").val())
                formData.append("currentAvatar",res.avatarUrl)
                formData.append("isImg",isImg)
                formData.append("id",res._id)
                $.ajax({
                data:formData,
                dataType:"json",
                contentType: false,
                processData: false,
                url:"/auth/manage-user",
                method:"POST"
                }).done(function(res){
                    formData = new FormData()
                    alert("Success update.")
                    $("#info").empty()
                    $("#data-table").removeClass("d-none")
                }).fail(function(){
                    alert("Error, try again.")
                    formData = new FormData()
                    $("#info").empty()
                    $("#data-table").removeClass("d-none")
                })
            })
        }).fail(function(){
            alert("Error, try again.")
        })
    })


});