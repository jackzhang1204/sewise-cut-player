(function(){
	/**
	 * Constructor.
	 * @name Utils : 工具对象.
	 * 
	 */
	var Utils = SewiseCut.Utils = {
		/**
		 * JSONP方式请求，服务器端要求地址格式如下
		 * 1.点播: "http://192.168.1.24/service/playerapi/?do=getvideos&callback=callbackFun&programid=WDK4kyc3&m3u8=1&isAjax=1";
		 * 2.直播: "http://192.168.1.219/service/playerapi/?do=getm3u8bypid&programid=xCM4opc3&published=0";
		 */
		jsonp: function(obj){
			var url = obj.url;
			var jsonp = obj.jsonp;
			var jsonpCallback = obj.jsonpCallback;
			var data = obj.data;
			var success = obj.success;
			var dataStr = "";
			for (var prop in data) { 
				dataStr += ("&" + prop + "=" + data[prop]);
			}
			dataStr = ("?" + dataStr.slice(1));
			if(jsonp === undefined){
				jsonp = "callback";
			}
			if(jsonpCallback === undefined){
				jsonpCallback = "callbackFun" + new Date().getTime();
			}
			var funStr = "&" + jsonp + "=" + jsonpCallback;
			var src = url + dataStr + funStr;
			var script = document.createElement('script');
	        script.setAttribute("type", "text/javascript");
	        script.src = src;
	        document.body.appendChild(script);
	        window[jsonpCallback] = success;
	        script.onload = script.onreadystatechange = function(){
				if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
	        		document.body.removeChild(script);
				}
			};
		},
		getScript: function(obj){
			var url = obj.url;
			var data = obj.data;
			var success = obj.success;
			var dataStr = "";
			for (var prop in data) { 
				dataStr += ("&" + prop + "=" + data[prop]);
			}
			dataStr = ("?" + dataStr.slice(1));
			var src = url + dataStr;
			var script = document.createElement('script');
	        script.setAttribute("type", "text/javascript");
	        script.src = src;
	        document.body.appendChild(script);
	        script.onload = script.onreadystatechange = function(){
	        	success();
				if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
	        		document.body.removeChild(script);
				}
			};
		},
		
		getParameters: function(fileNames){
			var sc = document.getElementsByTagName('script');
		    var paramsArray;
		    try{
			   var scLen = sc.length;
			   for(var j = 0; j < scLen; j ++){
			   		var srcPathArray = sc[j].src.split('?');
			   		var jsPath = srcPathArray[0];
			   		var jsPathArray = jsPath.split('/');
			   		if(jsPathArray.length == 1)
			   		{
			   			jsPath = jsPathArray[0];
			   		}else{
			   			jsPath = jsPathArray[jsPathArray.length - 1];
			   		}
			   		if(jsPath == fileNames[0] || jsPath == fileNames[1])
			   		{
			   			if(srcPathArray.length > 1){
			   				paramsArray = srcPathArray[1].split('&');
			   			}else{
			   				paramsArray = [];
			   			}
			   			SewiseCut.script = sc[j];
			   			
			   			//获取js文件的相对路径
			   			if(jsPath == fileNames[1]){
				   			var lastIndex = srcPathArray[0].lastIndexOf("/");
				   			if(lastIndex > 0) SewiseCut.localPath = srcPathArray[0].slice(0, lastIndex + 1);
				   		}
			   			/////////////////////
			   			break;
			   		}
			   }
			   var args = {}, argsStr = [], param, t, name, value;
			   for(var i = 0, len = paramsArray.length; i < len; i++){
			   		param = paramsArray[i].split('=');
			      	name = param[0];
			      	value=param[1];
			       	if(typeof args[name] == "undefined"){
			        	args[name] = value;
			        }else if(typeof args[name] == "string"){
		                args[name] = [args[name]];
		                args[name].push(value);
		            }else{
		                args[name].push(value);
		            }
			    }
			    return args;
		    }catch(e){
		    	return [];
		    }
		},
		
		object: {
			isEmpty: function(obj){
			    for (var name in obj){
			        return false;
			    }
			    return true;
			}
		},
		
		browser: {
			versions: function(){
	           	var u = navigator.userAgent, app = navigator.appVersion; 
	           	return {
	           				trident: u.indexOf('Trident') > -1, 										//IE内核
			                presto: u.indexOf('Presto') > -1, 											//opera内核
			                webKit: u.indexOf('AppleWebKit') > -1,										//苹果、谷歌内核
			                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, 				//火狐内核
			                mobile: !!u.match(/AppleWebKit.*Mobile.*/),									//是否为移动终端
			                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),							//ios终端
			                android: u.indexOf('Android') > -1,											//android终端
			                iPhone: u.indexOf('iPhone') > -1,											//是否为iPhone
			                iPad: u.indexOf('iPad') > -1,												//是否iPad
			            	webApp: u.indexOf('Safari') == -1											//是否web应该程序，没有头部与底部
		            	};
	 		}(),
	 		supportH5: function(){																		//是否支持HTML5特性
	 			var isH5 = false;
	 			if(navigator.geolocation){
	 				isH5 = true;
	 			}
	 			return isH5;
	 		}(),
	 		supportFlash: function(){																	//是否支持Flash特性
	 			if(navigator.mimeTypes.length > 0){
	                var flashAct = navigator.mimeTypes["application/x-shockwave-flash"];
	                return flashAct !== undefined ? flashAct.enabledPlugin !== undefined : false;
	            }else if(self.ActiveXObject){
	                try{
	                    new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
	                    return true;
	                }catch(oError){
	                    return false;
	                }
	            }
	 		}(),
	 		language: (navigator.browserLanguage || navigator.language).toLowerCase()
		},
		
		location: {
			hostname: function(url){
				if(url){
					var a = document.createElement('a');
            		a.href = url;
            		return a.hostname;
				}else{
					return window.location.hostname;
				}
			},
			port: function(url){
				if(url){
					var a = document.createElement('a');
            		a.href = url;
            		return a.port;
				}else{
	            	return window.location.port;
	            }
			},
			porthost: function(url){
				var hostname;
				var port;
				if(url){
					var a = document.createElement('a');
            		a.href = url;
            		hostname = a.hostname;
            		port = a.port;
				}else{
					hostname = window.location.hostname;
		            port = window.location.port;
		        }
	            var porthost = hostname;
	            if(port && port !== "") porthost = hostname + ":" + port;
	            return porthost;
			}
		},
		
		loader: {
			loadCssFile:function(url, loaderror){
				var css = document.createElement('link');
				css.rel = 'stylesheet';
				css.href = url;
				if(loaderror){
	           		css.onerror = function(){
	                	loaderror();
	                };
                }
                document.getElementsByTagName('head')[0].appendChild(css);
			},
			loadJsFile: function(winObj, url, callback, loaderror, winObj2){
	            var nodeHead = document.getElementsByTagName('head')[0];
	            var nodeScript = null;
	            if((!winObj && !winObj2) || winObj == "override"){
	                //console.log("no lib");
	                nodeScript = document.createElement('script');
	                nodeScript.type = 'text/javascript';
	                nodeScript.charset = 'utf-8';
	                nodeScript.src = url;
	                if(callback){
	                    nodeScript.onload = nodeScript.onreadystatechange = function(){
	                        if(nodeScript.ready){
	                            return false;
	                        }
	                        if(!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete'){
	                            nodeScript.ready = true;
	                            callback();
	                        }
	                    };
	                }
	                if(loaderror){
		           		nodeScript.onerror = function(){
		                	loaderror();
		                };
	                }
	                nodeHead.appendChild(nodeScript);
	            }else{
	                //console.log("have lib");
	                if(callback){
	                    callback();
	                }
	            }
	        }
	        
	        
		}

		

	};
})();