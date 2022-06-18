/**
 * @name       jQuery.drawer
 * @version    1.00, 2008/05/01
 * @author     inamorix <inamorix@metatype.jp>
 * @copyright  Copyright (c) 2008, metatype.jp.
 * @license    The MIT-style license.
 */



(function ($, loaded) {
$.extend({ drawer: {
	init: function () {
		this.self   = null;
		this.closer = '<div id="drw_close"><a href="#" class="drw_close" title="close">Hide</a></div>';
		this.loader = '<div id="drw_loader">Loading...</div>';
		this.setTabs();
		$('#drw').html('<div id="drw_content"></div>');
	},
	
	
	
	setTabs: function () {
		var tabs  = $('#drw_tabs li');
		var w     = Math.floor(100 / tabs.size());
		var w_rem = 100 % tabs.size();
		tabs.each(function () {
			$(this).css({ width: (w + ((w_rem-- > 0) ? 1 : 0)) + '%' });
		});
		
		$('#drw_tabs li:first').addClass('first');
		$('#drw_tabs li:last').addClass('last');
		$('#drw_tabs a[rel*=drw]').each(function () {
			$('#' + this.href.split('#')[1]).hide();
			$(this).click(function () {
				$.drawer.close(($.drawer.self != this) ? this : null);
				this.blur();
				return false;
			});
		});
	},
	
	
	
	open: function () {
		var content = $('#drw_content').empty();
		$('#drw_tabs_focus').removeAttr('id');
		if (!this.self) return;
		
		this.self.id = 'drw_tabs_focus';
		loaded       = /(#[\w\-]+)$/.test(this.self.href);
		content.append(loaded ? $(RegExp.$1).clone().show() : this.loader);
		content.append(this.closer);
		content.find('.drw_close').click(function () {
			$.drawer.close(null);
			t