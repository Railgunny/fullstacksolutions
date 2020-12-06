
package com.appspot.analyser;

import java.io.IOException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;

import junit.framework.TestCase;

import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;

import com.appspot.datastore.PMF;
import com.appspot.datastore.SphereInfo;
import com.appspot.datastore.SphereName;
import com.appspot.datastore.UserProfile;
import com.appspot.datastore.UserProfileStore;

//Main class returning suggestions based on user's google calendar

@RunWith(Enclosed.class)
public class Analyser {
	//constants used in optimization process
	public static final double CONFIDENCE = 0.1;
	static final double ALTERNATIVE = 0.3;
	static final int TRIES = 20;
	private int maxDepth = 3;
	private int maxSuggestions = 3;
	private Map<SphereName, List<Proposal>> proposals;
	private List<IEvent> events;
	private static final Logger log = Logger.getLogger("EventStore");

	public Analyser() {
		//certain proposals to populate our database
		proposals = new HashMap<SphereName, List<Proposal>>();
		Calendar startDate = new GregorianCalendar(2000, 0, 3, 7, 0, 0);
		Calendar endDate = new GregorianCalendar(2000, 0, 3, 8, 30, 0);
		Pair<Calendar, Calendar> possibleSlot = new Pair<Calendar, Calendar>(startDate, endDate);
		Map<SphereName, Double> sphereInfluences = Utilities.generateSpheres(new double[] { 1.0 });
		Proposal p1 = new Proposal("Gym", "Nie ma upierdalania sja", null, null, 20, 60, false, true, sphereInfluences);
		p1.setPossibleTimeSlot(possibleSlot);
		p1.makePersistent();
		LinkedList<Proposal> health = new LinkedList<Proposal>();
		health.add(p1);
		proposals.put(SphereName.HEALTH, health);

		Calendar startWorkDate = new GregorianCalendar(2000, 0, 3, 17, 0, 0);
		Calendar endWorkDate = new GregorianCalendar(2000, 0, 3, 18, 30, 0);
		Pair<Calendar, Calendar> possibleWorkSlot = new Pair<Calendar, Calendar>(startWorkDate, endWorkDate);
		Map<SphereName, Double> sphereWorkInfluences = Utilities.generateSpheres(new double[] { 0, 1.0 });
		Proposal work = new Proposal("Meeting at work", "Szanuj szefa swego bo mozesz miec gorszego", null, null, 20, 60, false, true,
				sphereWorkInfluences);
		work.setPossibleTimeSlot(possibleWorkSlot);
		work.makePersistent();
		
		LinkedList<Proposal> works = new LinkedList<Proposal>();
		works.add(work);
		proposals.put(SphereName.WORK, works);

		Calendar startFamilyDate = new GregorianCalendar(2000, 0, 3, 15, 0, 0);
		Calendar endFamilyDate = new GregorianCalendar(2000, 0, 3, 16, 0, 0);
		Pair<Calendar, Calendar> possibleFamilySlot = new Pair<Calendar, Calendar>(startFamilyDate, endFamilyDate);
		Map<SphereName, Double> sphereFamilyInfluences = Utilities.generateSpheres(new double[] { 0.0, 0.0, 1.0 });
		Proposal family = new Proposal("Family dinner", "Steaks - all that matters", null, null, 20, 60, false, true, sphereFamilyInfluences);
		family.setPossibleTimeSlot(possibleFamilySlot);
		family.makePersistent();
		LinkedList<Proposal> families = new LinkedList<Proposal>();
		families.add(family);
		proposals.put(SphereName.FAMILY, families);

		Calendar startRecreationDate = new GregorianCalendar(2000, 0, 3, 22, 0, 0);
		Calendar endRecreationDate = new GregorianCalendar(2000, 0, 3, 23, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot = new Pair<Calendar, Calendar>(startRecreationDate, endRecreationDate);
		Map<SphereName, Double> sphereRecreationInfluences = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation = new Proposal("Watching a movie", "Robert Burneika box set!", null, null, 20, 60, false, true, sphereRecreationInfluences);
		recreation.setPossibleTimeSlot(possibleRecreationSlot);
		recreation.makePersistent();
		
		Calendar startRecreationDate2 = new GregorianCalendar(2000, 0, 3, 21, 0, 0);
		Calendar endRecreationDate2 = new GregorianCalendar(2000, 0, 3, 22, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot2 = new Pair<Calendar, Calendar>(startRecreationDate2, endRecreationDate2);
		Map<SphereName, Double> sph