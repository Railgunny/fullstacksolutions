package com.appspot.analyser;

import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import com.appspot.datastore.SphereName;
import com.appspot.iclifeplanning.authentication.CalendarUtils;
import com.google.gdata.client.calendar.CalendarService;
import com.google.gdata.data.calendar.CalendarEventEntry;
import com.google.gdata.util.ServiceException;

public class DeleteSuggestion extends Suggestion {
	
	private CalendarEventEntry event;

	public DeleteSuggestion(BaseCalendarSlot slot) {
		super(slot);
	}

	public DeleteSuggestion(IEvent e) {
		super(e);
		event = e.getCalendarEvent();
	}

	public DeleteSuggestion(String title, String description,
			Calendar startDate, Calendar end