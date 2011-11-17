_package("tuantju.page");

_import("caf.ui.Page");
_import("caf.mui.ScrollView");

_class("HomePage", Page, function(){
	this._init = function(){
		_super._init.call(this);
    	this._scrollview = null;
	};
	
	this.create = function(parent){
		var obj = this.createTplElement(parent, "home.xml");
		this.init(obj);
		return obj;
	};
	
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
        
        var _this = this;
        _this.isRepeat = false;
        _this._scrollview = new ScrollView();
		_this._scrollview.bind($E("home-content-wrapper"), {
			"parent": this,
			"id"    : "homeScroll"
		});
		_this.addListener(this._scrollview, "scrollEnd", this._scrollview, "onDefaultScrollEnd");
		
		_this.addListener(this._scrollview, "scrollEnd", this._scrollview, function(){
			if(($("#home .scroller").height() + parseInt($("#home .scroller").css('top')) < 1500) && !_this.isRepeat){
				_this.isRepeat = true;
				_this.getData(32, false); 
			} 
		}); 
	};
	
	this.reset = function(params){
		var _this = this;

		if(params.type === 'detail'){
			return;
		}
		
		_this.isRepeat = false;
		_this.nowNum = 1;
		_this.catId = params.cid;
		_this.getData(32, true);
		
	};
	
	this.getData = function(pageNum, first){

		//console.log(CloudAPI.Device.DeviceStateInfo.isNetworkAvailable())
		if(CloudAPI.Device.DeviceStateInfo.isNetworkAvailable() !== "true"){  
		  	
			var params = {
		  		'title': '系统提示', 
		    	'msg'  : '网络不可用，是否检查网络？' 
		  	}; 
		   	this._app.dlgInvoke('confirm_home', this._app, params, this, function(dlg, act){
				if(act === 'dlg_ok'){
					CloudAPI.Device.DeviceStateInfo.wirelessSetting();
				}
			});
			return;
		}
		
		var cut = function(str, len, sign) { 
		    sign = sign || '...';
		    if (str.length > len) {
		        return str.substr(0,len-1) + sign;
		    } else {
		        return str;
		    }
		};
		
		if (!first && $('#home-list').find('.loading-item').length === 0 ) {
			$('#home-list').append('<li class="list-item loading-item"><img src="res/images/loader32.gif">加载中...</li>');
		}
		
		var _this = this,
		
		method = 'GET',
		params = {
			page: _this.nowNum,
			cityId: window.localStorage.getItem("tuantju_now_city_id"),
			pageset: pageNum,
			categoryId: _this.catId
		},
		
		url = 'http://api.tuan800.com/mobile_api/android/get_deals_v2';
		_this._app.netInvoke(method, url, params, 'json', _this, function(obj) {
			
			obj = obj.deals;
			
			var itemTmpl = '<li class="list-item {{if firstClass}}${firstClass}{{/if}} clr ms-yh" _action="goto_detail" data-dealid = "${id}">' +
								'<a class="deal-img-block">' +
									'<img src="${imgUrlSmall}" class="deal-img">' +
								'</a>' +
								'<div class="deal-content">' +
									'<div class="price-line"><span class="price-now"><span class="fd-cny">&yen;</span>${price}</span><span class="price-src"><span class="fd-cny">&yen;</span>${value}</span></div>' +
									'<div class="content">${content}</div>' +
									'<div class="sitename">${site.name}</div>' +
								'</div>' +
							  '</li>';
							  
			if(obj.length === 0){
				$('#home-list .loading-item').html('都到底啦！');
				setTimeout(function(){
					$('#home-list .loading-item').remove();
				},3000);
				return;
			} 

			if(first) obj[0].firstClass = 'first-item';
			for(var i = 0; i < obj.length; ++i){
				var content = '';
				if(!!obj[i].shangquanName){
					content = '【' + obj[i].shangquanName + '】 ' + obj[i].name
				}else{
					content = obj[i].name
				}
				obj[i].content = cut(content,40);
			}

			var result = $.tmpl(itemTmpl, obj);

			if(first){
				$('#home-list').html(result);
				$('#home .loading').hide();
				$('#home-content-wrapper').fadeIn();
			}else{
				$('#home-list').append(result);
				$('#home-list .loading-item').remove();
			}
			this.initActionElements(this._self, this, ['li']);
			_this.nowNum += 1;
			_this.isRepeat = false;
		});
	};
	
	this.dispose = function(){
		_super.dispose.apply(this);
		this._scrollview.dispose();
		this._scrollview = null;
	};
	
	this.pageClear = function(){
        this._scrollview.scrollTo(0);
		$('#home-list').empty();
		$('#home-content-wrapper').hide();
		$('#home .loading').show();
	};
	
	this.do_goto_detail = function(act, sender){
		var dealId = $(sender).data('dealid');
		var _data = $(sender).tmplItem().data;
		this._app.navPage('detail', {type:'home',id : dealId, cid:this.catId, data : _data});
	};
	
	this.do_go_back = function(act, sender){
		this.pageClear();
		this._app.navPage('welcome');
	};
});