/*
 * Name: SewiseCut framework 1.0.0
 * Author: Jack Zhang
 * Website: http://www.sewise.com
 * Date: July 16, 2014
 * Copyright: 2013-2014, Sewise
 * Mail: jackzhang1204@gmail.com
 * 
 */

(function(win){
	var $skin = "";
	var $serverPath;
	var $serverApi = "ServerApi.execute";
	//var $recordId = "s28Cy5Mn";
	var $videoUrl;
	var $programName;
	var $programStartTime;
	var $programEndTime;
	var $dataInterval = 10;
	var $buffer = 5;
	var $type = 'flv';
	var $requestUrl = "";
	var $callback = "";
	
	///////////////////////////////////////////////////////////////////////////////////
	var fileNames = ["SewiseCut.js", "sewise.cut.min.js"];
	var parameObj = SewiseCut.Utils.getParameters(fileNames);
	/////////////////////////////////////
	var scrptElement = SewiseCut.script;
	var container = scrptElement.parentNode;
	var prothost = SewiseCut.Utils.location.porthost(SewiseCut.localPath);
	var jsonpURL;
	var playVars;
	var debug = parameObj.debug ? parameObj.debug : "false";
	if(debug == "true"){
		prothost = "192.168.1.29";
	}
	jsonpURL = "http://" + prothost + "/service/playerapi/";
	$serverPath = "http://" + prothost + "/flashservice/gateway.php";
	$callback = parameObj.callback ? parameObj.callback : "";
	$programName = parameObj.videoname ? parameObj.videoname : "";
	var url = parameObj.url ? parameObj.url : "";
	$requestUrl = url;
	$skin = SewiseCut.localPath + "assets/cutplayer/xcut.swf";
	//console.log($skin);
	var urlArray = url.split(":");
	if(urlArray[0] == "http"){
		$videoUrl = url;
		$programStartTime = parameObj.starttime ? parameObj.starttime : "";
		$programEndTime = parameObj.endtime ? parameObj.endtime : "";
		////////////////////
		loadSwfObjectJS();
	}else if(urlArray[0] == "vod"){
		SewiseCut.Utils.jsonp({
			url: jsonpURL,
			jsonp: "jsproxy",
			jsonpCallback: "callbackFun",
			data:{
				"do":"geturl",
				"url":url
			},
			success:function(data){
				//console.log("url:" + data.infos.url);
				//console.log("starttime:" + data.infos.starttime);
				//console.log("endtime:" + data.infos.endtime);
				$videoUrl = data.infos.url;
				if($programName === "") $programName = data.infos.name;
				$programStartTime = data.infos.starttime;
				$programEndTime = data.infos.endtime;

				////////////////////
				loadSwfObjectJS();
			}
		});
	}

	function loadSwfObjectJS(){
		playVars = {
			skin				: $skin,
			serverPath			: $serverPath,
			serverApi			: $serverApi,
			//recordId			: $recordId,
			videoUrl			: $videoUrl,
			programName			: $programName,
			programStartTime	: $programStartTime,
			programEndTime		: $programEndTime,
			dataInterval		: $dataInterval,
			buffer				: $buffer,
			type  				: $type,
			requestUrl          : $requestUrl,
			callback            : $callback
		}
		////////////////////
		var swfobjectPath = SewiseCut.localPath + "swfobject.js";
		SewiseCut.Utils.loader.loadJsFile(window.swfobject, swfobjectPath, swfobjectLoadedCallback);
	}
	function swfobjectLoadedCallback(){
		creatFlashPlayer(container, playVars);
	}
	function creatFlashPlayer($container, $playVars){
		var container = $container;
		var flashVars = $playVars;
		///////////////////////////
		var swfDiv = document.createElement("div");
		var swfDivId = "swf-container";
	    swfDiv.id = swfDivId;
	    container.appendChild(swfDiv);
		var flashParams = {
			allowfullscreen 	: true,
			wmode             	: "transparent",
			allowscriptaccess 	: "always"
		};
		var flashAttrs = {
			id 					: "SewiseCut",
			name 				: "SewiseCut"
		};
		var mainSwfPath = SewiseCut.localPath + "CutCenterFlex.swf";
		swfobject.embedSWF(mainSwfPath, swfDivId, "100%", "100%", "9.0.115", false, flashVars, flashParams, flashAttrs, function(){
			//console.log("flash embed success! \n深圳市矽伟智科技有限公司（SEWISE）是一家从事音视频的流媒体编码、分发和存储的流媒体云计算 公司。 \n公司地址：深圳市南山区南头街道办前海路振业国际大厦1005室 \n邮编：518052 \n总机：+86 755 22672286");
		});
	}
	
	
})(window);

