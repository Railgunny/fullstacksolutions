<?php
/**
 * This file is part of the exporting module for Highcharts JS.
 * www.highcharts.com/license
 * 
 *  
 * Available POST variables:
 *
 * $filename string The desired filename without extension
 * $type string The MIME type for export. 
 * $width int The pixel width of the exported raster image. The height is calculated.
 * $svg string The SVG source code to convert.
 */


// Options
define ('BATIK_PATH', 'batik-rasterizer.jar');

///////////////////////////////////////////////////////////////////////////////

$type = $_POST['type'];
$svg = (string) $_POST['svg'];
$filename = (string) $_POST['filename'];

// prepare variables
if (!$filename) $filename = 'chart';
if (get_magic_quotes_gpc()) {
	$svg = stripslashes($svg);	
}



$tempName = md5(rand());

// allow no other than predefined types
if ($type == 'image/png') {
	$typ