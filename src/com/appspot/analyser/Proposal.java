package com.appspot.analyser;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.appspot.datastore.PMF;
import com.appspot.datastore.SphereName;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.gdata.data.calendar.CalendarEventEntry;


@PersistenceCapable
public class Proposal extends BaseCalendarSlot implements IEvent  {

	@NotPersistent
	private Boolean isRecurring;
	@NotPersistent
	private Boolean canReschedule;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private Map<SphereName, Double> spheres;
	@Persistent
	private SphereName majorSphere;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private Pair<Double, Double> durationInterval;
	@Persistent
	private Boolean disabled;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private Pair<Long, Long> possibleTimeSlot;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private Pair<Integer, Integer> possibleAge;

	public Proposal(