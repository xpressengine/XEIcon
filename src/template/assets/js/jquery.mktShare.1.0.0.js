(function($){

	if(typeof $ === "undefined"){
		alert("jQuery 객체가 존재하지 않습니다.");
		return false;
	}

	if(typeof $.mktShare !== "undefined"){
		alert("동일한 이름의 플러그인이 이미 존재합니다.");
		return false;
	}

	$.mktShare = {

		_bInit : false,
		bAndroid : (navigator.userAgent.indexOf("Android") > -1),
		bIOS : ((navigator.userAgent.indexOf("iPhone") > -1) || (navigator.userAgent.indexOf("iPad") > -1)),
		isMobile : function(){
			return this.bAndroid || this.bIOS;
		},
		sMobileErrorMessage : "모바일 환경이 아닙니다.",
		sInitErrorMessage : "플러그인이 초기화되지 않았습니다.",
		sCommonMessage : null,
		sUrl : null,
		sCafeBlogOpenWindowName : "NAVER_SCRAP",
		_elCafeBlogOpenWindow : null,
		oOptions : {

			shortUrl : null,
			twitter : null,
			band : null,
			line : null,
			kakaoTalk : null,
			kakaoStory : null,
			kakaoStoryDomain : document.domain,
			kakaoStoryTitle : document.title,
			cafeBlog : null,
			cafeBlogImageUrl : $('meta[property="og:image"]').attr('content'),
			cafeBlogSourceTitle : document.title,
			cafeBlogSourceUrl : "http://" + document.domain

		},

		init : function(sMessage, sUrl, oOptions){

			this.sCommonMessage = sMessage;
			this.sUrl = sUrl;
			$.extend(this.oOptions,oOptions);

			this._appendCafeBlogForm(sUrl);

			this._bInit = true;

		},

		_appendCafeBlogForm : function(sUrl){

			if(this.isMobile()){

				document.write("<form name='JScrapForm' id='JScrapForm' method='post' accept-charset='utf-8' target='_self'>");
				document.write("<input type='hidden' name='blogId' id='cafe_blog_blogId' value='naver'>");
				document.write("<input type='hidden' name='source_type' id='cafe_blog_source_type' value='112'>");
				document.write("<input type='hidden' name='source_title' id='cafe_blog_source_title'>");
				document.write("<input type='hidden' name='source_url' id='cafe_blog_source_url'>");
				document.write("<input type='hidden' name='title' id='cafe_blog_title'>");
				document.write("<input type='hidden' name='source_contents' id='cafe_blog_source_contents'>");
				document.write("<input type='hidden' name='callbackUrl' id='cafe_blog_callbackUrl' value=''>");
				document.write("<input type='hidden' name='callbackEncoding' id='cafe_blog_callbackEncoding' value='false'>");
				document.write("<input type='hidden' name='returnUrl' id='cafe_blog_returnUrl' value='" + encodeURIComponent(sUrl) + "'>");
				document.write("</form>");

			}else{

				document.write("<form name='JScrapForm' id='JScrapForm' method='post' accept-charset='euc-kr'>");
				document.write("<input type='hidden' name='blogId' id='cafe_blog_title_blogId' value='naver'>");
				document.write("<input type='hidden' name='source_type' id='cafe_blog_source_type' value='66'>");
				document.write("<input type='hidden' name='source_title' id='cafe_blog_source_title'>");
				document.write("<input type='hidden' name='source_url' id='cafe_blog_source_url'>");
				document.write("<input type='hidden' name='title' id='cafe_blog_title'>");
				document.write("<input type='hidden' name='source_contents' id='cafe_blog_source_contents'>");
				document.write("<input type='hidden' name='callbackUrl' id='cafe_blog_callbackUrl' value=''>");
				document.write("<input type='hidden' name='callbackEncoding' id='cafe_blog_callbackEncoding' value='false'>");
				document.write("</form>");

			}

		},

		_getShortUrl : function(){

			if(this.oOptions.shortUrl !== null){
				return this.oOptions.shortUrl;
			}else{
				return this.sUrl;
			}

		},

		_getMessage : function(sType){

			if(this.oOptions[sType] !== null){
				return this.oOptions[sType];
			}else{
				return this.sCommonMessage;
			}

		},

		_replaceXssString : function(sEncodedString){
			return sEncodedString.replace(/&quot;/gi, '"').replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
		},

		_isAndroidChrome25VersionOver : function(){

			var bChrome = (navigator.userAgent.indexOf("Chrome/") > -1);

			if(this.bAndroid && bChrome){
         
		        var sUaInfo = navigator.userAgent.match(/Chrome\/[0-9]*/g)[0];
		        var aUaInfo = sUaInfo.split("/");
		        if( aUaInfo[1] >= 25 ){
		            return true;
		        };
		    }

		    return false;

		},

		_makeIframe : function(sIframeId, sSource){

			var elIframeItem = document.getElementById(sIframeId);
		    if (elIframeItem != null) {
		        elIframeItem.parentNode.removeChild(elIframeItem);
		    }
		    elIframeItem = document.createElement("iframe");
		    elIframeItem.id = sIframeId;
		    elIframeItem.style.border = "none";
		    elIframeItem.style.width = "0px";
		    elIframeItem.style.height = "0px";
		    elIframeItem.style.display = "none";
		    elIframeItem.src = sSource;
		    return elIframeItem;

		},

		_sendMarketAfter1500ms : function(sIosUrl,sAndroidUrl){

			var oSelf = this;
   			var oBeforeTime = new Date();
    		setTimeout(function() {
        		if (new Date() - oBeforeTime < 2000) {
            		if (oSelf.bIOS) {
               	 		window.location.replace(sIosUrl);
           			} else if(oSelf.bAndroid) {
             		   	window.location.replace(sAndroidUrl);
                	}
        		}
    		},1500);
    		
		},

		_sendApp : function(sMessage,sIosUrl,sAndroidPakace,sIframeId){

			if(this._isAndroidChrome25VersionOver()){

				location.href = "intent:" + sMessage + "#Intent;package="+ sAndroidPakace +";end;";

			}else{

				this._sendMarketAfter1500ms(sIosUrl, "market://details?id=" + sAndroidPakace);
				document.body.appendChild(this._makeIframe(sIframeId, sMessage));

			}

		},

		_setNaverScrapInputData : function(){

			$("#cafe_blog_source_title").val(this.oOptions.cafeBlogSourceTitle);
    	    $("#cafe_blog_source_url").val(this.oOptions.cafeBlogSourceUrl);

    	    if(this.isMobile()){
    	    	$("#cafe_blog_title").val(this._replaceXssString(this._getMessage("cafeBlog")));	
    	    }else{
    	    	$("#cafe_blog_title").val(this._getMessage("cafeBlog"));	
    	    }
    	    

    	    var sContents = '<div class="layer2">';
			sContents += '<a href="'+ this.sUrl +'" class="s_more"><img src="'+ this.oOptions.cafeBlogImageUrl +'" ></a>';
			sContents += '</div>';
			$("#cafe_blog_source_contents").val(sContents);

		},

		_scrapNaverForPC : function(sType){
			
			// blog&cafe PC API는 euc-kr 기반
			document.charset = 'euc-kr';

			if(this._elCafeBlogOpenWindow !== null){
				this._elCafeBlogOpenWindow.close();
				this._elCafeBlogOpenWindow = null;
			}

    	    this._setNaverScrapInputData();

    	    var scrapForm$ = jQuery("#JScrapForm");

			if(sType == "cafe"){
				scrapForm$.attr("action","http://cafe.naver.com/CafeScrapView.nhn");
			}else if(sType == "blog"){
				scrapForm$.attr("action","http://blog.naver.com/ScrapForm.nhn");
			}else{
				// do noting
			}

			this._elCafeBlogOpenWindow = window.open("about:blank",this.sCafeBlogOpenWindowName,"width=400, height=290");
			scrapForm$.attr("target",this.sCafeBlogOpenWindowName);

			if( this._elCafeBlogOpenWindow !== null ){
				scrapForm$.submit();
			}else{
				setTimeout(function(){
					scrapForm$.submit();
				},500);
			}
			
			document.charset = 'utf-8';

		},

		_scrapNaverForMobile : function(sType){

			this._setNaverScrapInputData();

			var scrapForm$ = jQuery("#JScrapForm");

			if(sType == "cafe"){
				scrapForm$.attr("action","http://m.cafe.naver.com/CafeScrapView.nhn");
			}else if(sType == "blog"){
				scrapForm$.attr("action","http://m.blog.naver.com/OpenScrapForm.nhn");
			}else{
				// do noting
			}

			scrapForm$.submit();

		},

		facebook : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			var sTargetUrl = this.sUrl;

			var sEncodedUrl = encodeURIComponent(sTargetUrl);

			if(this.isMobile()){

				var sMobileFacebookUrl = "https://m.facebook.com/sharer.php?u="+sEncodedUrl;
				location.href = sMobileFacebookUrl;

			}else{

				var nTop = ($(window).height() - 400) / 2;
				var nLeft = ($(window).width() - 555) / 2;
	
				var sPcFacebookUrl = "http://www.facebook.com/sharer.php?u="+sEncodedUrl;
				window.open(sPcFacebookUrl, "SHARE_FACEBOOK","width=555, height=400"+",top="+ nTop +",left=" + nLeft);

			}

		},

		twitter : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			var sMessage = this._getMessage("twitter");
			var sUrl = this._getShortUrl();

			var sEncodedMessage = this._replaceXssString(encodeURIComponent(sMessage + "  " + sUrl));

			if(this.isMobile()){

				var sMobileTwitterURL = "http://twitter.com/intent/tweet?text=" + sEncodedMessage;	
				location.href = sMobileTwitterURL;

			}else{

				var nTop = ($(window).height() - 440) / 2;
				var nLeft = ($(window).width() - 560) / 2;
	
				var sPcTwitterURL = "http://twitter.com/home?status=" + sEncodedMessage;	
				window.open(sPcTwitterURL, "SHARE_TWITTER", "width=560, height=440"+",top="+ nTop +",left=" + nLeft);

			}

		},

		line : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			if(this.isMobile() == false){
				alert(this.sMobileErrorMessage);
				return false;
			}

			var sMessage = this._getMessage("line") + "\n\n" + this._getShortUrl();
			var sEncodedMessage = this._replaceXssString(encodeURIComponent(sMessage));
			var sLineUrl = "line://msg/text/" + sEncodedMessage;

			//_sendApp : function(sMessage,sIosUrl,sAndroidPakace,sIframeId)
			this._sendApp(sLineUrl,"https://itunes.apple.com/kr/app/line/id443904275","jp.naver.line.android","_shareLineIframe");

		},

		band : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			var sMessage = this._getMessage("band") + "\n\n" + this._getShortUrl();
			var sEncodedMessage = this._replaceXssString(encodeURIComponent(sMessage));

			if(this.isMobile()){

				var sBandUrl = "bandapp://create/post?text=" + sEncodedMessage;

				//_sendApp : function(sMessage,sIosUrl,sAndroidPakace,sIframeId)
				this._sendApp(sBandUrl,"http://itunes.apple.com/kr/app/id542613198","com.nhn.android.band","_shareBandIframe");
	
			}else{

				var nTop = ($(window).height() - 533) / 2;
				var nLeft = ($(window).width() - 418) / 2;

				window.open("http://www.band.us/plugin/share?body="+sEncodedMessage, "SHARE_BAND", "width=418, height=533, resizable=no"+",top="+ nTop +",left=" + nLeft);

			}

		},

		kakaoTalk : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			if(this.isMobile() == false){
				alert(this.sMobileErrorMessage);
				return false;
			}

			var sUrl = this._getShortUrl();
			var sMessage = this._getMessage("kakaoTalk") + "\n\n" + sUrl;
			

			// NAVER 소셜플러그인 공용키
			var sAppKey = "a75401c7bab624021c9af4778bf81cfd";

			var aKakao = [
				{
					objtype : "label",
					text : sMessage
				},
				{
					objtype : "button",
					text : "네이버앱으로 열기",
					action : {

						type : "app",
						actioninfo : [
							{
								os: "android",
								execparam: "url=" + encodeURIComponent(sUrl)
							},
							{
								os: "ios",
								devicetype: "phone",
								execparam: "url=" + encodeURIComponent(sUrl)
							},
							{
								os: "ios",
								devicetype: "pad",
								execparam: "url=" + encodeURIComponent(sUrl)
							}
						]

					}
				}
			];

			var sKakaoTalkUrl = "kakaolink://send?appkey=" + sAppKey + "&appver=1.0&apiver=3.0&linkver=3.5&objs=" + encodeURIComponent(JSON.stringify(aKakao));

			//_sendApp : function(sMessage,sIosUrl,sAndroidPakace,sIframeId)
			this._sendApp(sKakaoTalkUrl,"http://itunes.apple.com/app/id362057947","com.kakao.talk","_shareKakaoTalkIframe");

		},

		kakaoStory : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			if(this.isMobile()){

				var sMessage = this._getMessage("kakaoStory") + "\n\n" + this._getShortUrl();
				var sEncodedMessage = this._replaceXssString(encodeURIComponent(sMessage));

				// storylink://posting?post=  &appid=  &appver=  &apiver=  &appname=  &urlinfo= 
				var sKakaoStoryUrl = "storylink://posting?post="+sEncodedMessage+"&appid="+this.oOptions.kakaoStoryDomain+"&appver=1.0&apiver=1.0&appname="+encodeURIComponent(this.oOptions.kakaoStoryTitle);
				
				//_sendApp : function(sMessage,sIosUrl,sAndroidPakace,sIframeId)
				this._sendApp(sKakaoStoryUrl,"http://itunes.apple.com/app/id486244601","com.kakao.story","_shareKakaoStoryIframe");							
	
			}else{

				alert(this.sMobileErrorMessage);
				return false;

				/* 

				// 카카오스토리 비공식 API로 카카오측의 별도의 공지없이 변경될 수 있기에 사용을 권장하지 않음.
				// 공식적인 방법으로 사용하려면 https://developers.kakao.com 에서 앱 등록 후 사용해야 함.

				var sEncodedMessage = encodeURIComponent(this._getShortUrl());
				
				var nTop = ($(window).height() - 533) / 2;
				var nLeft = ($(window).width() - 418) / 2;

				window.open("https://story.kakao.com/share?url="+sEncodedMessage, "SHARE_BAND", "width=418, height=533, resizable=no"+",top="+ nTop +",left=" + nLeft);
				*/

			}

		},

		naverCafe : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			if(this.isMobile()){
				this._scrapNaverForMobile("cafe");
			}else{
				this._scrapNaverForPC("cafe");
			}

		},

		naverBlog : function(){

			if(this._bInit == false){
				alert(this.sInitErrorMessage);
				return false;
			}

			if(this.isMobile()){
				this._scrapNaverForMobile("blog");
			}else{
				this._scrapNaverForPC("blog");
			}

		}

	};

})(jQuery);