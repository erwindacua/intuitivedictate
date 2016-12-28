var dictate_counter = 0;

function recordings()
{
	$('#whs_loader').show();
 	$.post(api_url+"/recording/retrieve", { recID: $('#recID').val(), userID: window.localStorage.getItem("login_userID") },
	  function(res){
	   if (res.success == "true" || res.success == true) {
		   // display list
		   if (res.message != "Empty List") {
			   for(i=0; i < res.data.length; i++) {
				   //alert(path_url+res.data[i].path+res.data[i].filename);
				   str  = '<div class="item_wrap">';
				   str += '   <div class="item">';
				   str += '     <div class="item-swipe">';
				   str += '       <div class="isd_items_wrap">';
				   str += '         <div class="isd_items_titleplay">';
				   str += '           <div class="isd_items_titleplay_column1">';
				   str += '             <div class="isd_items_title_wrapbox"> <a href="#">';
				   str += '               <ul>';
				   str += '                 <li class="isd_items_title"><button class="isd_open_dictation_option"> '+res.data[i].recName+' </button></li>';
				   str += '               </ul>';
				   str += '               </a> </div>';
				   str += '           </div>';
				   str += '           <div class="isd_items_titleplay_column2 isd_title_player_show" >';
				   str += '             <input id="'+i+'" type="button" value="" class="isd_titleplay_play_btn" />';
				   str += '           </div>';
				   str += '           <div class="isd_clear"></div>';
				   str += '         </div>';
				   str += '         <div class="isd_title_time"> '+res.data[i].date+' &nbsp;&nbsp;&nbsp; Duration: '+res.data[i].duration+' </div>';
				   str += '       </div>';
				   str += '     </div>';
				   str += '     <div class="item-back">';
				   str += '       <button class="action first btn-delete" type="button" data-value="'+res.data[i].recID+'">Delete</button>';
				   str += '     </div>';
				   str += '   </div>';
				   str += '<div class="isd_record_wrap_functions isd_dictation_option_wrap" style="display: none;">';
				   str += '     <div class="isd_record_box_orange"> ';
				   str += '	  <div class="isd_record_line"></div>';
				   str += '          <div id="waveform-timeline_'+i+'"></div>		';	
				   str += '          <div id="waveform_'+i+'"></div>';
				   str += '	 </div>';
				   str += '     <div id="isd_recording_player_playpause" class="isd_recording_player">';
				   str += '      <audio id="playaudio_'+i+'" src="'+path_url+res.data[i].path+res.data[i].filename+'" preload="auto"></audio>';
				   str += '    </div>';
				   str += '    <div class="isd_recording_control">';
				   str += '      <ul>';
				   str += '        <li>';
				   str += '           <button id="isd_sent" data-toggle="modal" data-target="#isd_modal_sent" class="isd_paper_sent"></button>';
				   str += '        </li>';
	               str += '        <li>&nbsp;';
	               str += '           <button id="isd_attach" data-toggle="modal" data-target="#isd_modal_attach" class="isd_clip" style="display: none;"></button>';
	               str += '        </li>';
	               str += '         <li>&nbsp;';
	               str += '          <button class="isd_pencil" style="display: none;"></button>';
	               str += '         </li>';
	               str += '         <li>';
	               str += '           <button id="isd_delete" data-toggle="modal" class="isd_trash" data-value="'+res.data[i].recID+'"></button>';
	               str += '        </li>';
	               str += '      </ul>';
	               str += '    </div>';
	               str += '</div>';
	               str += '  <div class="isd_items_player_wrap" >';
	               str += '    <audio id="audio_'+i+'" src="'+path_url+res.data[i].path+res.data[i].filename+'" preload="auto"></audio>';
	               str += '   </div>';
	               str += '</div>';
	               
	               str += "		<script>";
            	   str += "            var wavesurfer = WaveSurfer.create({ container: '#waveform_"+i+"', waveColor: 'transparent', progressColor: '#ffffff', cursorColor: '#ffffff' });";
	               str += "            wavesurfer.load('"+path_url+res.data[i].path+res.data[i].filename+"');";
	               str += "            wavesurfer.on('ready', function () {";
	               str += "            var timeline = Object.create(WaveSurfer.Timeline);";
	               str += "                timeline.init({";
	               str += "                wavesurfer: wavesurfer,";
	               str += "                container: '#waveform-timeline_"+i+"',";
	               str += "            	primaryColor: '#ffffff',";
	               str += "            	secondaryColor: '#ffffff',";
	               str += "            	primaryFontColor: '#ffffff'";
	               str += "              });";
	               str += "            });";
	               str += "        </script>";
				   
				   $('#recordlist').append(str);
				   
				   dictate_counter++;
			   }
		   } else {
			   swal("Empty!",res.message,"info");
		   }
	   } else {
		    swal("Error!",res.message,"error");
			$('#whs_loader').hide();
	   }
	  }, "json");
}


$(document).ready(function(){
	recordings();
	
	$('body').on('click','.isd_open_dictation_option',function(){
		 $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().next().slideToggle(100);
//		$(this).parent().parent().parent().parent().parent().next().toggle();
	});
	
	$('body').on('click','.isd_dictation_option_wrap',function(){
		 //$(this).toggle();
	});
	
	
	$('.isd_text_footer_cancel').click(function(){
		// cancel new recording
		cancelRecording();
		$('.isd_text_footer_cancel').hide();
		$('.isd_text_footer').hide();
		$('.isd_button_play').hide();
		
		$('.isd_button_play').show();
	});


	$('.isd_text_footer').click(function(){
		// save new recording
		saveRecord();
        //playAudio();
	});
});
    
    
    