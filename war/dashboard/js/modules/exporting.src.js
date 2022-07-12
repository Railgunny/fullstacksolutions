
/** 
 * @license Highcharts JS v2.0.5 (2010-09-17)
 * Exporting module
 * 
 * (c) 2010 Torstein Hønsi
 * 
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, document, window, Math, setTimeout */

(function() { // encapsulate

// create shortcuts
var HC = Highcharts,
	Chart = HC.Chart,
	addEvent = HC.addEvent,
	defaultOptions = HC.defaultOptions,
	createElement = HC.createElement,
	discardElement = HC.discardElement,
	css = HC.css,
	merge = HC.merge,
	each = HC.each,
	extend = HC.extend,
	math = Math,
	mathMax = math.max,
	doc = document,
	win = window,
	M = 'M',
	L = 'L',
	DIV = 'div',
	HIDDEN = 'hidden',
	NONE = 'none',
	PREFIX = 'highcharts-',
	ABSOLUTE = 'absolute',
	PX = 'px',



	// Add language and get the defaultOptions
	defaultOptions = HC.setOptions({
		lang: {
			downloadPNG: 'Download PNG image',
			downloadJPEG: 'Download JPEG image',
			downloadPDF: 'Download PDF document',
			downloadSVG: 'Download SVG vector image',
			exportButtonTitle: 'Export to raster or vector image',
			printButtonTitle: 'Print the chart'
		}
	});

// Buttons and menus are collected in a separate config option set called 'navigation'.
// This can be extended later to add control buttons like zoom and pan right click menus.
defaultOptions.navigation = {
	menuStyle: {
		border: '1px solid #A0A0A0',
		background: '#FFFFFF'
	},
	menuItemStyle: {
		padding: '0 5px',
		background: NONE,
		color: '#303030'
	},
	menuItemHoverStyle: {
		background: '#4572A5',
		color: '#FFFFFF'
	},
	
	buttonOptions: {
		align: 'right',
		backgroundColor: {
			linearGradient: [0, 0, 0, 20],
			stops: [
				[0.4, '#F7F7F7'],
				[0.6, '#E3E3E3']
			]
		},
		borderColor: '#B0B0B0',
		borderRadius: 3,
		borderWidth: 1,
		//enabled: true,
		height: 20,
		hoverBorderColor: '#909090',
		hoverSymbolFill: '#81A7CF',
		hoverSymbolStroke: '#4572A5',
		symbolFill: '#E0E0E0',
		//symbolSize: 12,
		symbolStroke: '#A0A0A0',
		//symbolStrokeWidth: 1,
		symbolX: 11.5,
		symbolY: 10.5,
		verticalAlign: 'top',
		width: 24,
		y: 10		
	}
};



// Add the export related options
defaultOptions.exporting = {
	//enabled: true,
	//filename: 'chart',
	type: 'image/png',
	url: 'http://export.highcharts.com/',
	width: 800,
	buttons: {
		exportButton: {
			//enabled: true,
			symbol: 'exportIcon',
			x: -10,
			symbolFill: '#A8BF77',
			hoverSymbolFill: '#768F3E',
			_titleKey: 'exportButtonTitle',
			menuItems: [{
				textKey: 'downloadPNG',
				onclick: function() {
					this.exportChart();
				}
			}, {
				textKey: 'downloadJPEG',
				onclick: function() {
					this.exportChart({
						type: 'image/jpeg'
					});
				}
			}, {
				textKey: 'downloadPDF',
				onclick: function() {
					this.exportChart({
						type: 'application/pdf'
					});
				}
			}, {
				textKey: 'downloadSVG',
				onclick: function() {
					this.exportChart({
						type: 'image/svg+xml'
					});
				}
			}/*, {