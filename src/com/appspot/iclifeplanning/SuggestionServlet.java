package com.appspot.iclifeplanning;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appspot.analyser.Analyser;
import com.appspot.analyser.DeleteSuggestion;
import com.appspot.analyser.IEvent;
import com.appspot.analyser.Pair;
import com.appspot.analyser.RescheduleSuggestion;
import com.appspot.analyser.Suggestion;
import com.appspot.datastore.SphereName;
import com.appspot.datastore.TokenStore;
import com.appspot.iclifeplanning.authentication.CalendarUtils;
import com.appspot.iclifeplanning.events.Event;
import com.appspot.iclifeplanning.events.EventStore;
import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

/**
 * Suggestion servlet. responsible for managing the "optimise button".
 * Initialises the EventStore and runs the analyser to create suggestions.
 * 
 * @author Agnieszka Magda Madurska (amm208@doc.ic.ac.uk)
 * 
 */
@SuppressWarnings("serial")
public class SuggestionServlet extends HttpServlet {
	// This should NOT be stored like this. Reimplement to use memcache at some point.
	private static Map<String, List<List<Suggestion>>> suggestionMap = new HashMap<String, List<List<Suggestion>>>();
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		System.out.println("Map size: " + suggestionMap.size());
		String token = TokenStore.getToken(CalendarUtils.getCurrentUserId());
		CalendarUtils.client.setAuthSubToken(token);

		EventStore eventStore = EventStore.getInstance();
		eventStore.initizalize();
		List<Event> events = eventStore.getEvents();
		for(Event e : events) {
			if (e.getTitle() != null && e.getTitle().equals("Video conference with MTV"))
				e.setDurationInterval(new Pair(0.0,120.0));
		}
		
		// ------------------- Dummy data
		Analyser analyser = new Analyser();

		List<List<Suggestion>> suggestions = analyser.getSuggestions(events, CalendarUtils.getCurrentUserId());
		suggestionMap.put(CalendarUtils.getCurrentUserId(), suggestions);
		//System.out.println("Returning suggestions for list 1: " +  suggestions.get(0).size());
		/*
		List<List<Suggestion>> suggestions = new ArrayList<List<Suggestion>>();
		suggestions.add(new ArrayList<Suggestion>());
		suggestions.add(new ArrayList<Suggestion>());
		suggestions.add(new ArrayList<Suggestion>());
		suggestionMap.put(CalendarUtils.getCurrentUserId(), suggestions);

		
		IEvent event1 = (IEvent)events.get(1);
		IEvent event2 = (IEvent)events.get(2);
		IEvent event3 = (IEvent)events.get(3);
		IEvent event4 = (IEvent)events.get(4);
		IEvent event5 = (IEvent)events.get(5);
		IEvent event6 = (IEvent)events.get(6);

		Suggestion sug = new RescheduleSuggestion(event1);
		List<Suggestion> alternatives = new ArrayList<Suggestion>();
		alternatives.add(new DeleteSuggestion(event4));
		alternatives.add(new DeleteSuggestion(event5));
		sug.setAlternativeSuggetions(alternatives);
		suggestions.get(0).add(sug);

		suggestions.get(0).add(new DeleteSuggestion(event3));
		
		sug = new DeleteSuggestion(event2);
		alternatives = new ArrayList<Suggestion>();
		alternatives.add(new DeleteSuggestion(event4));
		alternatives.add(new DeleteSuggestion(event5));
		sug.setAlternativeSuggetions(alternatives);
		suggestions.get(1).add(sug);

		suggestions.get(1).add(new DeleteSuggestion(event4));
		
		sug = new DeleteSuggestion(event3);
		alternatives = new ArrayList<Suggestion>();
		alternatives.add(new DeleteSuggestion(event4));
		alternatives.add(new DeleteSuggestion(event5));
		sug.setAlternativeSuggetions(alternatives);
		suggestions.get(2).add(sug);

		suggestions.get(2).add(new DeleteSuggestion(event5));
		suggestions.get(2).add(new DeleteSuggestion(event