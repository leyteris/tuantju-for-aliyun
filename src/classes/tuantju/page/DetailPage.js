_package("tuantju.page");

_import("caf.ui.Page");
_import("caf.mui.ScrollView");

_class("DetailPage", Page, function(){
	
	this._init = function(){
		_super._init.call(this);
    	this._scrollview = null;
	};
	
	this.create = function(parent){
		var obj = this.createTplElement(parent, "detail.xml");
		this.init(obj);
		return obj;
	};
	
	var _roundFix = function (number,fractionDigits){  
		return Math.round(number * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);   
	} 
	
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
        this._scrollview = new ScrollView();
    	this._scrollview.bind($E("detail-deal-content-wrapper"), {
			"parent": this,
			"id"    : "detailScroll"
		});
		this.addListener(this._scrollview, "scrollEnd", this._scrollview, "onDefaultScrollEnd");
	};
    
    this.reset = function(params){

		this.type = params.type;
		if(this.type == 'home'){
			this.cid = params.cid;
		}else if(this.type == 'search'){
			this.search = params.search;
		}
		this.data = params.data;
		
		this.getData(params);

	};
	
	this.pageClear = function(){
        this._scrollview.scrollTo(0);
		$('#detail-deal-content').empty();
		$('#detail .loading').show();
		$('#detail-deal-content-wrapper').hide();
	};
	
	this.dispose = function(){
		_super.dispose.apply(this);
		this._scrollview.dispose();
		this._scrollview = null;
	};
	
	this.getData = function(params){
		var dealId = params.id;
		if(CloudAPI.Device.DeviceStateInfo.isNetworkAvailable() !== "true"){
		  	
			var param = {
		  		'title': '系统提示', 
		    	'msg'  : '网络不可用，是否检查网络？' 
		  	}; 
		   	this._app.dlgInvoke('confirm_detail', this._app, param, this, function(dlg, act){
				if(act === 'dlg_ok'){
					CloudAPI.Device.DeviceStateInfo.wirelessSetting();
				}
			});
			return;
		}
		
		var _this = this,
		method = 'GET',
		setting = {},
		url = 'http://api.tuan800.com/mobile_api/android/get_deal_more_v2/' + dealId;
	  	
		_this._app.netInvoke(method, url, setting, 'json', _this, function(obj) {
			
			obj.data = this.data;
			
			var resultTmpl = '<div class="detail-layout ms-yh">' +
							'<div class="detail-deal-header">'+
								'<div class="detail-tag" _action="link_to" data-url="${dealUrl}"><span class="price-now"><span class="fd-cny">&yen;</span>${data.price}</span><a class="buy-now" >抢购</a></div>' +
								'<div class="detail-green-block"><span class="price-src">原价：<span class="fd-cny">&yen;</span>${data.value}</span></div>' +
							'</div>'+
							'<a class="detail-deal-img-block" _action="link_to" data-url="${dealUrl}">' +
								'<img src="${imgUrlNormal}" class="detail-deal-img">' +
								'<div class="detail-discount">${data.discount}</div>' +
							'</a>' +
							'<div class="detail-deal-footer">'+
								'<span class="detail-time">${leftTime}</span>' +
								'<span class="detail-members">已有${soldCount}人购买</span>' +
							'</div>'+
							'<div class="detail-deal-content">' +
								'<div class="content">{{if shangquanName}}【${shangquanName}】{{/if}} ${data.name}</div>' +
								'<div class="tip"><h2 class="tip-header">团购小贴士</h2><div class="tip-content">${notice}</div></div>' +
								'{{if shops && shops.length != 0}}' +
									'<div class="deal-detail"><h2 class="deal-detail-header">商家信息</h2>' +
										'{{each(i, item) shops}}<div class="detail-item">' + 
											'<h4>${item.name}</h4>' +
											'{{if item.address}}<p>商家地址：${item.address}</p> {{/if}}' +
											'{{if item.tel}}<p>商家电话：${item.tel}</p> {{/if}}' +
										'</div>{{/each}}' +
									'</div>' +
								'{{/if}}' +
							'</div>' +
						'</div>';
			
			obj.leftTime = this.getTimeLeft(obj.data.closeTime);
			obj.notice = (!!obj.notice && obj.notice !== ' ') ? obj.notice : '无';
			result = $.tmpl(resultTmpl, obj)
			$('#detail-deal-content').html(result);
			this.initActionElements(this._self, this, ['div']);
			$('#detail .loading').hide();
			$('#detail-deal-content-wrapper').fadeIn();

		});
	}
	this.pageClear = function(){
		//this._scrollview.dispose();
		//this._scrollview = null;
		//$('#detail').find('.scroller').css('top', '0px');
        this._scrollview.setTop(0);
		$('#detail-deal-content').empty();
		$('#detail-deal-content-wrapper').hide();
		$('#detail .loading').show();
	};
	
	this.do_go_back = function(act,sender){
		this.pageClear();
		if(this.type == 'home'){
			this._app.navPage('home', {type : 'detail'});
		}else if(this.type == 'search'){
			this._app.navPage('search', {type : 'detail'});
		}
	};
	
	this.do_link_to = function(act,sender){
		var param = {
			'title': '系统提示', 
		    'msg'  : '正要跳转到外部网址<br>是否继续？' 
		}; 
		this._app.dlgInvoke('confirm_detail', this._app, param, this, function(dlg, act){
			if(act === 'dlg_ok'){
				var _url = $(sender).data('url');
				CloudAPI.Utility.openBrowser(_url);
			}
		});
		
	};
	
	this.getTimeLeft = function (closeTime) {
	    if (!closeTime) {
	        return "";
	    }
	    closeTime = new Date(Date.parse(closeTime.replace(/-/g, "/")));
	    var currentTime = new Date(),
	            interval = closeTime.getTime() - currentTime.getTime();
	    if (interval < 0) {
	        return "团购已过期";
	    }
	    var minute = Math.round(interval / 60000),
	            _m = minute % 60,
	            hour = (minute - _m) / 60,
	            _h = hour % 24,
	            _d = (hour - _h) / 24;
	    if (_d == 0 && _h != 0) return timeleft = "剩余" + _h + "小时" + _m + "分钟";
	    if (_d == 0 && _h == 0) return timeleft = "剩余" + _m + "分钟";
	    return timeleft = "剩余" + _d + "天" + _h + "小时" + _m + "分钟";
	};

});