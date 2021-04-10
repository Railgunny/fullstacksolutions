
package com.appspot.analyser;

import java.util.*;

import com.appspot.datastore.SphereInfo;
import com.appspot.datastore.SphereName;

/* Keeps status of a calendar */
public class CalendarStatus implements Comparable<CalendarStatus> {
	private IEvent event;
	private double additionalEventTime;
	private double coefficient;
	private double userBusyTime;
	private List<CalendarStatus> alternatives;
	public FreeSlotsManager slotsManager;
	private Map<SphereName, SphereInfo> sphereResults;
	private boolean containsProposal;
	private boolean successful;

	public CalendarStatus(double userBusyTime, Map<SphereName, SphereInfo> currentSphereResults, List<BaseCalendarSlot> freeSlots) {
		event = null;
		this.userBusyTime = userBusyTime;
		sphereResults = new HashMap<SphereName, SphereInfo>();
		copySphereResults(currentSphereResults);
		setCurrentCoefficient();
		slotsManager = new FreeSlotsManager(freeSlots, this);
	}

	public CalendarStatus(Proposal proposal, CalendarStatus other, List<BaseCalendarSlot> freeSlots, List<BaseCalendarSlot> possibleSlots) {
		copyOtherCalendar(other);
		this.event = proposal;
		recordProposal();
		// after recording minimum duration we improved our status and it is
		// worth analysing
		if (this.compareTo(other) < 0) {
			successful = true;
			analyse();
		}
		slotsManager = new FreeSlotsManager(freeSlots, possibleSlots, this);
		containsProposal = true;
	}

	public CalendarStatus(IEvent event, CalendarStatus other) {