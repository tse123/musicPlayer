$(window).load(function(){
	var oVideo=document.getElementById("vio");
	$(".videoBox").hover(function(){
		$(".headtitle").stop().slideDown();
		$(".progressBar").stop().fadeIn();
		$(".clickBtns").stop().fadeIn();
	},function(){
		$(".headtitle").stop().slideUp();
		$(".progressBar").stop().fadeOut();
		$(".clickBtns").stop().fadeOut();
	});
//	播放按钮的点击
	var playfrag=true;
	$("#playbtn").on("click",function(){
		if(playfrag){
			$("#playbtn").removeClass("iconfont icon-player-play");
			$("#playbtn").addClass("iconfont icon-zanting");
			oVideo.play();
		}else{
			$("#playbtn").removeClass("iconfont icon-zanting");
			$("#playbtn").addClass("iconfont icon-player-play");
			oVideo.pause();
		}
		playfrag=!playfrag;
	});
//	自然播放状态下
	var timer=setInterval(function(){
		$(".barWid").css({"width":(oVideo.currentTime/oVideo.duration)*$(".progressBar").width()});
		var alltime1=parseInt(oVideo.duration/60);
		if(alltime1<10){
			alltime1="0"+alltime1;
		}
		var alltime2=parseInt(oVideo.duration%60);
		if(alltime2<10){
			alltime2="0"+alltime2;
		}
		var alltime="00:"+alltime1+":"+alltime2;
		$(".videotime .span2").html(alltime);
		
		var gotime1=parseInt(oVideo.currentTime/60);
		if(gotime1<10){
			gotime1="0"+gotime1;
		}
		var gotime2=parseInt(oVideo.currentTime%60);
		if(gotime2<10){
			gotime2="0"+gotime2;
		}
		var gotime="00:"+gotime1+":"+gotime2;
		$(".videotime .span1").html(gotime);
	},1000/60);
	
//	进度条的拖拽
	
	$(".progressBar").on("click",function(e){
		var e=e||event;
		var x=e.clientX-$(".barWid").offset().left;
		document.getElementById("vio").currentTime=(x/$(".progressBar").width())*document.getElementById("vio").duration;
		$(".barWid").css({"width":x});
	});
	$(".barCircle").bind("mousedown",function(){
		$("body").bind("mousemove",function(e){
			var e=e||event;
			var x=e.clientX-$(".barWid").offset().left;
			if(x>$(".progressBar").width()){
				x=$(".progressBar").width();
			}
			document.getElementById("vio").currentTime=(x/$(".progressBar").width())*document.getElementById("vio").duration;
			$(".barWid").css({"width":x});
		});
		$("body").bind("mouseup",function(){
			$("body").unbind("mousemove");
		});
	});
//	声音的拖拽
	oVideo.volume=0.9;
	$(".volWid").css({"width":oVideo.volume*$(".volBar").width()});
	$(".volBar").on("click",function(e){
		var e=e||event;
		var wid=e.clientX-$(".volBar").offset().left;
		$(".volWid").css({"width":wid});
		oVideo.volume=wid/$(".volBar").width();
	});
	$(".volBar").bind("mousedown",function(){
		$("body").bind("mousemove",function(e){
			var e=e||event;
			var wid=e.clientX-$(".volBar").offset().left;
			if(wid<=0){
				wid=0;
			}
			if(wid>$(".volBar").width()){
				wid=$(".volBar").width();
			}
			
			$(".volWid").css({"width":wid});
			oVideo.volume=wid/$(".volBar").width();
		});
		$("body").bind("mouseup",function(){
			$("body").unbind("mousemove");
		});
	});
//	快进和快退
	$(".icon-headway1").on("click",function(){
		oVideo.currentTime+=5;
		if(oVideo.currentTime>=oVideo.duration){
			oVideo.currentTime=oVideo.duration;
		}
	});
	$(".icon-headway").on("click",function(){
		oVideo.currentTime-=5;
		if(oVideo.currentTime<=0){
			oVideo.currentTime=0;
		}
	});
});
