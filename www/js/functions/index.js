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
        
        document.getElementById("playAudio").addEventListener("click", playAudio);
		document.getElementById("pauseAudio").addEventListener("click", pauseAudio);
		document.getElementById("stopAudio").addEventListener("click", stopAudio);
        document.getElementById("startRecord").addEventListener("click", startRecord);
        document.getElementById("stopRecord").addEventListener("click", stopRecord);
        
        document.getElementById("uploadFile").addEventListener("click", uploadAudio);
        
        
        document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);	
        document.getElementById("cameraGetPicture").addEventListener("click", cameraGetPicture);	
        
        
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};



//Prepares File System for Audio Recording
var audioRecord = "myrecording.wav";
var mediaRec;


// MISC FUNCTIONS
function gotFS(fileSystem) {
    fileSystem.root.getFile(audioRecord, {
        create: true,
        exclusive: false
    }, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileURL = fileEntry.toURL();
}


function gotFSImage(fileSystem) {
    fileSystem.root.getFile(audioRecord, {
        create: true,
        exclusive: false
    }, gotFileEntryImage, fail);
}

function gotFileEntryImage(fileEntry) {
    fileURLImage = fileEntry.toURL();
}

function fail()
{
    console.log("Error file create.");
}


// NEW RECORDING FUNCTIONS ====================================================
function newRecording(fname)
{
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
	
	audioRecord = fname+".wav";

	mediaRec = new Media(audioRecord, onSuccessAudio, onErrorAudio);
	// Record audio
	mediaRec.startRecord();
}

function stopRecord(){
        // Wait
        mediaRec.stopRecord();
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

// Set audio position
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}



// AUDIO PLAYER FUNCTIONS================================================
function playAudio(fname) {
	var src = fname;

	// clear
	myMedia === null;
   
   if(myMedia === null) {
      myMedia = new Media(src, onSuccess, onError);

      function onSuccess() {
         console.log("playAudio Success");
      }

      function onError(error) {
         console.log("playAudio Error: " + error.code);
      }
   }

   myMedia.play();
}

function pauseAudio() {
   if(myMedia) {
      myMedia.pause();
   }
}

function stopAudio() {
   if(myMedia) {
      myMedia.stop(); 
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
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = "recordupload.wav";
    options.mimeType = "audio/wav";

    var ft = new FileTransfer();
    ft.upload(fileURL, encodeURI("http://192.168.1.46/dictate/server/index.php/recording/upload_recording"), win, fail, options);

    uploadImage();
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
    options.fileName = "patient.jpg";
    options.mimeType = "image/jpg";
    
    fileImage = window.localStorage.getItem('imgForUpload');
alert(fileImage);
    var ft = new FileTransfer();
    ft.upload(fileImage, encodeURI("http://192.168.1.46/dictate/server/index.php/recording/upload_recording"), win, fail, options);

    
}




// picture
function cameraTakePicture() {
    //alert("camera");
   navigator.camera.getPicture(onSuccess, onFail, { 
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
       targetWidth: 200,
       targetHeight: 200,
       saveToPhotoAlbum: true
   });

   function onSuccess(imageURI) {
       alert(imageURI);
      var image = document.getElementById('myImage');
      //image.src = "data:image/jpeg;base64," + imageData;
       image.src = imageURI
       // console.log(image.fileSize);
       
       //gotFileEntryImage(imageURI);
       window.localStorage.setItem('imgForUpload', imageURI);
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }
    
    
}

function cameraGetPicture() {
   navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
   });

   function onSuccess(imageURL) {
       //alert(imageURL);
      var image = document.getElementById('myImage');
      image.src = imageURL;
       //console.log(image.fileSize);
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }

}


app.initialize();