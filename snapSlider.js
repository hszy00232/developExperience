;(function($,win,doc){
	var pluginName = 'snapSlider';
	var pluginId = pluginName + 'Id';
	var instances = {};
	var makeUid = function(){
		return 'u' + Math.random().toString().slice(-6) + (+new Date).toString().slice(-4);
	};
	var isEmptyObject = function(obj){
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	};
	var isBScrollLoaded = false;
	var hasRunLoad = false;
	var callbackQueue = [];
	var loadScript = function(){
    	hasRunLoad = true;
    	if(isBScrollLoaded)return;
		_loader.use('BScroll',function(){
			isBScrollLoaded = true;
			if(callbackQueue.length){
				var callback;
				while(typeof (callback = callbackQueue.shift()) === 'function'){
					callback();
				}
			}
		});
		setTimeout(function(){
			if(!isBScrollLoaded){
				loadScript();
			}
		},6000);
	};
	$.fn[pluginName] = function(options){
		var defaults = {
			classNames: {
				wrap: 'g-slider-snap',
				list: 'g-slider-list',
				item: 'g-slider-list > li',
				dot: 'g-slider-dot',
				active: 'active'
			}
		};
		var config = $.extend(true,defaults,options || {});
		var classSelector = function(name,scope){
			return $('.' + config.classNames[name],scope);
		};
		var captialize = function(str){
			return str.charAt(0).toUpperCase() + str.slice(1);
		};
		var isFn = function(fn){
			return typeof fn === 'function';
		};
		this.each(function(){
			var scope = $(this);
			var slideWrap;
			if(scope.hasClass(config.classNames.wrap)){
				slideWrap = scope;
			}else{
				slideWrap = classSelector('wrap',scope);
			}
			slideWrap.each(function(){
				var wrap = $(this);
				var list = classSelector('list',wrap);
				var items = classSelector('item',wrap);
				var dotBar = classSelector('dot',wrap);
				if(wrap.data(pluginId) || items.length === 0)return;
				var w = items.width();
				var init = function(w){
					if(!w){
						w = items.width();
					}
					items.show().css('width',w + 'px');
					list.css('width',100 * items.length + '%');
					var scroller = new BScroll(wrap[0],{
						scrollX: true,
						scrollY: false,
						snap: true,
						snapSpeed: 400,
						momentum: false,
						bounce: true,
						click: false,
						eventPassthrough: 'vertical'
					});
					var origDestroy = scroller.destroy;
					var uid = makeUid();
					var params = {
						scroller: scroller,
						list: list,
						items: items,
						wrap: wrap,
						dot: dotBar,
						uid: uid  
					};
					var callbacks = [];
					var customEvents = ['beforeScrollStart','scrollCancel','scrollStart','scroll','flick','zoomStart','zoomEnd'];
					wrap.data(pluginId,uid);
					scroller.__uid__ = uid;
					scroller.destroy = function(){
						var uid = this.__uid__;
						var target = instances[uid];
						if(target){
							target.wrap.data(pluginId,null);
							target.list.css('width','');
							delete instances[uid];
						}
						origDestroy.call(this);
					};
					instances[uid] = params;
					if(dotBar.length){
						callbacks.push(function(page){
							var cls = config.classNames.active;
							dotBar.children().eq(page).addClass(cls).siblings('.' + cls).removeClass(cls);
						});
					}
					if(isFn(config.onScrollEnd)){
						callbacks.push(config.onScrollEnd);
					}
					if(isFn(config.initCallBack)){
						config.initCallBack.call(this, scroller);
					}
					scroller.on('scrollEnd',function(){
						var page = this.getCurrentPage().pageX;
						if(callbacks.length){
							var i = 0,total = callbacks.length;
							for(; i < total; i++){
								var fn = callbacks[i];
								fn.call(this,page,params);
							}
						}
					});
					$.each(customEvents,function(i,name){
						var fn = 'on' + captialize(name);
						if(isFn(config[fn])){
							scroller.on(name,config[fn]);
						}
					});
				};
				var callback = function(w){
					if(!hasRunLoad){
						loadScript();
					}
					if(!isBScrollLoaded){
						callbackQueue.push(function(){
							init(w);
						});
					}else{
						init(w);
					}
				};
				if(w === 0){
					setTimeout(function(){
						callback();
					},0);
				}else{
					callback(w);
				}
			});
		});
		return this;
	};
	$(window).on('orientationchange',function(){
		if(!isEmptyObject(instances)){
			setTimeout(function(){
				$.each(instances,function(i,cur){
					var w = cur.wrap.width();
					cur.items.css('width',w + 'px');
					cur.scroller.refresh();
				});
			},200);
		}
	});
	$.fn[pluginName].getInstance = function($ele,all){
		var uid = $ele.data(pluginId);
		return instances[uid] ? (all ? instances[uid] : instances[uid].scroller) : null;
	};
})($,window,document);
