
var serverDataHistory = {
	masterCharts: [],
	// other data might be placed in this container
	
};

var masterChart,
	detailChart;
			

$.getJSON("spheres-history", parametersForServlet, function(data){
		
	seriesFromServer = data.series;
		
	serverDataHistory.masterCharts = seriesFromServer;
	
						
	// make the container smaller and add a second container for the master chart
	var $historicChart = $('#historicChart')
		.css('position', 'relative');
	
	var $detailContainer = $('<div id="detail-container">')
		.appendTo($historicChart);
	
	var $masterContainer = $('<div id="master-container">')
		.css({ position: 'absolute', top: 300, height: 80, width: 800 })
		.appendTo($historicChart);
			
	currentTime = Date.UTC(2011, 1, 14);
	var	detailStart = currentTime - 180 * 24 * 3600 * 1000;
			
	// create the master chart
	masterChart = new Highcharts.Chart({
		chart: {
			renderTo: 'master-container',
			borderWidth: 0,
			backgroundColor: '#111111', // null, // 'rgba(240, 0, 0, 1)',
			zoomType: 'x',
			marginTop: 0,
			marginBottom: 20,
			events: {
				
				// listen to the selection event on the master chart to update the 
				// extremes of the detail chart
				selection: function(event) {
					var extremesObject = event.xAxis[0],
						min = extremesObject.min,
						max = extremesObject.max,
						xAxis = this.xAxis[0];
						
					for(j=0; j<masterChart.series.length; j++)
					{
						detailData = [];
						
						// reverse engineer the last part of the data
						jQuery.each(this.series[j].data, function(i, point) {
							if (point.x > min && point.x < max) {
								detailData.push({
									x: point.x,
									y: point.y
								});
							}
						});
						
						detailChart.series[j].setData(detailData);
					}
													
					// move the plot bands to reflect the new detail span
					// (darker areas on the master chart)
					xAxis.removePlotBand('mask-before');
					xAxis.addPlotBand({
						id: 'mask-before',
						from: Date.UTC(2000, 0, 1),
						to: min,
						color: 'rgba(0, 0, 0, 1)'
					});
					
					
					xAxis.removePlotBand('mask-after');
					xAxis.addPlotBand({
						id: 'mask-after',
						from: max,
						to: Date.UTC(2030, 11, 31),
						color: 'rgba(0, 0, 0, 1)'
					});
					
					return false;
				}
			}
		},
		title: 'null',
		xAxis: {
			type: 'datetime',
			showLastTickLabel: true,
			maxZoom: 21 * 24 * 3600000, // 21 days
			minPadding: 0.01,
			maxPadding: 0.01,
			// set equal to the initial zoom on the detail chart
			plotBands: [{
				id: 'mask-before',
				from: Date.UTC(2000, 1, 1),
				to: detailStart,
				color: 'rgba(0, 0, 0, 1)'
			}],
			title: {
				text: null
			}
		},
		yAxis: {
			gridLineWidth: 0,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			min: 0.6,
			showFirstLabel: false
		},
		tooltip: {
			formatter: function() {
				return false;
			}
		},
		legend: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		plotOptions: {
			series: {
				fillColor: {
					linearGradient: [0, 0, 0, 70],
					stops: [
						[0, 'rgba(69, 114, 190, 0.3)'],
						[1, 'rgba(50,50,50, 0.3)']
					]
				},
				lineWidth: 1,
				marker: {
					enabled: false