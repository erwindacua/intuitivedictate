function authenticate()
{
    
	if ($('#username').val() && $('#password').val()) {
		$('#whs_loader').show();
	 	$('#cmdlogin').attr('disabled',true);
	
        
	 	$.post(api_url+"/api/authenticate", { username: $('#username').val(), password: $('#password').val() },
		  function(res){
            //alert($('#username').val());
            //alert(res.success);
		   if (res.success == "true" || res.success == true) {
			   $('#cmdlogin').attr('disabled',false);
			   
			   window.localStorage.setItem("login_userID",res.data.userID);
			   window.localStorage.setItem("login_username",res.data.username);
			   window.localStorage.setItem("login_lname",res.data.lname);
			   window.localStorage.setItem("login_fname",res.data.fname);
			   window.localStorage.setItem("login_mname",res.data.mname);
			   
			   
			   if (window.localStorage.getItem("settings_username") != "") {
				   window.localStorage.setItem("settings_name","FTP");
				   window.localStorage.setItem("settings_server","139.162.34.31");
				   window.localStorage.setItem("settings_port","21");
				   window.localStorage.setItem("settings_username",res.data.username);
				   window.localStorage.setItem("settings_password",res.data.username+"@123");
				   window.localStorage.setItem("settings_path","/recordings/"+res.data.username);
			   }
			   
			   window.location = "page1.html";
		   } else {
			    swal("Invalid Authentication!",res.message,"error");
				$('#whs_loader').hide();
			 	$('#cmdlogin').attr('disabled',false);
		   }
		  }, "json");
	 	
	} else {
		 swal("Required!","Please enter username and password.","error");
		 $('#username').focus();
	}
}