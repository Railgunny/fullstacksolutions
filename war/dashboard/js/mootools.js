//MooTools, <http://mootools.net>, My Object Oriented (JavaScript) Tools. Copyright (c) 2006-2008 Valerio Proietti, <http://mad4milk.net>, MIT Style License.

var MooTools={'version':'1.2.0','build':''};var Native=function(options){options=options||{};var afterImplement=options.afterImplement||function(){};var generics=options.generics;generics=(generics!==false);var legacy=options.legacy;var initialize=options.initialize;var protect=options.protect;var name=options.name;var object=initialize||legacy;object.constructor=Native;object.$family={name:'native'};if(legacy&&initialize)object.prototype=legacy.prototype;object.prototype.constructor=object;if(name){var family=name.toLowerCase();object.prototype.$family={name:family};Native.typize(object,family);}
var add=function(obj,name,method,force){if(!protect||force||!obj.prototype[name])obj.prototype[name]=method;if(generics)Native.genericize(obj,name,protect);afterImplement.call(obj,name,method);return obj;};object.implement=function(a1,a2,a3){if(typeof a1=='string')return add(this,a1,a2,a3);for(var p in a1)add(this,p,a1[p],a2);return this;};object.alias=function(a1,a2,a3){if(typeof a1=='string'){a1=this.prototype[a1];if(a1)add(this,a2,a1,a3);}else{for(var a in a1)this.alias(a,a1[a],a2);}
return this;};return object;};Native.implement=function(objects,properties){for(var i=0,l=objects.length;i<l;i++)objects[i].implement(properties);};Native.genericize=function(object,property,check){if((!check||!object[property])&&typeof object.prototype[property]=='function')object[property]=function(){var args=Array.prototype.slice.call(arguments);return object.prototype[property].apply(args.shift(),args);};};Native.typize=function(object,family){if(!object.type)object.type=function(item){return($type(item)===family);};};Native.alias=function(objects,a1,a2,a3){for(var i=0,j=objects.length;i<j;i++)objects[i].alias(a1,a2,a3);};(function(objects){for(var name in objects)Native.typize(objects[name],name);})({'boolean':Boolean,'native':Native,'object':Object});(function(objects){for(var name in objects)new Native({name:name,initialize:objects[name],protect:true});})({'String':String,'Function':Function,'Number':Number,'Array':Array,'RegExp':RegExp,'Date':Date});(function(object,methods){for(var i=methods.length;i--;i)Native.genericize(object,methods[i],true);return arguments.callee;})
(Array,['pop','push','reverse','shift','sort','splice','unshift','concat','join','slice','toString','valueOf','indexOf','lastIndexOf'])
(String,['charAt','charCodeAt','concat','indexOf','lastIndexOf','match','replace','search','slice','split','substr','substring','toLowerCase','toUpperCase','valueOf']);function $chk(obj){return!!(obj||obj===0);};function $clear(timer){clearTimeout(timer);clearInterval(timer);return null;};function $defined(obj){return(obj!=undefined);};function $empty(){};function $arguments(i){return function(){return arguments[i];};};function $lambda(value){return(typeof value=='function')?value:function(){return value;};};function $extend(original,extended){for(var key in(extended||{}))original[key]=extended[key];return original;};function $unlink(object){var unlinked;switch($type(object)){case'object':unlinked={};for(var p in object)unlinked[p]=$unlink(object[p]);break;case'hash':unlinked=$unlink(object.getClean());break;case'array':unlinked=[];for(var i=0,l=object.length;i<l;i++)unlinked[i]=$unlink(object[i]);break;default:return object;}
return unlinked;};function $merge(){var mix={};for(var i=0,l=arguments.length;i<l;i++){var object=arguments[i];if($type(object)!='object')continue;for(var key in object){var op=object[key],mp=mix[key];mix[key]=(mp&&$type(op)=='object'&&$type(mp)=='object')?$merge(mp,op):$unlink(op);}}
return mix;};function $pick(){for(var i=0,l=arguments.length;i<l;i++){if(arguments[i]!=undefined)return arguments[i];}
return null;};function $random(min,max){return Math.floor(Math.random()*(max-min+1)+min);};function $splat(obj){var type=$type(obj);return(type)?((type!='array'&&type!='arguments')?[obj]:obj):[];};var $time=Date.now||function(){return new Date().getTime();};function $try(){for(var i=0,l=arguments.length;i<l;i++){try{return arguments[i]();}catch(e){}}
return null;};function $type(obj){if(obj==undefined)return false;if(obj.$family)return(obj.$family.name=='number'&&!isFinite(obj))?false:obj.$family.name;if(obj.nodeName){switch(obj.nodeType){case 1:return'element';case 3:return(/\S/).test(obj.nodeValue)?'textnode':'whitespace';}}else if(typeof obj.length=='number'){if(obj.callee)return'arguments';else if(obj.item)return'collection';}
return typeof obj;};var Hash=new Native({name:'Hash',initialize:function(object){if($type(object)=='hash')object=$unlink(object.getClean());for(var key in object)this[key]=object[key];return this;}});Hash.implement({getLength:function(){var length=0;for(var key in this){if(this.hasOwnProperty(key))length++;}
return length;},forEach:function(fn,bind){for(var key in this){if(this.hasOwnProperty(key))fn.call(bind,this[key],key,this);}},getClean:function(){var clean={};for(var key in this){if(this.hasOwnProperty(key))clean[key]=this[key];}
return clean;}});Hash.alias('forEach','each');function $H(object){return new Hash(object);};Array.implement({forEach:function(fn,bind){for(var i=0,l=this.length;i<l;i++)fn.call(bind,this[i],i,this);}});Array.alias('forEach','each');function $A(iterable){if(iterable.item){var array=[];for(var i=0,l=iterable.length;i<l;i++)array[i]=iterable[i];return array;}
return Array.prototype.slice.call(iterable);};function $each(iterable,fn,bind){var type=$type(iterable);((type=='arguments'||type=='collection'||type=='array')?Array:Hash).each(iterable,fn,bind);};var Browser=new Hash({Engine:{name:'unknown',version:''},Platform:{name:(navigator.platform.match(/mac|win|linux/i)||['other'])[0].toLowerCase()},Features:{xpath:!!(document.evaluate),air:!!(window.runtime)},Plugins:{}});if(window.opera)Browser.Engine={name:'presto',version:(document.getElementsByClassName)?950:925};else if(window.ActiveXObject)Browser.Engine={name:'trident',version:(window.XMLHttpRequest)?5:4};else if(!navigator.taintEnabled)Browser.Engine={name:'webkit',version:(Browser.Features.xpath)?420:419};else if(document.getBoxObjectFor!=null)Browser.Engine={name:'gecko',version:(document.getElementsByClassName)?19:18};Browser.Engine[Browser.Engine.name]=Browser.Engine[Browser.Engine.name+Browser.Engine.version]=true;if(window.orientation!=undefined)Browser.Platform.name='ipod';Browser.Platform[Browser.Platform.name]=true;Browser.Request=function(){return $try(function(){return new XMLHttpRequest();},function(){return new ActiveXObject('MSXML2.XMLHTTP');});};Browser.Features.xhr=!!(Browser.Request());Browser.Plugins.Flash=(function(){var version=($try(function(){return navigator.plugins['Shockwave Flash'].description;},function(){return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');})||'0 r0').match(/\d+/g);return{version:parseInt(version[0]||0+'.'+version[1]||0),build:parseInt(version[2]||0)};})();function $exec(text){if(!text)return text;if(window.execScript){window.execScript(text);}else{var script=document.createElement('script');script.setAttribute('type','text/javascript');script.text=text;document.head.appendChild(script);document.head.removeChild(script);}
return text;};Native.UID=1;var $uid=(Browser.Engine.trident)?function(item){return(item.uid||(item.uid=[Native.UID++]))[0];}:function(item){return item.uid||(item.uid=Native.UID++);};var Window=new Native({name:'Window',legacy:(Browser.Engine.trident)?null:window.Window,initialize:function(win){$uid(win);if(!win.Element){win.Element=$empty;if(Browser.Engine.webkit)win.document.createElement("iframe");win.Element.prototype=(Browser.Engine.webkit)?window["[[DOMElement.prototype]]"]:{};}
return $extend(win,Window.Prototype);},afterImplement:function(property,value){window[property]=Window.Prototype[property]=value;}});Window.Prototype={$family:{name:'window'}};new Window(window);var Document=new Native({name:'Document',legacy:(Browser.Engine.trident)?null:window.Document,initialize:function(doc){$uid(doc);doc.head=doc.getElementsByTagName('head')[0];doc.html=doc.getElementsByTagName('html')[0];doc.window=doc.defaultView||doc.parentWindow;if(Browser.Engine.trident4)$try(function(){doc.execCommand("BackgroundImageCache",false,true);});return $extend(doc,Document.Prototype);},afterImplement:function(property,value){document[property]=Document.Prototype[property]=value;}});Document.Prototype={$family:{name:'document'}};new Document(document);Array.implement({every:function(fn,bind){for(var i=0,l=this.length;i<l;i++){if(!fn.call(bind,this[i],i,this))return false;}
return true;},filter:function(fn,bind){var results=[];for(var i=0,l=this.length;i<l;i++){if(fn.call(bind,this[i],i,this))results.push(this[i]);}
return results;},clean:function(){return this.filter($defined);},indexOf:function(item,from){var len=this.length;for(var i=(from<0)?Math.max(0,len+from):from||0;i<len;i++){if(this[i]===item)return i;}
return-1;},map:function(fn,bind){var results=[];for(var i=0,l=this.length;i<l;i++)results[i]=fn.call(bind,this[i],i,this);return results;},some:function(fn,bind){for(var i=0,l=this.length;i<l;i++){if(fn.call(bind,this[i],i,this))return true;}
return false;},associate:function(keys){var obj={},length=Math.min(this.length,keys.length);for(var i=0;i<length;i++)obj[keys[i]]=this[i];return obj;},link:function(object){var result={};for(var i=0,l=this.length;i<l;i++){for(var key in object){if(object[key](this[i])){result[key]=this[i];delete object[key];break;}}}
return result;},contains:function(item,from){return this.indexOf(item,from)!=-1;},extend:function(array){for(var i=0,j=array.length;i<j;i++)this.push(array[i]);return this;},getLast:function(){return(this.length)?this[this.length-1]:null;},getRandom:function(){return(this.length)?this[$random(0,this.length-1)]:null;},include:function(item){if(!this.contains(item))this.push(item);return this;},combine:function(array){for(var i=0,l=array.length;i<l;i++)this.include(array[i]);return this;},erase:function(item){for(var i=this.length;i--;i){if(this[i]===item)this.splice(i,1);}
return this;},empty:function(){this.length=0;return this;},flatten:function(){var array=[];for(var i=0,l=this.length;i<l;i++){var type=$type(this[i]);if(!type)continue;array=array.concat((type=='array'||type=='collection'||type=='arguments')?Array.flatten(this[i]):this[i]);}
return array;},hexToRgb:function(array){if(this.length!=3)return null;var rgb=this.map(function(value){if(value.length==1)value+=value;return value.toInt(16);});return(array)?rgb:'rgb('+rgb+')';},rgbToHex:function(array){if(this.length<3)return null;if(this.length==4&&this[3]==0&&!array)return'transparent';var hex=[];for(var i=0;i<3;i++){var bit=(this[i]-0).toString(16);hex.push((bit.length==1)?'0'+bit:bit);}
return(array)?hex:'#'+hex.join('');}});Function.implement({extend:function(properties){for(var property in properties)this[property]=properties[property];return this;},create:function(options){var self=this;options=options||{};return function(event){var args=options.arguments;args=(args!=undefined)?$splat(args):Array.slice(arguments,(options.event)?1:0);if(options.event)args=[event||window.event].extend(args);var returns=function(){return self.apply(options.bind||null,args);};if(options.delay)return setTimeout(returns,options.delay);if(options.periodical)return setInterval(returns,options.periodical);if(options.attempt)return $try(returns);return returns();};},pass:function(args,bind){return this.create({arguments:args,bind:bind});},attempt:function(args,bind){return this.create({arguments:args,bind:bind,attempt:true})();},bind:function(bind,args){return this.create({bind:bind,arguments:args});},bindWithEvent:function(bind,args){return this.create({bind:bind,event:true,arguments:args});},delay:function(delay,bind,args){return this.create({delay:delay,bind:bind,arguments:args})();},periodical:function(interval,bind,args){return this.create({periodical:interval,bind:bind,arguments:args})();},run:function(args,bind){return this.apply(bind,$splat(args));}});Number.implement({limit:function(min,max){return Math.min(max,Math.max(min,this));},round:function(precision){precision=Math.pow(10,precision||0);return Math.round(this*precision)/precision;},times:function(fn,bind){for(var i=0;i<this;i++)fn.call(bind,i,this);},toFloat:function(){return parseFloat(this);},toInt:function(base){return parseInt(this,base||10);}});Number.alias('times','each');(function(math){var methods={};math.each(function(name){if(!Number[name])methods[name]=function(){return Math[name].apply(null,[this].concat($A(arguments)));};});Number.implement(methods);})(['abs','acos','asin','atan','atan2','ceil','cos','exp','floor','log','max','min','pow','sin','sqrt','tan']);String.implement({test:function(regex,params){return((typeof regex=='string')?new RegExp(regex,params):regex).test(this);},contains:function(string,separator){return(separator)?(separator+this+separator).indexOf(separator+string+separator)>-1:this.indexOf(string)>-1;},trim:function(){return this.replace(/^\s+|\s+$/g,'');},clean:function(){return this.replace(/\s+/g,' ').trim();},camelCase:function(){return this.replace(/-\D/g,function(match){return match.charAt(1).toUpperCase();});},hyphenate:function(){return this.replace(/[A-Z]/g,function(match){return('-'+match.charAt(0).toLowerCase());});},capitalize:function(){return this.replace(/\b[a-z]/g,function(match){return match.toUpperCase();});},escapeRegExp:function(){return this.replace(/([-.*+?^${}()|[\]\/\\])/g,'\\$1');},toInt:function(base){return parseInt(this,base||10);},toFloat:function(){return parseFloat(this);},hexToRgb:function(array){var hex=this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);return(hex)?hex.slice(1).hexToRgb(array):null;},rgbToHex:function(array){var rgb=this.match(/\d{1,3}/g);return(rgb)?rgb.rgbToHex(array):null;},stripScripts:function(option){var scripts='';var text=this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(){scripts+=arguments[1]+'\n';return'';});if(option===true)$exec(scripts);else if($type(option)=='function')option(scripts,text);return text;},substitute:function(object,regexp){return this.replace(regexp||(/\\?\{([^}]+)\}/g),function(match,name){if(match.charAt(0)=='\\')return match.slice(1);return(object[name]!=undefined)?object[name]:'';});}});Hash.implement({has:Object.prototype.hasOwnProperty,keyOf:function(value){for(var key in this){if(this.hasOwnProperty(key)&&this[key]===value)return key;}
return null;},hasValue:function(value){return(Hash.keyOf(this,value)!==null);},extend:function(properties){Hash.each(properties,function(value,key){Hash.set(this,key,value);},this);return this;},combine:function(properties){Hash.each(properties,function(value,key){Hash.include(this,key,value);},this);return this;},erase:function(key){if(this.hasOwnProperty(key))delete this[key];return this;},get:function(key){return(this.hasOwnProperty(key))?this[key]:null;},set:function(key,value){if(!this[key]||this.hasOwnProperty(key))this[key]=value;return this;},empty:function(){Hash.each(this,function(value,key){delete this[key];},this);return this;},include:function(key,value){var k=this[key];if(k==undefined)this[key]=value;return this;},map:function(fn,bind){var results=new Hash;Hash.each(this,function(value,key){results.set(key,fn.call(bind,value,key,this));},this);return results;},filter:function(fn,bind){var results=new Hash;Hash.each(this,function(value,key){if(fn.call(bind,value,key,this))results.set(key,value);},this);return results;},every:function(fn,bind){for(var key in this){if(this.hasOwnProperty(key)&&!fn.call(bind,this[key],key))return false;}
return true;},some:function(fn,bind){for(var key in this){if(this.hasOwnProperty(key)&&fn.call(bind,this[key],key))return true;}
return false;},getKeys:function(){var keys=[];Hash.each(this,function(value,key){keys.push(key);});return keys;},getValues:function(){var values=[];Hash.each(this,function(value){values.push(value);});return values;},toQueryString:function(base){var queryString=[];Hash.each(this,function(value,key){if(base)key=base+'['+key+']';var result;switch($type(value)){case'object':result=Hash.toQueryString(value,key);break;case'array':var qs={};value.each(function(val,i){qs[i]=val;});result=Hash.toQueryString(qs,key);break;default:result=key+'='+encodeURIComponent(value);}
if(value!=undefined)queryString.push(result);});return queryString.join('&');}});Hash.alias({keyOf:'indexOf',hasValue:'contains'});var Event=new Native({name:'Event',initialize:function(event,win){win=win||window;var doc=win.document;event=event||win.event;if(event.$extended)return event;this.$extended=true;var type=event.type;var target=event.target||event.srcElement;while(target&&target.nodeType==3)target=target.parentNode;if(type.test(/key/)){var code=event.which||event.keyCode;var key=Event.Keys.keyOf(code);if(type=='keydown'){var fKey=code-111;if(fKey>0&&fKey<13)key='f'+fKey;}
key=key||String.fromCharCode(code).toLowerCase();}else if(type.match(/(click|mouse|menu)/i)){doc=(!doc.compatMode||doc.compatMode=='CSS1Compat')?doc.html:doc.body;var page={x:event.pageX||event.clientX+doc.scrollLeft,y:event.pageY||event.clientY+doc.scrollTop};var client={x:(event.pageX)?event.pageX-win.pageXOffset:event.clientX,y:(event.pageY)?event.pageY-win.pageYOffset:event.clientY};if(type.match(/DOMMouseScroll|mousewheel/)){var wheel=(event.wheelDelta)?event.wheelDelta/120:-(event.detail||0)/3;}
var rightClick=(event.which==3)||(event.button==2);var related=null;if(type.match(/over|out/)){switch(type){case'mouseover':related=event.relatedTarget||event.fromElement;break;case'mouseout':related=event.relatedTarget||event.toElement;}
if(!(function(){while(related&&related.nodeType==3)related=related.parentNode;return true;}).create({attempt:Browser.Engine.gecko})())related=false;}}
return $extend(this,{event:event,type:type,page:page,client:client,rightClick:rightClick,wheel:wheel,relatedTarget:related,target:target,code:code,key:key,shift:event.shiftKey,control:event.ctrlKey,alt:event.altKey,meta:event.metaKey});}});Event.Keys=new Hash({'enter':13,'up':38,'down':40,'left':37,'right':39,'esc':27,'space':32,'backspace':8,'tab':9,'delete':46});Event.implement({stop:function(){return this.stopPropagation().preventDefault();},stopPropagation:function(){if(this.event.stopPropagation)this.event.stopPropagation();else this.event.cancelBubble=true;return this;},preventDefault:function(){if(this.event.preventDefault)this.event.preventDefault();else this.event.returnValue=false;return this;}});var Class=new Native({name:'Class',initialize:function(properties){properties=properties||{};var klass=function(empty){for(var key in this)this[key]=$unlink(this[key]);for(var mutator in Class.Mutators){if(!this[mutator])continue;Class.Mutators[mutator](this,this[mutator]);delete this[mutator];}
this.constructor=klass;if(empty===$empty)return this;var self=(this.initialize)?this.initialize.apply(this,arguments):this;if(this.options&&this.options.initialize)this.options.initialize.call(this);return self;};$extend(klass,this);klass.constructor=Class;klass.prototype=properties;return klass;}});Class.implement({implement:function(){Class.Mutators.Implements(this.prototype,Array.slice(arguments));return this;}});Class.Mutators={Implements:function(self,klasses){$splat(klasses).each(function(klass){$extend(self,($type(klass)=='class')?new klass($empty):klass);});},Extends:function(self,klass){var instance=new klass($empty);delete instance.parent;delete instance.parentOf;for(var key in instance){var current=self[key],previous=instance[key];if(current==undefined){self[key]=previous;continue;}
var ctype=$type(current),ptype=$type(previous);if(ctype!=ptype)continue;switch(ctype){case'function':if(!arguments.callee.caller)self[key]=eval('('+String(current).replace(/\bthis\.parent\(\s*(\))?/g,function(full,close){return'arguments.callee._parent_.call(this'+(close||', ');})+')');self[key]._parent_=previous;break;case'object':self[key]=$merge(previous,current);}}
self.parent=function(){return arguments.callee.caller._parent_.apply(this,arguments);};self.parentOf=function(descendant){return descendant._parent_.apply(this,Array.slice(arguments,1));};}};var Chain=new Class({chain:function(){this.$chain=(this.$chain||[]).extend(arguments);return this;},callChain:function(){return(this.$chain&&this.$chain.length)?this.$chain.shift().apply(this,arguments):false;},clearChain:function(){if(this.$chain)this.$chain.empty();return this;}});var Events=new Class({addEvent:function(type,fn,internal){type=Events.removeOn(type);if(fn!=$empty){this.$events=this.$events||{};this.$events[type]=this.$events[type]||[];this.$events[type].include(fn);if(internal)fn.internal=true;}
return this;},addEvents:function(events){for(var type in events)this.addEvent(type,events[type]);return this;},fireEvent:function(type,args,delay){type=Events.removeOn(type);if(!this.$events||!this.$events[type])return this;this.$events[type].each(function(fn){fn.create({'bind':this,'delay':delay,'arguments':args})();},this);return this;},removeEvent:function(type,fn){type=Events.removeOn(type);if(!this.$events||!this.$events[type])return this;if(!fn.internal)this.$events[type].erase(fn);return this;},removeEvents:function(type){for(var e in this.$events){if(type&&type!=e)continue;var fns=this.$events[e];for(var i=fns.length;i--;i)this.removeEvent(e,fns[i]);}
return this;}});Events.removeOn=function(string){return string.replace(/^on([A-Z])/,function(full,first){return first.toLowerCase();});};var Options=new Class({setOptions:function(){this.options=$merge.run([this.options].extend(arguments));if(!this.addEvent)return this;for(var option in this.options){if($type(this.options[option])!='function'||!(/^on[A-Z]/).test(option))continue;this.addEvent(option,this.options[option]);delete this.options[option];}
return this;}});Document.implement({newElement:function(tag,props){if(Browser.Engine.trident&&props){['name','type','checked'].each(function(attribute){if(!props[attribute])return;tag+=' '+attribute+'="'+props[attribute]+'"';if(attribute!='checked')delete props[attribute];});tag='<'+tag+'>';}
return $.element(this.createElement(tag)).set(props);},newTextNode:function(text){return this.createTextNode(text);},getDocument:function(){return this;},getWindow:function(){return this.defaultView||this.parentWindow;},purge:function(){var elements=this.getElementsByTagName('*');for(var i=0,l=elements.length;i<l;i++)Browser.freeMem(elements[i]);}});var Element=new Native({name:'Element',legacy:window.Element,initialize:function(tag,props){var konstructor=Element.Constructors.get(tag);if(konstructor)return konstructor(props);if(typeof tag=='string')return document.newElement(tag,props);return $(tag).set(props);},afterImplement:function(key,value){if(!Array[key])Elements.implement(key,Elements.multi(key));Element.Prototype[key]=value;}});Element.Prototype={$family:{name:'element'}};Element.Constructors=new Hash;var IFrame=new Native({name:'IFrame',generics:false,initialize:function(){var params=Array.link(arguments,{properties:Object.type,iframe:$defined});var props=params.properties||{};var iframe=$(params.iframe)||false;var onload=props.onload||$empty;delete props.onload;props.id=props.name=$pick(props.id,props.name,iframe.id,iframe.name,'IFrame_'+$time());iframe=new Element(iframe||'iframe',props);var onFrameLoad=function(){var host=$try(function(){return iframe.contentWindow.location.host;});if(host&&host==window.location.host){var win=new Window(iframe.contentWindow);var doc=new Document(iframe.contentWindow.document);$extend(win.Element.prototype,Element.Prototype);}
onload.call(iframe.contentWindow,iframe.contentWindow.document);};(!window.frames[props.id])?iframe.addListener('load',onFrameLoad):onFrameLoad();return iframe;}});var Elements=new Native({initialize:function(elements,options){options=$extend({ddup:true,cash:true},options);elements=elements||[];if(options.ddup||options.cash){var uniques={},returned=[];for(var i=0,l=elements.length;i<l;i++){var el=$.element(elements[i],!options.cash);if(options.ddup){if(uniques[el.uid])continue;uniques[el.uid]=true;}
returned.push(el);}
elements=returned;}
return(options.cash)?$extend(elements,this):elements;}});Elements.implement({filter:function(filter,bind){if(!filter)return this;return new Elements(Array.filter(this,(typeof filter=='string')?function(item){return item.match(filter);}:filter,bind));}});Elements.multi=function(property){return function(){var items=[];var elements=true;for(var i=0,j=this.length;i<j;i++){var returns=this[i][property].apply(this[i],arguments);items.push(returns);if(elements)elements=($type(returns)=='element');}
return(elements)?new Elements(items):items;};};Window.implement({$:function(el,nocash){if(el&&el.$family&&el.uid)return el;var type=$type(el);return($[type])?$[type](el,nocash,this.document):null;},$$:function(selector){if(arguments.length==1&&typeof selector=='string')return this.document.getElements(selector);var elements=[];var args=Array.flatten(arguments);for(var i=0,l=args.length;i<l;i++){var item=args[i];switch($type(item)){case'element':item=[item];break;case'string':item=this.document.getElements(item,true);break;default:item=false;}
if(item)elements.extend(item);}
return new Elements(elements);},getDocument:function(){return this.document;},getWindow:function(){return this;}});$.string=function(id,nocash,doc){id=doc.getElementById(id);return(id)?$.element(id,nocash):null;};$.element=function(el,nocash){$uid(el);if(!nocash&&!el.$family&&!(/^object|embed$/i).test(el.tagName)){var proto=Element.Prototype;for(var p in proto)el[p]=proto[p];};return el;};$.object=function(obj,nocash,doc){if(obj.toElement)return $.element(obj.toElement(doc),nocash);return null;};$.textnode=$.whitespace=$.window=$.document=$arguments(0);Native.implement([Element,Document],{getElement:function(selector,nocash){return $(this.getElements(selector,true)[0]||null,nocash);},getElements:function(tags,nocash){tags=tags.split(',');var elements=[];var ddup=(tags.length>1);tags.each(function(tag){var partial=this.getElementsByTagName(tag.trim());(ddup)?elements.extend(partial):elements=partial;},this);return new Elements(elements,{ddup:ddup,cash:!nocash});}});Element.Storage={get:function(uid){return(this[uid]||(this[uid]={}));}};Element.Inserters=new Hash({before:function(context,element){if(element.parentNode)element.parentNode.insertBefore(context,element);},after:function(context,element){if(!element.parentNode)return;var next=element.nextSibling;(next)?element.parentNode.insertBefore(context,next):element.parentNode.appendChild(context);},bottom:function(context,element){element.appendChild(context);},top:function(context,element){var first=element.firstChild;(first)?element.insertBefore(context,first):element.appendChild(context);}});Element.Inserters.inside=Element.Inserters.bottom;Element.Inserters.each(function(value,key){var Key=key.capitalize();Element.implement('inject'+Key,function(el){value(this,$(el,true));return this;});Element.implement('grab'+Key,function(el){value($(el,true),this);return this;});});Element.implement({getDocument:function(){return this.ownerDocument;},getWindow:function(){return this.ownerDocument.getWindow();},getElementById:function(id,nocash){var el=this.ownerDocument.getElementById(id);if(!el)return null;for(var parent=el.parentNode;parent!=this;parent=parent.parentNode){if(!parent)return null;}
return $.element(el,nocash);},set:function(prop,value){switch($type(prop)){case'object':for(var p in prop)this.set(p,prop[p]);break;case'string':var property=Element.Properties.get(prop);(property&&property.set)?property.set.apply(this,Array.slice(arguments,1)):this.setProperty(prop,value);}
return this;},get:function(prop){var property=Element.Properties.get(prop);return(property&&property.get)?property.get.apply(this,Array.slice(arguments,1)):this.getProperty(prop);},erase:function(prop){var property=Element.Properties.get(prop);(property&&property.erase)?property.erase.apply(this,Array.slice(arguments,1)):this.removeProperty(prop);return this;},m