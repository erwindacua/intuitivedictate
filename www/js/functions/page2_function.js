function saveSettings()
{
	window.localStorage.setItem("settings_name",$('#settings_name').val());
	window.localStorage.setItem("settings_server",$('#settings_server').val());
	window.localStorage.setItem("settings_port",$('#settings_port').val());
	window.localStorage.setItem("settings_username",$('#settings_username').val());
	window.localStorage.setItem("settings_password",$('#settings_password').val());
	window.localStorage.setItem("settings_path",$('#settings_path').html());
	
	swal("Settings","Saved!","info");
}

