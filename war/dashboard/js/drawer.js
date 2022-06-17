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
		this.closer = '<div id="drw_close"><a href="#" cla