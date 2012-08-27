/*!
 * HTML5 Query libray
 * https://github.com/Visolleon/H5Query
 * Author : Wang Yu Xiang
 * Weibo : http://weibo.com/visolleon
 * Blog : http://www.cnblogs.com/visolleon
 * Email : visolleon@gmail.com
 * Date : 2012-08-20
 */
 (function (global){

 	var _Q = function (obj){
		var ele = null;
		if(typeof(obj) == 'string'){
			ele = document.querySelectorAll(obj);
		}
		else{
			ele = [obj];
		}
		return {
			element : ele,

			html : function (html){
				if(this.element && this.element.length > 0){
					if(arguments.length == 1){
						for (var i = 0; i < this.element.length; i++) {
							this.element[i].innerHTML = html;
						};
					}
					else{
						return this.element[0].innerHTML;
					}
				}
			},

			css : function (name, value){
				if(this.element && this.element.length > 0){
					if(arguments.length == 2) {
						this.element[0].style[name] = value;
					}
					else{
						return this.element[0].style[name];
					}
				}
			},

			append : function (object){
				if(this.element && this.element.length > 0){
					for (var i = 0; i < this.element.length; i++) {
						this.element[i].appendChild(object);
					}
				}
			},

			remove : function (object){
				if(this.element && this.element.length > 0){
					for (var i = 0; i < this.element.length; i++) {
						if(this.element[i].parentNode){
							this.element[i].parentNode.removeChild(this.element[i]);
						}
						else{
							document.body.removeChild(this.element[i]);
						}							
					};
				}
			},

			insert : function (param){
				if(this.element && this.element.length > 0){
					for (var i = 0; i < this.element.length; i++) {
						var object = document.createElement(param.type);
						if(param.id) object.id = param.id;
						if(param.class) object.className = param.class;
						if(param.html) object.innerHTML = param.html;
						this.element[i].appendChild(object);
					}
				}
			},

			click : function (fn){
				this.bind('click', fn);
			},

			bind : function(type, fn){
				if(this.element && this.element.length > 0){
					for (var i = 0; i < this.element.length; i++) {
						this.element[i].addEventListener(type, fn);
					}
				}
			},

			attr : function(name, value){
				if(this.element && this.element.length > 0){
					if(arguments.length == 2){
						 this.element[0][name] = value;
					}
					else{
						var attr = this.element[0].attributes[name];
						if(attr){

							return attr.value;
						}
					}
				}
				return null;
			},

			hover : function(on, out){
				this.bind('mouseover', on);
				this.bind('mouseout', out);
			}
		};
	};

	var Extends = {
		Insert : function (param) {
			var object = document.createElement(param.type);
			if(param.id) object.id = param.id;
			if(param.class) object.className = param.class;
			if(param.html) object.innerHTML = param.html;
			if(param.parent) {
				param.parent.append(object);
			}
			else{
				document.body.appendChild(object);
			}
		},
		
		LoadImage : function (url, callback) {
	        var img = new Image();
	        var superarg = arguments;
	        img.onload = function () {
	            if (callback) callback();
	        };
	        img.onerror = function(e){
	        	console.log(e);
	        	superarg.callee(url, callback);
	        };
	        img.src = url;
	    },

	    LoadScript : function (url, callback) {
	    	var superarg = arguments;
	        var script = document.createElement("script")
	        script.type = "text/javascript";
		    document.getElementsByTagName("head")[0].appendChild(script);
	        script.onload = function () {
	            if (callback) callback();
	        };
	        script.onerror = function(e){
	        	console.log('LoadScript error, url : ' + url);
	        	superarg.callee(url, callback);
	        };
	        script.src = url;
	    },

	    LoadCss : function (url, callback) {
			$.ajax({
				url : url,
				success : function(data){
					_Q('head').insert({ type : 'style', html : data });
					if (callback) callback();
				}
			});
	    },

	    ajax : function(p) {
	    	var xhr = new XMLHttpRequest();
	    	if(p.url){
	    		if(p.type && p.type.toUpperCase() == 'POST') {
	    			p.type = 'POST';
	    		}
	    		else{
	    			p.type = 'GET';
	    		}
	    		if(p.async){
	    			p.async = true;
	    		}
	    		else{
	    			p.async = false;
	    		}
	    		xhr.onerror = p.error;
	    		xhr.open(p.type, p.url, p.async);
	    		xhr.onreadystatechange = function () {
	    			if(xhr.readyState === 1){
	    				if(p.beforeSend) {
	    					p.beforeSend();
	    				}
	    			}
	    			else if(xhr.readyState === 4){
	    				if(xhr.status == 200) {
	    					p.success && p.success(xhr.responseText);
	    				}
	    				else{
	    					console.log(p.url, xhr.status);
	    					p.error && p.error( xhr.status, xhr );
	    				}
    					p.complete && p.complete();
	    			}
	    		}
	    		xhr.send( p.data || null );
	    	}
	    	this.abort = function (){
	    		xhr.abort();
	    	};
	    },

	    getJSON : function (url, callback){
	        var rNumber = '_';
	    	var reg = /[\?\&]callback=([_\-a-zA-Z0-9]*)/;
	        if(!reg.test(url)) {
		        for (var i = 0; i < 10; i++) {
		        	rNumber += Math.floor(Math.random() * 10);
		        };
	        	url.indexOf('?') != -1
		        	? url += '&callback=' + rNumber
		        	: url += '?callback=' + rNumber;
		    }
		    else{
		    	var m = reg.exec(url);
		    	if(m && m.length > 1){
		    		rNumber = m[1];
		    	}
		    }

	        var tempcode = 'window.' + rNumber + ' = function (data) { if (callback) callback(eval(data)); }';
	        eval(tempcode);
	        console.log(tempcode);

	        var script = document.createElement("script")
	        script.type = "text/javascript";
		    document.getElementsByTagName("head")[0].appendChild(script);
	        script.onload = function () {
	            
	        };
	        script.onerror = function(e){
	        	console.log('LoadScript error, url : ' + url);
	        };
	        script.src = url;
	    }

	};

	for (var item in Extends) {
		_Q[item] = Extends[item];
	};

	global.H5Query = global.$ = _Q;
})(window);