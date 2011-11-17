_package("tuantju.page");

_import("caf.ui.Page");
_import("caf.mui.ScrollView");

_class("SearchPage", Page, function(){
	this._init = function(){
		_super._init.call(this);
    this._scrollview = null;
	};
	
	this.create = function(parent){
		var obj = this.createTplElement(parent, "search.xml");
		this.init(obj);
		return obj;
	};
	
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
	};
	
	this.reset = function(params){
		
		if(params.type == 'detail'){
			return;
		}
		this.getData(params);
		
		this._scrollview = new ScrollView();
		this._scrollview.bind($E("search-content-wrapper"), {
			"parent": this,
			"id"    : "searchScroll"
		});
		this.addListener(this._scrollview, "scrollEnd", this._scrollview, "onDefaultScrollEnd");
	};
	
	this.dispose = function(){
		_super.dispose.apply(this);
		this._scrollview.dispose();
		this._scrollview = null;
	};
	
	this.getData = function(params){
		var _keywords = params.keywords;
		
		if(CloudAPI.Device.DeviceStateInfo.isNetworkAvailable() !== "true"){  
		  	
			var param = {
		  		'title': '系统提示', 
		    	'msg'  : '网络不可用，是否检查网络？' 
		  	}; 
		   	this._app.dlgInvoke('confirm_search', this._app, param, this, function(dlg, act){
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
		
		var _this = this,
		method = 'GET',
		setting = {
			city: window.localStorage.getItem("tuantju_now_city_name"),
			keywords : _keywords
		},
		url = 'http://api.tuan138.com/api/search';
	  	
		_this._app.netInvoke(method, url, setting, 'json', _this, function(obj) {

			var result = '';
			if(obj.length === 0){
				$('#search-list').html('<li class="empty">抱歉，没有找到与“' + _keywords + '”相关的团购！</li>');
				$('#search .loading').hide();
				$('#search-content-wrapper').fadeIn();
				return;
			}
			
			for(var i = 0; i < obj.length; ++i){
				
				var firstClass = (i === 0) ? 'first-item' : '';
				result += '<li class="list-item clr ' + firstClass +' ms-yh" _action="goto_detail" data-dealid = "'+obj[i].id+'">' +
								'<a class="deal-img-block">' +
									'<img src="'+obj[i].image+'" class="deal-img">' +
								'</a>' +
								'<div class="deal-content">' +
									'<div class="price-line"><span class="price-now"><span class="fd-cny">&yen;</span>' +obj[i].team_price+'</span><span class="price-src"><span class="fd-cny">&yen;</span>'+obj[i].market_price+'</span></div>' +
									'<div class="content">'+cut(obj[i].title,45)+'</div>' +
									'<div class="sitename">'+obj[i].site_name+'</div>' +
								'</div>' +
							  '</li>';
			}
			
			$('#search-list').html(result);
			$('#search .loading').hide();
			$('#search-content-wrapper').fadeIn();
			
			this.initActionElements(this._self, this, ['li']);
		});
	}
	
	this.pageClear = function(){
		this._scrollview.dispose();
		this._scrollview = null;
		$('#search').find('.scroller').css('top', '0px');
		$('#search-list').empty();
		$('#search-content-wrapper').hide();
		$('#search .loading').show();
	};
	
	this.do_goto_detail = function(act, sender){
		var dealId = $(sender).data('dealid');
		this._app.navPage('detail', {type:'search',id : dealId});
	};
	
	this.do_go_back = function(act, sender){
		this.pageClear();
		this._app.navPage('welcome');
	}
});