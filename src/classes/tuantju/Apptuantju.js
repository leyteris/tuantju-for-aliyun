_package("tuantju");

_import("caf.core.AppBase");

_class("Apptuantju", AppBase, function(){
	this.__conf__({
		"page": [
			//键(pageid)     模板文件名         类名                 简要说明
			{"pid": "welcome", "tpl": "welcome.xml", "clazz": "WelcomePage"},
			{"pid": "home", "tpl": "home.xml", "clazz": "HomePage"},
			{"pid": "city", "tpl": "city.xml", "clazz": "CityPage"},
			{"pid": "search", "tpl": "search.xml", "clazz": "SearchPage"},
			{"pid": "detail", "tpl": "detail.xml", "clazz": "DetailPage"}
		]
	});
	this._init = function(){
		_super._init.call(this);
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		//注册模板库
		this._template.reg(runtime.getTplData("tuantju.tpl"));
		this._deckPage.create(runtime.getWorkspace(), this, this._history);
		//this._deckPage.setUseAnimate(true);
		this.reset();
	};
	this.reset = function(){
		_super.reset.apply(this, arguments);
		this._deckPage.reset();
		this.navPage("welcome");
	};
	this.dispose = function(){
		_super.dispose.apply(this);
	};
});