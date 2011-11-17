_package("tuantju.page");

_import("caf.ui.Page");
_import("caf.mui.ScrollView");

_class("CityPage", Page, function(){
	this._init = function(){
		_super._init.call(this);
    	this._scrollview = null;
	};
	
	this.create = function(parent){
		var obj = this.createTplElement(parent, "city.xml");
		this.init(obj);
		return obj;
	};
	
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();

		this._scrollview = new ScrollView();
		this._scrollview.bind($E("city-content-wrapper"), {
			"parent": this,
			"id"    : "cityScroll"
		});
		this.addListener(this._scrollview, "scrollEnd", this._scrollview, "onDefaultScrollEnd");
		
		var city_hot = [
                    {"pinyin":"beijing","name":"\u5317\u4eac","id":"1"},
                    {"pinyin":"shanghai","name":"\u4e0a\u6d77","id":"2"},
                    {"pinyin":"xian","name":"\u897f\u5b89","id":"3"},
                    {"pinyin":"shenzhen","name":"\u6df1\u5733","id":"4"},
                    {"pinyin":"guangzhou","name":"\u5e7f\u5dde","id":"5"},
                    {"pinyin":"tianjin","name":"\u5929\u6d25","id":"7"},
                    {"pinyin":"nanjing","name":"\u5357\u4eac","id":"8"},
                    {"pinyin":"wuhan","name":"\u6b66\u6c49","id":"9"},
                    {"pinyin":"hangzhou","name":"\u676d\u5dde","id":"10"},
                    {"pinyin":"chengdu","name":"\u6210\u90fd","id":"13"},
                    {"pinyin":"changsha","name":"\u957f\u6c99","id":"19"},
                    {"pinyin":"zhengzhou","name":"\u90d1\u5dde","id":"25"}
                ];
		var cityItemTmpl = '<li class="city-list-item ms-yh" _action="go_change" data-id="${id}" data-py="${pinyin}">${name}</li>';
		$('#hot-city-list').html($.tmpl(cityItemTmpl, city_hot));
			
		this.initActionElements(this._self, this, ['li']);
			
		$('#city .loading').hide();
		$('#city-content-wrapper').fadeIn();

	};
	
	this.dispose = function(){
		_super.dispose.apply(this);
		this._scrollview.dispose();
		this._scrollview = null;
	};
	
	this.do_go_back = function(act, sender){
		this._scrollview.scrollTo(0);
		this._app.navPage('welcome');
	};
	
	this.do_go_change = function(act, sender){
		var _id = $(sender).data('id');
		var _py = $(sender).data('py');
		var _name = $(sender).text();
		window.localStorage.setItem("tuantju_now_city_id", _id);
		window.localStorage.setItem("tuantju_now_city_name", _name);
		window.localStorage.setItem("tuantju_now_city_py", _py);
		this._app.navPage('welcome');
	};
});