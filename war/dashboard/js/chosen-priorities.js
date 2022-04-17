var priorities;

		
$.getJSON("chosen-priorities", parametersForServlet, function(data){
	
	if('nullUser'==data.error)
	{
		alert('User ' + parametersForServlet.userName + ' not fo