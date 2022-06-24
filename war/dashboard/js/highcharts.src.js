
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/** 
 * @license Highcharts JS v2.0.5 (2010-09-17)
 * 
 * (c) 2009-2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

// JSLint options:
/*jslint forin: true */
/*global document, window, navigator, setInterval, clearInterval, location, jQuery, $, $each, $merge, Events, Event, Fx, Request */
	
(function() {

// encapsulated variables
var doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathCeil = math.ceil,
	mathMax = math.max,
	mathMin = math.min,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,	
	
	
	// some variables
	userAgent = navigator.userAgent,
	isIE = /msie/i.test(userAgent) && !win.opera,
	isWebKit = /AppleWebKit/.test(userAgent),
	hasSVG = win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
	colorCounter,
	symbolCounter,
	symbolSizes = {},
	idCounter = 0,
	timeFactor = 1, // 1 = JavaScript time, 1000 = Unix time
	garbageBin,
	defaultOptions,
	dateFormat, // function
	
	
	// some constants for frequently used strings
	UNDEFINED,
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	PREFIX = 'highcharts-',
	VISIBLE = 'visible',
	PX = 'px',
	NONE = 'none',
	M = 'M',
	L = 'L',
	/*
	 * Empirical lowest possible opacities for TRACKER_FILL
	 * IE6: 0.002
	 * IE7: 0.002
	 * IE8: 0.002
	 * IE9: 0.00000000001 (unlimited)
	 * FF: 0.00000000001 (unlimited)
	 * Chrome: 0.000001
	 * Safari: 0.000001
	 * Opera: 0.00000000001 (unlimited)
	 */
	TRACKER_FILL = 'rgba(192,192,192,'+ (hasSVG ? 0.000001 : 0.002) +')', // invisible but clickable
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	
	// time methods, changed based on whether or not UTC is used
	makeTime,
	getMinutes,
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear,
	
	// check for a custom HighchartsAdapter defined prior to this file
	globalAdapter = win.HighchartsAdapter,
	adapter = globalAdapter || {}, 
	
	// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
	// and all the utility functions will be null. In that case they are populated by the 
	// default adapters below.
	each = adapter.each,
	grep = adapter.grep,
	map = adapter.map,
	merge = adapter.merge,
	hyphenate = adapter.hyphenate,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	animate = adapter.animate,
	stop = adapter.stop,
	getAjax = adapter.getAjax,
	
	// lookup over the types and the associated classes
	seriesTypes = {};
	
/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	if (!a) {
		a = {};
	}
	for (var n in b) {
		a[n] = b[n];
	}
	return a;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined (obj) {
	return obj !== UNDEFINED && obj !== null;
}

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 * 
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
function attr(elem, prop, value) {
	var key,
		setAttribute = 'setAttribute',
		ret;
	
	// if the prop is a string
	if (typeof prop == 'string') {
		// set the value
		if (defined(value)) {
			elem[setAttribute](prop, value);
		
		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}
	
	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && typeof prop == 'object') {
		for (key in prop) {
			elem[setAttribute](key, prop[key]);
		}
	}

	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	if (!obj || obj.constructor != Array) {
		obj = [obj];
	}
	return obj; 
}



/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
function pick() {
	var args = arguments,
		i,
		arg;
	for (i = 0; i < args.length; i++) {
		arg = args[i];
		if (defined(arg)) {
			return arg;
		}
	}
}
/**
 * Make a style string from a JS object
 * @param {Object} style
 */
function serializeCSS(style) {
	var s = '', 
		key;
	// serialize the declaration
	for (key in style) {
		s += hyphenate(key) +':'+ style[key] + ';';
	}
	return s;
	
}
/**
 * Set CSS on a give element
 * @param {Object} el
 * @param {Object} styles
 */
function css (el, styles) {
	if (isIE) {
		if (styles && styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity='+ (styles.opacity * 100) +')';
		}
	}
	extend(el.style, styles);
}

/**
 * Utility function to create element with attributes and styles
 * @param {Object} tag
 * @param {Object} attribs
 * @param {Object} styles
 * @param {Object} parent
 * @param {Object} nopad
 */
function createElement (tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) {
		extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: NONE, margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}	
	return el;
}

// the jQuery adapter
if (!globalAdapter && win.jQuery) {
	var jQ = jQuery;
	
	
	each = function(arr, fn) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	};
	
	grep = jQ.grep;
	
	map = function(arr, fn){
		//return jQuery.map(arr, fn);
		var results = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}
		return results;
		
	};
	
	merge = function(){
		var args = arguments;
		return jQ.extend(true, null, args[0], args[1], args[2], args[3]);
	};
	
	hyphenate = function (str) {
		return str.replace(/([A-Z])/g, function(a, b){ return '-'+ b.toLowerCase(); });
	};
	
	addEvent = function (el, event, fn){
		jQ(el).bind(event, fn);
	};
	
	/**
	 * Remove event added with addEvent
	 * @param {Object} el The object
	 * @param {String} eventType The event type. Leave blank to remove all events.
	 * @param {Function} handler The function to remove
	 */
	removeEvent = function(el, eventType, handler) {
		// workaround for jQuery issue with unbinding custom events:
		// http://forum.jquery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jquery-1-4-2
		var func = doc.removeEventListener ? 'removeEventListener' : 'detachEvent';
		if (doc[func] && !el[func]) {
			el[func] = function() {};
		}
		
		jQ(el).unbind(eventType, handler);
	};
	
	fireEvent = function(el, type, eventArguments, defaultFunction) {
		var event = jQ.Event(type),
			detachedType = 'detached'+ type;
		extend(event, eventArguments);
		
		// Prevent jQuery from triggering the object method that is named the
		// same as the event. For example, if the event is 'select', jQuery
		// attempts calling el.select and it goes into a loop.
		if (el[type]) {
			el[detachedType] = el[type];
			el[type] = null;	
		}
		
		// trigger it
		jQ(el).trigger(event);
		
		// attach the method
		if (el[detachedType]) {
			el[type] = el[detachedType];
			el[detachedType] = null;
		}
		
		if (defaultFunction && !event.isDefaultPrevented()) {
			defaultFunction(event);
		}	
	};

	animate = function (el, params, options) {
		var $el = jQ(el);
		$el.stop();
		$el.animate(params, options);
	};
	/**
	 * Stop running animation
	 */
	stop = function (el) {
		jQ(el).stop();
	};
	
	getAjax = function (url, callback) {
		jQ.get(url, null, callback);
	};
	
	// extend jQuery
	jQ.extend( jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
					
	// extend the animate function to allow SVG animations
	var oldStepDefault = jQuery.fx.step._default, 
		oldCur = jQuery.fx.prototype.cur;
	
	// do the step
	jQ.fx.step._default = function(fx){
		var elem = fx.elem;
		if (elem.attr) { // is SVG element wrapper					
			elem.attr(fx.prop, fx.now);			
		} else {
			oldStepDefault.apply(this, arguments);
		}
	};
	// get the current value
	jQ.fx.prototype.cur = function() {
		var elem = this.elem,
			r;
		if (elem.attr) { // is SVG element wrapper
			r = elem.attr(this.prop);
		} else {
			r = oldCur.apply(this, arguments);
		}
		return r;
	};
	
// the MooTools adapter
} else if (!globalAdapter && win.MooTools) {
	
	each = $each;
	
	map = function (arr, fn){
		return arr.map(fn);
	};
	
	grep = function(arr, fn) {
		return arr.filter(fn);
	};
	
	merge = $merge;
	
	hyphenate = function (str){
		return str.hyphenate();
	};
	
	addEvent = function (el, type, fn) {
		if (typeof type == 'string') { // chart broke due to el being string, type function
		
			if (type == 'unload') { // Moo self destructs before custom unload events
				type = 'beforeunload';
			}

			// if the addEvent method is not defined, el is a custom Highcharts object
			// like series or point
			if (!el.addEvent) {
				if (el.nodeName) {
					el = $(el); // a dynamically generated node
				} else {
					extend(el, new Events()); // a custom object
				}
			}
			
			el.addEvent(type, fn);
		}
	};
	
	removeEvent = function(el, type, fn) {
		if (type) {
			if (type == 'unload') { // Moo self destructs before custom unload events
				type = 'beforeunload';
			}


			el.removeEvent(type, fn);
		}
	};
	
	fireEvent = function(el, event, eventArguments, defaultFunction) {
		// create an event object that keeps all functions		
		event = new Event({ 
			type: event,
			target: el
		});
		event = extend (event, eventArguments);
		// override the preventDefault function to be able to use
		// this for custom events
		event.preventDefault = function() {
			defaultFunction = null;
		};
		// if fireEvent is not available on the object, there hasn't been added
		// any events to it above
		if (el.fireEvent) {
			el.fireEvent(event.type, event);
		}
		
		// fire the default if it is passed and it is not prevented above
		if (defaultFunction) {
			defaultFunction(event);
		}		
	};
	
	animate = function (el, params, options) {
		var isSVGElement = el.attr,
			effect;
		
		if (isSVGElement && !el.setStyle) {
			// add setStyle and getStyle methods for internal use in Moo
			el.setStyle = el.getStyle = el.attr;
			// dirty hack to trick Moo into handling el as an element wrapper
			el.$family = el.uid = true;
		}
		
		// stop running animations
		stop(el);
		
		// define and run the effect
		effect = new Fx.Morph(
			isSVGElement ? el : $(el), 
			extend(options, {
				transition: Fx.Transitions.Quad.easeInOut
			})
		);
		effect.start(params);
		el.fx = effect;
	};
	
	/**
	 * Stop running animations on the object
	 */
	stop = function (el) {
		if (el.fx) {
			el.fx.cancel();
		}
	};
	
	getAjax = function (url, callback) {
		(new Request({
			url: url,
			method: 'get',
			onSuccess: callback
		})).send();			
	};
	
} 



/**
 * Set the time methods globally based on the useUTC option. Time method can be either 
 * local time or UTC (default).
 */
function setTimeMethods() {
	var useUTC = defaultOptions.global.useUTC;
	
	makeTime = useUTC ? Date.UTC : function(year, month, date, hours, minutes, seconds) {
		return new Date(
			year, 
			month, 
			pick(date, 1), 
			pick(hours, 0), 
			pick(minutes, 0), 
			pick(seconds, 0)
		).getTime();
	};
	getMinutes = useUTC ? 'getUTCMinutes' : 'getMinutes';
	getHours = useUTC ? 'getUTCHours' : 'getHours';
	getDay = useUTC ? 'getUTCDay' : 'getDay';
	getDate = useUTC ? 'getUTCDate' : 'getDate';
	getMonth = useUTC ? 'getUTCMonth' : 'getMonth';
	getFullYear = useUTC ? 'getUTCFullYear' : 'getFullYear';
	setMinutes = useUTC ? 'setUTCMinutes' : 'setMinutes';
	setHours = useUTC ? 'setUTCHours' : 'setHours';
	setDate = useUTC ? 'setUTCDate' : 'setDate';
	setMonth = useUTC ? 'setUTCMonth' : 'setMonth';
	setFullYear = useUTC ? 'setUTCFullYear' : 'setFullYear';
		
}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	defaultOptions = merge(defaultOptions, options);
	
	// apply UTC
	setTimeMethods();
	
	return defaultOptions;
}

/**
 * Get the updated default options. Merely exposing defaultOptions for outside modules
 * isn't enough because the setOptions method creates a new object.
 */
function getOptions() {
	return defaultOptions;
}

/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = createElement(DIV);
	}
	
	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
}

/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
var 

defaultLabelOptions = {
	enabled: true,
	// rotation: 0,
	align: 'center',
	x: 0,
	y: 15,
	/*formatter: function() {
		return this.value;
	},*/
	style: {
		color: '#666',
		fontSize: '11px'
	}
};

defaultOptions = {
	colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', 
		'#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
				'August', 'September', 'October', 'November', 'December'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true
	},
	chart: {
		//alignTicks: false,
		//className: null,
		//events: { load, selection },
		margin: [50, 50, 90, 80], // docs
		//marginTop: 50,
		//marginRight: 50,
		//marginBottom: 90, // docs
		//marginLeft: 50,
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 5,		
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		style: {
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		},
		backgroundColor: '#FFFFFF',
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0'
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
	},
	title: {
		text: 'Chart title',
		x: 0,
		y: 20,
		align: 'center',
		style: {
			color: '#3E576F',
			fontSize: '16px'
		}

	},
	subtitle: {
		text: '',
		x: 0,
		y: 40,
		align: 'center',
		style: {
			color: '#6D869F'
		}
	},
	
	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			showCheckbox: false,
			animation: true,
			//cursor: 'default',
			//enableMouseTracking: true,
			events: {},
			lineWidth: 2,
			shadow: true,
			// stacking: null,
			marker: { 
				enabled: true,
				//symbol: null, 
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				//fillColor: null, 
				states: { // states for a single point
					hover: {
						//radius: base + 2
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000',
						lineWidth: 2
					}					
				}
			},
			point: {
				events: {}
			},
			dataLabels: merge(defaultLabelOptions, {
				enabled: false,
				y: -6,
				formatter: function() {
					return this.y;
				}
			}),
			
			//pointStart: 0,
			//pointInterval: 1,
			showInLegend: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					lineWidth: 3,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: ABSOLUTE,
			color: '#3E576F'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		layout: 'horizontal',
		labelFormatter: function() {
			return this.name;
		},
		// lineHeight: 16,
		borderWidth: 1,
		borderColor: '#909090',
		borderRadius: 5,
		//reversed: false,
		shadow: false,
		// backgroundColor: null,
		style: {
			padding: '5px'
		},
		itemStyle: {
			cursor: 'pointer',
			color: '#3E576F'
		},
		itemHoverStyle: {
			cursor: 'pointer',
			color: '#000000'
		},
		itemHiddenStyle: {
			color: '#C0C0C0'
		},
		itemCheckboxStyle: {
			position: ABSOLUTE,
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 15,
		y: -15
	},
	
	loading: {
		hideDuration: 100,
		labelStyle: {
			fontWeight: 'bold',
			position: RELATIVE,
			top: '1em'
		},
		showDuration: 100,
		style: {
			position: ABSOLUTE,
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},
	
	tooltip: {
		enabled: true,
		formatter: function() {
			var pThis = this,
				series = pThis.series,
				xAxis = series.xAxis,
				x = pThis.x;
			return '<b>'+ (pThis.point.name || series.name) +'</b><br/>'+
				(defined(x) ? 
					'X value: '+ (xAxis && xAxis.options.type == 'datetime' ? 
						dateFormat(null, x) : x) +'<br/>':
					'')+
				'Y value: '+ pThis.y;
		},
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 2,
		borderRadius: 5,
		shadow: true,
		snap: 10,
		style: {
			color: '#333333',
			fontSize: '12px',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
	},
	
	toolbar: {
		itemStyle: {
			color: '#4572A7',
			cursor: 'pointer'
		}
	},
	
	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		style: {
			cursor: 'pointer',
			color: '#909090',
			fontSize: '10px'
		}
	}
};

// Axis defaults
var defaultXAxisOptions =  {
	// allowDecimals: null,
	// alternateGridColor: null,
	// categories: [],
	dateTimeLabelFormats: {
		second: '%H:%M:%S',
		minute: '%H:%M',
		hour: '%H:%M',
		day: '%e. %b',
		week: '%e. %b',
		month: '%b \'%y',
		year: '%Y'
	},
	endOnTick: false,
	gridLineColor: '#C0C0C0',
	// gridLineWidth: 0,
	// reversed: false,
	
	labels: defaultLabelOptions,
	lineColor: '#C0D0E0',
	lineWidth: 1,
	//linkedTo: null, // docs
	max: null,
	min: null,
	minPadding: 0.01,
	maxPadding: 0.01,
	maxZoom: null,
	minorGridLineColor: '#E0E0E0',
	minorGridLineWidth: 1,
	minorTickColor: '#A0A0A0',
	//minorTickInterval: null,
	minorTickLength: 2,
	minorTickPosition: 'outside', // inside or outside
	minorTickWidth: 1,
	//opposite: false,
	//offset: 0
	//plotBands: [],
	//plotLines: [],
	//reversed: false,
	showFirstLabel: true,
	showLastLabel: false,
	startOfWeek: 1, 
	startOnTick: false,
	tickColor: '#C0D0E0',
	//tickInterval: null,
	tickLength: 5,
	tickmarkPlacement: 'between', // on or between
	tickPixelInterval: 100,
	tickPosition: 'outside',
	tickWidth: 1,
	title: {
		//text: null,
		align: 'middle', // low, middle or high
		margin: 35,
		//rotation: 0,
		//side: 'outside',
		style: {
			color: '#6D869F',
			//font: defaultFont.replace('normal', 'bold')
			fontWeight: 'bold'
		}
		//x: 0, //docs
		//y: 0 // docs
	},
	type: 'linear' // linear or datetime
},

defaultYAxisOptions = merge(defaultXAxisOptions, {
	endOnTick: true,
	gridLineWidth: 1,
	tickPixelInterval: 72,
	showLastLabel: true,
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	lineWidth: 0,
	maxPadding: 0.05,
	minPadding: 0.05,
	startOnTick: true,
	tickWidth: 0,
	title: {
		margin: 40,
		rotation: 270,
		text: 'Y-values'
	}
}),

defaultLeftAxisOptions = {
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	title: {
		rotation: 270
	}
},
defaultRightAxisOptions = {
	labels: {
		align: 'left',
		x: 8,
		y: 3
	},
	title: {
		rotation: 90
	}
},
defaultBottomAxisOptions = { // horizontal axis
	labels: {
		align: 'center',
		x: 0,
		y: 14
	},
	title: {
		rotation: 0
	}
},
defaultTopAxisOptions = merge(defaultBottomAxisOptions, {
	labels: {
		y: -5
	}
});


 

// Series defaults
var defaultPlotOptions = defaultOptions.plotOptions, 
	defaultSeriesOptions = defaultPlotOptions.line; 
//defaultPlotOptions.line = merge(defaultSeriesOptions);
defaultPlotOptions.spline = merge(defaultSeriesOptions);
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	}
});
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	// threshold: 0,
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: 0.75,
	// fillColor: null

});
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	borderRadius: 0,
	//colorByPoint: undefined,
	groupPadding: 0.2,
	marker: null, // point options are specified in the base options
	pointPadding: 0.1,
	//pointWidth: null,
	minPointLength: 0, 
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		},
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	}
});
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: 'left',
		x: 5,
		y: 0
	}
});
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	//dragType: '', // n/a
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true, // always true for pies
	//innerSize: 0,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '90%',
	slicedOffset: 10,
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		}
	}
	
});

// set the default time methods
setTimeMethods();


/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function(){};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}


/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var Color = function(input) {
	// declare variables
	var rgba = [], result;
	
	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {
		
		// rgba
		if((result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(input))) {
			rgba = [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10), parseFloat(result[4], 10)];
		}

		// hex
		else if((result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input))) {
			rgba = [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16), 1];
		}
	
	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;
		
		// it's NaN if gradient colors on a column chart
		if (rgba && !isNaN(rgba[0])) {
			if (format == 'rgb') {
				ret = 'rgb('+ rgba[0] +','+ rgba[1] +','+ rgba[2] +')';
			} else if (format == 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba('+ rgba.join(',') +')';
			}
		} else {
			ret = input;
		}
		return ret;
	}
	
	/**
	 * Brighten the color
	 * @param {Object} alpha
	 */
	function brighten(alpha) {
		if (typeof alpha == 'number' && alpha !== 0) {
			for (var i = 0; i < 3; i++) {
				rgba[i] += parseInt(alpha * 255, 10);
				if (rgba[i] < 0) {
					rgba[i] = 0;
				}
				if (rgba[i] > 255) {
					rgba[i] = 255;
				}
			}
		}
		return this;
	}
	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}	
	
	// initialize: parse the input
	init(input);
	
	// public methods
	return {
		get: get,
		brighten: brighten,
		setOpacity: setOpacity
	};
};



/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
function numberFormat (number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = number, c = isNaN(decimals = mathAbs(decimals)) ? 2 : decimals,
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep, s = n < 0 ? "-" : "",
		i = parseInt(n = mathAbs(+n || 0).toFixed(c), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php 
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	function pad (number) {
		return number.toString().replace(/^([0-9])$/, '0$1');
	}
	
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');
	
	var date = new Date(timestamp * timeFactor),
	
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,
		langMonths = lang.months,
		
		// list all format keys
		replacements = {

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31 
			'e': dayOfMonth, // Day of the month, 1 through 31 
			
			// Week (none implemented)
			
			// Month
			'b': langMonths[month].substr(0, 3), // Short month, like 'Jan'
			'B': langMonths[month], // Long month, like 'January'
			'm': pad(month + 1), // Two digit month number, 01 through 12
			
			// Year
			'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
			'Y': fullYear, // Four digits year, like 2009
			
			// Time
			'H': pad(hours), // Two digits hours in 24h format, 00 through 23
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()) // Two digits seconds, 00 through  59
			
		};


	// do the replaces
	for (var key in replacements) {
		format = format.replace('%'+ key, replacements[key]);
	}
		
	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};



/**
 * Loop up the node tree and add offsetWidth and offsetHeight to get the
 * total page offset for a given element
 * @param {Object} el
 */
function getPosition (el) {
	var p = { x: el.offsetLeft, y: el.offsetTop };
	while (el.offsetParent)	{
		el = el.offsetParent;
		p.x += el.offsetLeft;
		p.y += el.offsetTop;
		if (el != doc.body && el != doc.documentElement) {
			p.x -= el.scrollLeft;
			p.y -= el.scrollTop;
		}
	}
	return p;
}


/**
 * A wrapper object for SVG elements 
 */
function SVGElement () {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function(renderer, nodeName) {
		this.element = doc.createElementNS('http://www.w3.org/2000/svg', nodeName);
		this.renderer = renderer;
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} duration
	 */
	animate: function(params, duration) {
		animate(this, params, duration);
	},
	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			child,
			element = this.element,
			nodeName = element.nodeName,
			renderer = this.renderer,
			skipAttr,
			shadows = this.shadows,
			hasSetSymbolSize,
			ret = this;
			
		// single key-value pair
		if (typeof hash == 'string' && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter: first argument is a string, second is undefined
		if (typeof hash == 'string') {
			key = hash;
			if (nodeName == 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key == 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = parseFloat(attr(element, key) || this[key] || 0);
			
		// setter
		} else {
		
			for (key in hash) {
				value = hash[key];
				
				// paths
				if (key == 'd') {
					if (value && value.join) { // join path
						value = value.join(' ');
					}
					if (/(NaN|  |^$)/.test(value)) {
						value = 'M 0 0';
					}
					
				// update child tspans x values
				} else if (key == 'x' && nodeName == 'text') { 
					for (i = 0; i < element.childNodes.length; i++ ) {
						child = element.childNodes[i];
						// if the x values are equal, the tspan represents a linebreak
						if (attr(child, 'x') == attr(element, 'x')) {
							//child.setAttribute('x', value);
							attr(child, 'x', value);
						}
					}
					
				// apply gradients
				} else if (key == 'fill') {
					value = renderer.color(value, element, key);
				
				// circle x and y
				} else if (nodeName == 'circle') {
					key = { x: 'cx', y: 'cy' }[key] || key;
					
				// translation
				} else if (key == 'translateX' || key == 'translateY') {
					this[key] = value;
					this.updateTransform();
					skipAttr = true;
	
				// apply opacity as subnode (required by legacy WebKit and Batik)
				} else if (key == 'stroke') {
					value = renderer.color(value, element, key);
					 
				
				// special
				} else if (key == 'isTracker') {
					this[key] = value;
				}
				
				// jQuery animate changes case
				if (key == 'strokeWidth') {
					key = 'stroke-width';
				}
				
				// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)				
				if (isWebKit && key == 'stroke-width' && value === 0) {
					value = 0.000001;
				}
				
				// symbols
				if (this.symbolName && /^(x|y|r|start|end|innerR)/.test(key)) {
					
					
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}
				
				// let the shadow follow the main element
				if (shadows && /^(width|height|visibility|x|y|d)$/.test(key)) {
					i = shadows.length;
					while (i--) {
						attr(shadows[i], key, value);
					}
					
				}
				
					
				
				if (key == 'text') {
					// only one node allowed
					renderer.buildText(element, value);
				} else if (!skipAttr) {
					//element.setAttribute(key, value);
					attr(element, key, value);
				}
			}
			
		}
		return ret;
	},
	
	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function(hash) {
		var wrapper = this;
		
		wrapper.x = pick(hash.x, wrapper.x);
		wrapper.y = parseFloat(pick(hash.y, wrapper.y)); // mootools animation bug needs parseFloat
		wrapper.r = pick(hash.r, wrapper.r);
		wrapper.start = pick(hash.start, wrapper.start);
		wrapper.end = pick(hash.end, wrapper.end);
		wrapper.width = pick(hash.width, wrapper.width);
		wrapper.height = parseFloat(pick(hash.height, wrapper.height));
		wrapper.innerR = pick(hash.innerR, wrapper.innerR);
		
		wrapper.attr({ 
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.r, {
				start: wrapper.start, 
				end: wrapper.end,
				width: wrapper.width, 
				height: wrapper.height,
				innerR: wrapper.innerR
			})
		});
	},
	
	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function(clipRect) {
		return this.attr('clip-path', 'url('+ this.renderer.url +'#'+ clipRect.id +')');
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var elemWrapper = this;
		
		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}
		
		// save the styles in an object
		styles = extend(
			elemWrapper.styles,
			styles
		);
		
		// serialize and set style attribute
		elemWrapper.attr({
			style: serializeCSS(styles)
		});
		
		// store object
		elemWrapper.styles = styles;
		
		return elemWrapper;
	},
	
	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function(eventType, handler) {
		// simplest possible event model for internal use
		this.element['on'+ eventType] = handler;
		return this;
	},
	
	
	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function(x, y) {
		var wrapper = this;
		wrapper.translateX = x;
		wrapper.translateY = y;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Invert a group, rotate and flip
	 */
	invert: function() {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Private method to update the transform attribute based on internal 
	 * properties
	 */
	updateTransform: function() {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			inverted = wrapper.inverted,
			transform = [];
			
		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}
			
		// apply translate
		if (translateX || translateY) {
			transform.push('translate('+ translateX +','+ translateY +')');
		}
		
		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		}
		
		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function() {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},
	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function() {
		return this.element.getBBox();
	},
	
	/**
	 * Show the element
	 */
	show: function() {
		return this.attr({ visibility: VISIBLE });
	},
	
	/**
	 * Hide the element
	 */
	hide: function() {
		return this.attr({ visibility: HIDDEN });
	},
	
	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */ 
	add: function(parent) {
	
		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i;
			
		// mark as inverted
		this.parentInverted = parent && parent.inverted;
		
		// mark the container as having z indexed children
		if (zIndex) {
			parentWrapper.handleZ = true;
			zIndex = parseInt(zIndex, 10);
		}

		// insert according to this and other elements' zIndex
		if (parentWrapper.handleZ) { // this element or any of its siblings has a z index
			for (i = 0; i < childNodes.length; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement != element && (
						// insert before the first element with a higher zIndex
						parseInt(otherZIndex, 10) > zIndex || 
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))  
						
						)) {
					parentNode.insertBefore(element, otherElement);
					return this;
				}
			}
		}
		
		// default: append at the end
		parentNode.appendChild(element);
		return this;
	},
	
	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function() {
		var wrapper = this,
			element = wrapper.element,
			shadows = wrapper.shadows,
			parentNode = element.parentNode,
			key;
		
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations
		if (parentNode) {
			parentNode.removeChild(element);
		}
		
		if (shadows) {
			each(shadows, function(shadow) {
				parentNode = shadow.parentNode;
				if (parentNode) { // the entire chart HTML can be overwritten
					parentNode.removeChild(shadow);
				}				
			});
		}
				
		for (key in wrapper) {
			delete wrapper[key];
		}
		
		return null;
	},
	
	/**
	 * Empty a group element
	 */
	empty: function() {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length;
			
		while (i--) {
			element.removeChild(childNodes[i]);
		}
	},
	
	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean} apply
	 */
	shadow: function(apply) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			
			// compensate for inverted plot area
			transform = this.parentInverted ? '(-1,-1)' : '(1,1)';
			
		
		if (apply) {
			//obj.shadows = [];
			for (i = 1; i <= 3; i++) {
				/*this.drawRect(x + 1, y + 1, w, h, 'rgba(0, 0, 0, '+ (0.05 * i) +')', 
					6 - 2 * i, radius);*/
					
				shadow = element.cloneNode(0);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': 7 - 2 * i,
					'transform': 'translate'+ transform,
					'fill': NONE
				});
				
				
				element.parentNode.insertBefore(shadow, element);
				
				shadows.push(shadow);
			}
			
			this.shadows = shadows;
		}
		return this;
	
	}
};



/**
 * The default SVG renderer
 */
var SVGRenderer = function() {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function(container, width, height) {
		var box = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			loc = location;
		attr(box, {
			width: width,
			height: height,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.1'
		});
		container.appendChild(box);
		
		// object properties
		this.Element = SVGElement;
		this.box = box;
		this.url = isIE ? '' : loc.href.replace(/#.*?$/, ''); // page url used for internal references
		this.defs = this.createElement('defs').add();
	},
	
	
	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function(nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},
	
	
	/** 
	 * Parse a simple HTML string into SVG tspans
	 * 
	 * @param {Object} textNode The parent text SVG node
	 * @param {String} str
	 */
	buildText: function(textNode, str) {
		var lines = str.toString()
				.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
				.replace(/<(i|em)>/g, '<span style="font-style:italic">')
				.replace(/<a/g, '<span')
				.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
				.split(/<br[^>]?>/g),
			childNodes = textNode.childNodes,
			styleRegex = /style="([^"]+)"/,
			hrefRegex = /href="([^"]+)"/,
			parentX = attr(textNode, 'x'),
			i = childNodes.length;
			
		// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}
		
		
		each (lines, function(line, lineNo) {
			var spans, spanNo = 0;
			
			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');
			
			each (spans, function (span) {
				if (span !== '' || spans.length == 1) {
					
					var attributes = {},
						tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					
					if (styleRegex.test(span)) {
						attr(
							tspan, 
							'style', 
							span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2')
						);
					}
					if (hrefRegex.test(span)) {
						attr(tspan, 'onclick', 'location.href=\"'+ span.match(hrefRegex)[1] +'\"');
						css(tspan, { cursor: 'pointer' });
					}
					
					span = span.replace(/<(.|\n)*?>/g, '');
					tspan.appendChild(doc.createTextNode(span || ' ')); // WebKit needs a string
					//console.log('"'+tspan.textContent+'"');
					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						// Firefox ignores spaces at the front or end of the tspan
						attributes.dx = 3; // space
					}
					if (lineNo && !spanNo) { // first span on subsequent line, add the line height
						attributes.dy = 16;
					}
					
					attr(tspan, attributes);
					
					textNode.appendChild(tspan);
					
					spanNo++;
				}
			});
			
		});
	},
	
	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width 
	 */
	crispLine: function(points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] == points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] == points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},
	
	
	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		return this.createElement('path').attr({ 
			d: path, 
			fill: NONE
		});
	},
	
	/**
	 * Draw and return an SVG circle
	 * @param {Number} x The x position
	 * @param {Number} y The y position
	 * @param {Number} r The radius
	 */
	circle: function (x, y, r) {
		var attr = typeof x == 'object' ?
			x :
			{
				x: x,
				y: y,
				r: r
			};
		
		return this.createElement('circle').attr(attr);
	},
	
	/**
	 * Draw and return an arc
	 * @param {Number} x X position
	 * @param {Number} y Y position
	 * @param {Number} r Radius
	 * @param {Number} innerR Inner radius like used in donut charts
	 * @param {Number} start Starting angle
	 * @param {Number} end Ending angle
	 */
	arc: function (x, y, r, innerR, start, end) {
		// arcs are defined as symbols for the ability to set 
		// attributes in attr and animate
		
		if (typeof x == 'object') {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		
		return this.symbol('arc', x || 0, y || 0, r || 0, {
			innerR: innerR || 0,
			start: start || 0,
			end: end || 0
		});
	},
	
	/**
	 * Draw and return a rectangle
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} r Border corner radius
	 * @param {Number} strokeWidth A stroke width can be supplied to allow crisp drawing
	 */
	rect: function (x, y, width, height, r, strokeWidth) {
		
		if (arguments.length > 1) {
			var normalizer = (strokeWidth || 0) % 2 / 2;

			// normalize for crisp edges
			x = mathRound(x || 0) + normalizer;
			y = mathRound(y || 0) + normalizer;
			width = mathRound((width || 0) - 2 * normalizer);
			height = mathRound((height || 0) - 2 * normalizer);
		}
		
		var attr = typeof x == 'object' ? 
			x : // the attributes can be passed as the first argument
			{
				x: x,
				y: y,
				width: mathMax(width, 0),
				height: mathMax(height, 0)
			};			
		
		return this.createElement('rect').attr(extend(attr, {
			rx: r || attr.r,
			ry: r || attr.r,
			fill: NONE
		}));
	},
	
	/**
	 * Create a group
	 * @param {String} name The group will be given a class name of 'highcharts-{name}'.
	 *     This can be used for styling and scripting.
	 */
	g: function(name) {
		return this.createElement('g').attr(
			defined(name) && { 'class': PREFIX + name }
		);
	},
	
	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function(src, x, y, width, height) {
		var elemWrapper = this.createElement('image').attr({
			x: x,
			y: y,
			width: width,
			height: height,
			preserveAspectRatio: NONE
		});		
		
		// set the href in the xlink namespace
		elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink', 
			'href', src);
			
		return elemWrapper;					
	},
	
	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 * 
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function(symbol, x, y, radius, options) {
		
		var obj,
			
			// get the symbol definition function
			symbolFn = this.symbols[symbol],
			
			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				x, 
				y, 
				radius, 
				options
			),
			
			imageRegex = /^url\((.*?)\)$/,
			imageSrc;
			
		
		if (path) {
			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				r: radius
			});
			if (options) {
				extend(obj, options);
			}
			
			
		// image symbols
		} else if (imageRegex.test(symbol)) {
			imageSrc = symbol.match(imageRegex)[1];
			
			
			// create the image
			obj = this.image(imageSrc).attr({
				visibility: HIDDEN
			});
			// create a dummy JavaScript image to get the width and height  
			createElement('img', {
				onload: function() {
					var img = this,
						size = symbolSizes[img.src] || [img.width, img.height];
					obj.attr({
						x: mathRound(x - size[0] / 2) + PX,
						y: mathRound(y - size[1] / 2) + PX,
						width: size[0],
						height: size[1],
						visibility: 'inherit'
					});
				},
				src: imageSrc