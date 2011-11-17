_package("tuantju.page");

_import("caf.ui.Page");

_class("WelcomePage", Page, function(){
	this._init = function(){
		_super._init.call(this);
    this._scrollview = null;
	};
	
	this.create = function(parent){
		var obj = this.createTplElement(parent, "welcome.xml");
		this.init(obj);
		return obj;
	};
	
	this.reset = function(params){
		if(!window.localStorage.getItem("tuantju_now_city_name")){
			window.localStorage.setItem("tuantju_now_city_name", '杭州');
			window.localStorage.setItem("tuantju_now_city_id", '10');
			window.localStorage.setItem("tuantju_now_city_py", 'hangzhou');
		}
		var currentCityName = window.localStorage.getItem("tuantju_now_city_name"); 
		$('#change-city em').text(currentCityName);
		$('.search-container input').val('');
	};
	
	this.init = function(){
		_super.init.apply(this, arguments);
		$('#welcome-logo img').attr('src','res/images/wall/' + (Math.floor(Math.random() * 9) + 1) + '.jpg');
		this.initComponents();
		this.initActionElements(this._self, this, ['li']);
		
		setTimeout(function(){
			$('#welcome-logo').animate({left : '-500px'/*, opacity : 0.2*/},350);
			$('#welcome-body').show();
		},3200);
	};
	
	this.dispose = function(){
		_super.dispose.apply(this);
	};
	
	this.getImages = function(){
		var _this = this;
		$('.cat-item').each(function(index){
			var _$this = $(this);
			var method = 'GET',
				params = {
					city: window.localStorage.getItem("tuantju_now_city_name"),
					num: 1,
					today : 1,
					cat: _$this.data('cid')
				},
				url = 'http://api.tuan138.com/api/getDealList';
			_this._app.netInvoke(method, url, params, 'json', _this, function(obj) {
				_$this.find('img').attr('src',obj[0].image);
			});
		});
	};
	
	this.do_go_home = function(act,sender){
		var _cid = $(sender).data('cid');
		this._app.navPage('home', {cid : _cid});
	};
	
	this.do_go_search = function(act,sender){
		var _input = $(sender).siblings('input');
		var _keywords = _input.val();
		if(_keywords === '')  return;
		var param = {
			'title': '系统提示', 
		    'msg'  : '正要跳转到外部网址<br>是否继续？' 
		}; 
		this._app.dlgInvoke('confirm_search', this._app, param, this, function(dlg, act){
			if(act === 'dlg_ok'){
				_input.val('');
				var _py = window.localStorage.getItem("tuantju_now_city_py");
				var _url = 'http://www.tuan800.com/search?url_city=' + _py + '&query=' + _keywords;
				CloudAPI.Utility.openBrowser(_url);
			}
		});
		//this._app.navPage('search', {keywords : _keywords});
	};
	
	this.do_go_city = function(act, sender){
		this._app.navPage('city');
	};
	
});