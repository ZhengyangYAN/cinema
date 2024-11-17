jQuery(function() {
    var img = null
    $("#profileImage").on("click",function(){$("#imageUpload").trigger("click")})
    $("#imageUpload").on("change",function(){
        var filePath = new FileReader()
        img = this.files[0]
        filePath.readAsDataURL(img)
        filePath.onload = function(){
            $("#profileImage").attr("src",this.result)
        }
        
        console.log(img)
    })
    $("#Create").on("click",function(){
        alert("Created")
    })
});