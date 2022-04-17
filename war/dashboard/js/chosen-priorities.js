var priorities;

		
$.getJSON("chosen-priorities", parametersForServlet, function(data){
	
	if('nullUser'==data.error)
	{
		alert('User ' + parametersForServlet.userName + ' not found.');
	}


	priorities = new Highcharts.Chart({
		chart: {
			renderTo: 'priorities-chart',
			margin: [50, 200, 60, 170]
		},
		title: {
			text: 'Life Spheres Priority Assignment'
		},
		plotArea: {
			shadow: null,
			borderWidth: null,
			backgroundColor: null
		},
		tooltip: {
			formatter: function() {
				return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.y