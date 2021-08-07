package com.appspot.iclifeplanning.events;

import java.util.Map;
import java.util.Set;

import com.appspot.datastore.SphereName;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.TextConstruct;

public interface EventInterface {

	public TextConstruct getDescription();
	public void setDescription(TextConstruct description);
	public DateTime getStartTime();
	public void setStartTime(DateTime startTime);
	public DateTime getEndTime();
	public void s