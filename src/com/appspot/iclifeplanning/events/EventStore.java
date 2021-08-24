package com.appspot.iclifeplanning.events;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.appspot.datastore.UserProfile;
import com.appspot.datastore.UserProfileStore;
import com.appspot.iclifeplanning.authentication.AuthService;
import com.appspot.iclifeplanning.authentication.CalendarUtils;
import com.google.apphosting.api.UserServicePb.UserService;
import com.google.gdata.client.Query.CustomParameter;
import com.google.gdata.client.calendar.CalendarQuery;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.Link;
import com.google.gdata.data.calendar.CalendarEntry;
import com.google.gdata.data.calendar.CalendarEventEntry;
import com.google.gdata.data.calendar.CalendarEventFeed;
import com.google.gdata.data.calendar.CalendarFeed;
import com.google.gdata.util.ServiceException;

public class EventStore {

	private static EventStore eventStore = null;
	private List<Event> allEvents = new ArrayList<Event>();
	private static final Logger log = Logger.getLogger("EventStore");
	
	private EventStore() {}
	
	public static EventStore getInstance() {
		if (eventStore == null)
				eventStore = new EventStore();
		return eventStore;
	}
	
	public void initizalize() throws IOException {
	    String userID = CalendarUtils.getCurrentUserId();
	    UserProfile profile = UserProfileStore.getUserProfile(userID);
	    long from = profile.getStartOptimizing();
	    long to = profile.getFinishOptimizing();
		allEvents = getEventsFromTimeRange(from, to);
	}

	public List<Event> getEvents() {
		return allEvents;	
	}

	public List<Event> getEventsFromTimeRange(long startTime, long endTime) throws IOException{
		List<Event> events = 