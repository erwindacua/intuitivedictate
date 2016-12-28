//var api_url = "http://localhost/dictate/server/index.php";
////var path_url = "/srv/www/li1447-31.members.linode.com/public_html/dictate";
//var path_url = "http://localhost/dictate/server/";

var api_url = "http://139.162.34.31/dictate/index.php";
var path_url = "http://139.162.34.31/dictate/";


$(document).ready(function() {
	$('#dictate_logout').click(function(){
		swal({
			  title: 'Are you sure you want to log out?',
			  text: "Good bye!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: "Yes"
			}).then(function() {
				$.post(api_url+"/api/logout", { userID: window.localStorage.getItem("login_userID") },
				  function(res){
				   if (res.success == "true" || res.success == true) {
					   
					   window.localStorage.setItem("login_userID","");
					   window.localStorage.setItem("login_username","");
					   window.localStorage.setItem("login_lname","");
					   window.localStorage.setItem("login_fname","");
					   window.localStorage.setItem("login_mname","");
					   
					   location.href='index.html';
				   }
				  }, "json");
				
				
			})
	});
});



function getFormattedTime(position) {
    if (position > 0) {
        position = Math.floor(position);

        return secondsToHms(position);
    }
    else
        return "0:00";
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}