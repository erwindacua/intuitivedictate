
//Prepares File System for Audio Recording
var audioRecord = "myrecording.wav";
var imageRecord = "patient.jpg";
var mediaRec;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
//        document.getElementById("startRecord").addEventListener("click", startRecord);
//        document.getElementById("stopRecord").addEventListener("click", stopRecord);
//        
//        document.getElementById("uploadFile").addEventListener("click", uploadAudio);
//        
//        
//        document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);	
//        document.getElementById("cameraGetPicture").addEventListener("click", cameraGetPicture);	
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFSImage, fail);
        
        //alert("hello1");
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        //alert("hello2");
    }
};





// MISC FUNCTIONS
function gotFS(fileSystem) {
    //alert(audioRecord);
    fileSystem.root.getFile(audioRecord, {
        create: true,
        exclusive: false
    }, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileURL = fileEntry.toURL();
}


function gotFSImage(fileSystem) {
    fileSystem.root.getFile(imageRecord, {
        create: true,
        exclusive: false
    }, gotFileEntryImage, fail);
}

function gotFileEntryImage(fileEntry) {
    fileURLImage = fileEntry.toURL();
}

function fail()
{
    alert("Error file create.");
    console.log("Error file create.");
}


var recTime = 0;
var recInterval;

function myTimer() {
	recTime = recTime + 1;
	$('#newDictationDuration').html(secondsToHms(recTime));
}

// NEW RECORDING FUNCTIONS ====================================================
function newRecording()
{
    //var src = audioRecord;
    
	recTime = 0;
	window.localStorage.setItem('new_dicate_duration', recTime);
	//audioRecord = "dictate_"+(dictate_counter+1)+".wav";
	window.localStorage.setItem('new_dicate_filename', "recording_"+(dictate_counter+1)+".wav");
	window.localStorage.setItem('new_dicate_recName', "Dictation "+(dictate_counter+1));
	window.localStorage.setItem('new_dicate_imagename', "patient_"+(dictate_counter+1)+".jpg");
	window.localStorage.setItem('new_dicate_path', "recordings/"+window.localStorage.getItem("login_username")+"/");
	
	$('#newDictationName').html("Dictation "+(dictate_counter+1));
	
    //alert("recording...");
	//window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
    
	mediaRec = new Media(audioRecord, onSuccessAudio, onErrorAudio);
	//var mediaRec = new Media(src, onSuccessAudio, onErrorAudio);
    
    //alert("recording2...");
    // Record audio
	mediaRec.startRecord();
	//alert("recording3...");
	recInterval = setInterval(function(){ myTimer() }, 1000);
}


// onSuccess Callback
function onSuccessAudio() {
    console.log("recordAudio():Audio Success");
}

// onError Callback 
function onErrorAudio(error) {
    alert('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}


function stopRecord(){
	window.localStorage.setItem('new_dicate_duration', recTime);
    clearInterval(recInterval);
    
    // Wait
    mediaRec.stopRecord();
    
    //mediaRec.play();
}

function cancelRecording()
{
	window.localStorage.removeItem("new_dicate_recName");
	window.localStorage.removeItem("new_dicate_filename");
	window.localStorage.removeItem("new_dicate_duration");
	window.localStorage.removeItem("new_dicate_imagename");
	window.localStorage.removeItem("new_dicate_path");
	
   $("#isd_button_play").hide();
   $("#isd_button_stop").show();
   $("#isd_record_item").hide();
}

function saveRecord()
{
	$.post(api_url+"/recording/save", { 
		recName: window.localStorage.getItem("new_dicate_recName"),
		filename: window.localStorage.getItem("new_dicate_filename"),
		path: window.localStorage.getItem("new_dicate_path"),
		duration: window.localStorage.getItem("new_dicate_duration"),
		imagename: window.localStorage.getItem("new_dicate_imagename"),
		userID: window.localStorage.getItem("login_userID"),
		},
	  function(res){
	   if (res.success == "true" || res.success == true) {
		  // increase counter
		  dictate_counter = dictate_counter + 1;
		   //alert(audioRecord);
		  // upload audio
		  uploadAudio();
		  
	   }
	  }, "json");
}


// Set audio position
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}



//var myMedia2;
// AUDIO PLAYER FUNCTIONS================================================
function playAudio() {
    
	var src = fileURL;
	// clear
//	myMedia2 === null;
   
  // if(myMedia2 === null) {
      // alert(fileURL);
      var myMedia2 = new Media(src, onSuccess, onError);
//alert(fileURL);
      function onSuccess() {
         console.log("playAudio Success");
      }

      function onError(error) {
         console.log("playAudio Error: " + error.code);
      }
   //}

   myMedia2.play();
}

function pauseAudio() {
   if(myMedia2) {
      myMedia2.pause();
   }
}

function stopAudio() {
   if(myMedia2) {
      myMedia2.stop(); 
   }
   myMedia = null;
}


var volumeValue = 0.5;

function volumeUp() {
   if(myMedia && volumeValue < 1) {
      myMedia.setVolume(volumeValue += 0.1);
   }
}

function volumeDown() {
   if(myMedia && volumeValue > 0) {
      myMedia.setVolume(volumeValue -= 0.1);
   }
}

// uploading part here ---------------------
//Method to upload Audio file to server
var uploadAudio = function () {
    
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    var fail = function (error) {
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = window.localStorage.getItem('new_dicate_filename');
    options.mimeType = "audio/wav";

    //alert(fileURL);
    var ft = new FileTransfer();
    
    //alert(fileURL);
    
    //fileURL = audioRecord;
    //alert("shit");
    ft.upload(fileURL, encodeURI(api_url+"/recording/upload_recording"), win, fail, options);

    //alert(window.localStorage.getItem('imgForUpload'));
    if (window.localStorage.getItem('imgForUpload')) {
    	uploadImage();
    } else {
    	//swal("Record saved!","Success","success");
    
        swal({
			  title: 'Record saved!',
			  text: "Success",
			  type: 'success',
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: "Yes"
			}).then(function() {
				// prepare for new 
				  $("#isd_button_play").hide();
				  $("#isd_record_item").hide();
				  $('.isd_text_footer_cancel').hide();
				  $('.isd_text_footer').hide();
				  
				  $("#isd_button_stop").show();
				  
				  // refresh
				  window.location = "page1.html";
			})
    }
    
}


function uploadImage() {
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = window.localStorage.getItem("new_dicate_imagename");
    options.mimeType = "image/jpg";
    
    //fileImage = window.localStorage.getItem('imgForUpload');
    fileImage = window.localStorage.getItem('imgForUpload');
    ///alert(fileImage);
    var ft = new FileTransfer();
    ft.upload(fileImage, encodeURI(api_url+"/recording/upload_recording"), win, fail, options);
    
    //swal("Record saved!","Success","success");
    swal({
			  title: 'Record saved!',
			  text: "Success",
			  type: 'success',
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: "Yes"
			}).then(function() {
				// prepare for new 
				  $("#isd_button_play").hide();
				  $("#isd_record_item").hide();
				  $('.isd_text_footer_cancel').hide();
				  $('.isd_text_footer').hide();
				  
				  $("#isd_button_stop").show();
				  
				  // refresh
				  window.location = "page1.html";
			})
}

// picture
function cameraTakePicture() {
   navigator.camera.getPicture(onSuccess, onFail, { 
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
       targetWidth: 200,
       targetHeight: 200,
       saveToPhotoAlbum: true
   });

   function onSuccess(imageURI) {
       //alert(imageURI);
      var image = document.getElementById('myImage');
      //image.src = "data:image/jpeg;base64," + imageData;
       image.src = imageURI
       // console.log(image.fileSize);
       //alert(imageURI);
       //gotFileEntryImage(imageURI);
       window.localStorage.setItem('imgForUpload', imageURI);
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }
}

function cameraGetPicture() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 200,
       targetHeight: 200,
       saveToPhotoAlbum: true
   });

   function onSuccess(imageURI) {
       //alert(imageURL);
      var image = document.getElementById('myImage');
      image.src = imageURI;
       window.localStorage.setItem('imgForUpload', imageURI);
       //console.log(image.fileSize);
   }
        

   function onFail(message) {
      alert('Failed because: ' + message);
   }
}

app.initialize();