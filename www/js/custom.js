"use strict";

function preloader() {
	$(window).load(function() {
		$(".animationload").delay(600).fadeOut("slow");
	});
}


