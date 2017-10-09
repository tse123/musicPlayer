$(window).load(function(){
	
//	播放按钮点击
	var playfrag=true;
	var oMusic=document.getElementById("music");
	var lytimer;
	//	建立一个数组,存放歌曲,图片,歌词,歌曲名，歌手,背景图
	var musicArr=[
		["Charlie Puth - Look At Me Now.mp3","6631765955586153538.jpg","Charlie Puth - Look At Me Now.lrc","Look At Me Now","Charlie Puth","2b8e33ccadfe3ecaef9c1d3c742270f05ecb18ae.jpg"],
		["Various Artists - Part Of My Sexy (Mashup).mp3","adai.jpg","none.lrc","Part Of My Sexy","Various Artists","u=3213635029,1533022924&fm=214&gp=0.jpg"],
		["冯提莫-空心.mp3","feng.jpg","冯提莫-空心.lrc","空心","冯提莫","1483941890452656@800_534.jpeg"],
		["Delacey - Dream It Possible.mp3","449ba1980cdb13b15bfdb4970e26845b.jpg","Dream it possible.lrc","Dream It Possible","Delacey","u=678950469,582685004&fm=214&gp=0.jpg"],
		["Sam Tsui,Alex G - Don't Wanna Know／We Don't Talk Anymore.mp3","d8cf4c1eeab84a647303dafa7b56ff27.jpg","none.lrc","Don't Wanna Know","Sam Tsui,Alex G","20160131231658_Wyxfi.thumb.700_0.jpeg"]
	];
	$("#musicPlay").on("click",function(){
		if(playfrag){
			$(this).removeClass("iconfont icon-player-play");
			$(this).addClass("iconfont icon-zanting");
			$(".boxImg").css({"animation":"move 2s linear infinite"});
			$(".recordNeedle").css({"transform":"rotate(0deg)"});
//			循环对比,一样的显示
			for(var i=0;i<musicArr.length;i++){
				console.log($("#music").attr("src"));
				if($("#music").attr("src")=="../music/"+musicArr[i][0]){
					var oImg="<img src='../img/wave.gif' />";
					$(".boxMenu li").eq(i).find(".span1").html(oImg);
				}
			}
			
//			音乐播放
			document.getElementById("music").play();
		}else{
			$(this).removeClass("iconfont icon-zanting");
			$(this).addClass("iconfont icon-player-play");
			$(".boxImg").css({"animation-play-state":"paused"});
			$(".recordNeedle").css({"transform":"rotate(-25deg)"});
			
			for(var i=0;i<$(".boxMenu li").length;i++){
				$(".boxMenu li").eq(i).find(".span1").html(i+1);
			}
//			音乐暂停
	        document.getElementById("music").pause();
		}
		playfrag=!playfrag;
	});
//	通过定时器获取播放时间及进度条
	playtime();
	function playtime(){
		var gotime=parseInt(document.getElementById("music").currentTime);
		var alltime=parseInt(document.getElementById("music").duration);
		$(".barWid").css({"width":(gotime/alltime)*$(".progressBar").width()});
		var time1=(gotime%60)<10?("0"+gotime%60):gotime%60;
		var time2=(alltime%60)<10?("0"+alltime%60):alltime%60;
		var strtime1="0"+parseInt(gotime/60)+":"+time1;
		var strtime2="0"+parseInt(alltime/60)+":"+time2;
		$(".goingTime").html(strtime1);
		$(".allTime").html(strtime2);
	}
	var timer=setInterval(function(){
		playtime();
	},1000/60);
//	音量值得改变
	var volfrag=true;
	oMusic.volume=0.8;
	$("#vol").on("click",function(){
		$(".voiceBar").css({"height":oMusic.volume*$(".voice").height()});
		if(volfrag){
			$(".voice").show();
		}else{
			$(".voice").hide();
		}
		volfrag=!volfrag;
	});
	getLyrics("Charlie Puth - Look At Me Now.lrc");
//	歌词部分
	function getLyrics(lysrc){
		$.ajax({
			type:"get",
			url:"../lyrics/"+lysrc,
			success:function(data){
				console.log(data);
				$(".lyrics div").html("");
				clearInterval(lytimer);
				var lyobj=parseLyric(data);
				console.log(lyobj);
				var lyarr=[];
				for(var time in lyobj){
					var oP=$("<p>");
					oP.html(lyobj[time]);
					$(".lyrics div").append(oP);
					var thisarr=[];
					thisarr.push(time);
					thisarr.push(lyobj[time]);
					lyarr.push(thisarr);
				}
				
				lytimer=setInterval(function(){
					for(var i=0;i<lyarr.length;i++){
						if(document.getElementById("music").currentTime<=lyarr[0][0]){
							$(".lyrics div").css({"top":0});
						}
						if(Math.floor(document.getElementById("music").currentTime)==lyarr[i][0]){
							var index=i;
							if(index>=6){
								$(".lyrics div").css({"top":-(index-6)*$(".lyrics p").height()});
							}
							if(index>=($(".lyrics p").length-6)){
								$(".lyrics div").css({"top":-($(".lyrics p").length-12)*$(".lyrics p").height()});
							}
							$(".lyrics p").eq(i).css({"color":"#ea7377"}).siblings().css({"color":"white"});
						}
					}
					
				},1000/60);
			}
			
		});
	}
	
	function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
}
//	播放进度拖动效果
	$(".progressBar").on("click",function(e){
		var e=e||event;
		var x=e.clientX-$(".barWid").offset().left;
		document.getElementById("music").currentTime=(x/$(".progressBar").width())*document.getElementById("music").duration;
		$(".barWid").css({"width":x});
		clearInterval(timer);
		var timer=setInterval(function(){
			playtime();
		},1000/60);
		
	});
	$(".barCircle").bind("mousedown",function(){
		$("body").bind("mousemove",function(e){
			var e=e||event;
			var x=e.clientX-$(".barWid").offset().left;
			if(x>$(".progressBar").width()){
				x=$(".progressBar").width();
			}
			document.getElementById("music").currentTime=(x/$(".progressBar").width())*document.getElementById("music").duration;
			$(".barWid").css({"width":x});
		});
		$("body").bind("mouseup",function(){
			$("body").unbind("mousemove");
			clearInterval(timer);
			var timer=setInterval(function(){
				playtime();
			},1000/60);
		});
	});
//	音量的拖动
	$(".voice").on("click",function(e){
		var e=e||event;
		var y=e.clientY-$(".voice").offset().top;
		var hei=$(".voice").height()-y;
		$(".voiceBar").css({"height":hei});
		oMusic.volume=hei/$(".voice").height();
	});
	$(".voice").bind("mousedown",function(){
		$("body").bind("mousemove",function(e){
			var e=e||event;
			var y=e.clientY-$(".voice").offset().top;
			if(y<=0){
				y=0;
			}
			if(y>$(".voice").height()){
				y=$(".voice").height();
			}
			var hei=$(".voice").height()-y;
			$(".voiceBar").css({"height":hei});
			oMusic.volume=hei/$(".voice").height();
		});
		$("body").bind("mouseup",function(){
			$("body").unbind("mousemove");
		});
	});
//	右边歌曲菜单

	$(".boxMenu li .span2").on("click",function(){
		var thisindex=$(this).parent().index();
		for(var i=0;i<$(".boxMenu li").length;i++){
			$(".boxMenu li").eq(i).find(".span1").html(i+1);
		}
		var oImg="<img src='../img/wave.gif' />";
		$(this).parent().find(".span1").html(oImg);
//		音乐改变
		$("#music").attr({"src":"../music/"+musicArr[thisindex][0]});
		$(".imgWrap img").attr({"src":"../img/"+musicArr[thisindex][1]});
		$(".boxBac").css({"background":"#87754d url(../img/"+musicArr[thisindex][5]+") no-repeat 0px 0px","background-size":"100% 100%"});
		$(".musicheader").html(musicArr[thisindex][3]);
		$(".playername").html(musicArr[thisindex][4]);
//		歌词改变
		getLyrics(musicArr[thisindex][2]);
//		播放
		playfrag=true;
		$("#musicPlay").click();
		
	});
//	随机播放
	$(".icon-suiji").on("click",function(){
		var index;
		for(var i=0;i<musicArr.length;i++){
			if($("#music").attr("src")=="../music/"+musicArr[i][0]){
				index=i;
			}
		}
		var num=Math.floor(Math.random()*$(".boxMenu li").length);
		while(num==index){
			num=Math.floor(Math.random()*$(".boxMenu li").length);
		}
		$(".boxMenu li").eq(num).find(".span2").click();
	});
//	前一曲
	$(".icon-headway").on("click",function(){
		var index;
		for(var i=0;i<musicArr.length;i++){
			if($("#music").attr("src")=="../music/"+musicArr[i][0]){
				index=i;
			}
		}
		index--;
		if(index<0){
			index=musicArr.length-1;
		}
		$(".boxMenu li").eq(index).find(".span2").click();
	});
//  后一曲
$(".icon-headway1").on("click",function(){
		var index;
		for(var i=0;i<musicArr.length;i++){
			if($("#music").attr("src")=="../music/"+musicArr[i][0]){
				index=i;
			}
		}
		index++;
		if(index>musicArr.length-1){
			index=0;
		}
		$(".boxMenu li").eq(index).find(".span2").click();
	});
//安顺讯播放
	oMusic.onended=function(){
		var index;
		for(var i=0;i<musicArr.length;i++){
			if($("#music").attr("src")=="../music/"+musicArr[i][0]){
				index=i;
			}
		}
		index++;
		if(index>musicArr.length-1){
			index=0;
		}
		$(".boxMenu li").eq(index).find(".span2").click();
	}
	
});
