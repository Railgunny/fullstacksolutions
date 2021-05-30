
package com.appspot.analyser;

import java.util.*;

import com.appspot.datastore.SphereInfo;
import com.appspot.datastore.SphereName;
import com.appspot.iclifeplanning.events.Event;

//Helper functions used across the application
public class Utilities {
	//Length of day in mins
	public static final int DAYLENGTH = 1440;
	
	public static double getDuration(Calendar start, Calendar end) {
		return (end.getTimeInMillis() - start.getTimeInMillis()) / 1000 / 60;
	}

	//Max and min of two calendars
	public static Calendar min(Calendar c1, Calendar c2) {
		if (c1.compareTo(c2) >= 0)
			return c2;
		else
			return c1;
	}

	public static Calendar max(Calendar c1, Calendar c2) {
		if (c1.compareTo(c2) >= 0)
			return c1;
		else
			return c2;
	}

	public static Map<SphereName, Double> generateSpheres(double[] values) {
		SphereName[] names = SphereName.values();
		HashMap<SphereName, Double> res = new HashMap<SphereName, Double>();
		for (int i = 0; i < names.length; i++) {
			if (i < values.length)
				res.put(names[i], values[i]);
			else
				res.put(names[i], 0.0);
		}
		return res;
	}
	//Merging of two lists containing calendars
	public static List<CalendarStatus> merge(List<CalendarStatus> eventStatuses, List<CalendarStatus> proposalStatuses) {
		List<CalendarStatus> result = new LinkedList<CalendarStatus>();
		if (eventStatuses.isEmpty())
			result.addAll(proposalStatuses);
		else if (proposalStatuses.isEmpty())
			result.addAll(eventStatuses);
		else {
			Iterator<CalendarStatus> first = eventStatuses.iterator();
			Iterator<CalendarStatus> second = proposalStatuses.iterator();
			CalendarStatus currentFirst = first.next();
			CalendarStatus currentSecond = second.next();
			while (currentFirst != null && currentSecond != null) {
				if (currentFirst.compareTo(currentSecond) < 0) {
					result.add(currentFirst);
					try{
						currentFirst = first.next();
					}
					catch(NoSuchElementException e){
						currentFirst = null;
						result.add(currentSecond);
					}

				} else {
					result.add(currentSecond);
					try{
						currentSecond = second.next();
					}
					catch(NoSuchElementException e){
						currentSecond = null;
						result.add(currentFirst);
					}
				}
			} 
			if (currentFirst == null) {
				while (second.hasNext()) 
					result.add(second.next());
			} 
			else {
				while(first.hasNext())
					result.add(first.next());
			}
		}
		return result;
	}
	
	public static HashMap<SphereName, Double> analyseEvents(
			List<Event> events, Map<SphereName, Double> currentDesiredBalance) {
		Map<SphereName, Double> times = new HashMap<SphereName, Double>();
		initializeTimes(times, currentDesiredBalance.keySet());
		HashMap<SphereName, Double> result = new HashMap<SphereName, Double>();
		double sum = 0;
		for (IEvent event : events) {
			double durationInMins = event.getDuration();