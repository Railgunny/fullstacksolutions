
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
		Map<SphereName, Double> sphereRecreationInfluences2 = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation2 = new Proposal("Beer with a friend", "Take 2KC with me", null, null, 20, 60, false, true, sphereRecreationInfluences2);
		recreation2.setPossibleTimeSlot(possibleRecreationSlot2);
		recreation2.makePersistent();
		
		Calendar startRecreationDate3 = new GregorianCalendar(2000, 0, 3, 21, 0, 0);
		Calendar endRecreationDate3 = new GregorianCalendar(2000, 0, 3, 22, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot3 = new Pair<Calendar, Calendar>(startRecreationDate3, endRecreationDate3);
		Map<SphereName, Double> sphereRecreationInfluences3 = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation3 = new Proposal("Poker session", "Royal flush - here I come", null, null, 20, 60, false, true, sphereRecreationInfluences3);
		recreation3.setPossibleTimeSlot(possibleRecreationSlot3);
		recreation3.makePersistent();
		
		Calendar startRecreationDate4 = new GregorianCalendar(2000, 0, 3, 20, 0, 0);
		Calendar endRecreationDate4 = new GregorianCalendar(2000, 0, 3, 21, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot4 = new Pair<Calendar, Calendar>(startRecreationDate4, endRecreationDate4);
		Map<SphereName, Double> sphereRecreationInfluences4 = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation4 = new Proposal("Go fly fishing", "Hope to catch a halibut :)", null, null, 20, 60, false, true, sphereRecreationInfluences4);
		recreation4.setPossibleTimeSlot(possibleRecreationSlot4);
		recreation4.makePersistent();
		
		Calendar startRecreationDate5 = new GregorianCalendar(2000, 0, 3, 20, 0, 0);
		Calendar endRecreationDate5 = new GregorianCalendar(2000, 0, 3, 20, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot5 = new Pair<Calendar, Calendar>(startRecreationDate5, endRecreationDate5);
		Map<SphereName, Double> sphereRecreationInfluences5 = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation5 = new Proposal("Afternoon nap", "Not taking any calls", null, null, 20, 60, false, true, sphereRecreationInfluences5);
		recreation5.setPossibleTimeSlot(possibleRecreationSlot5);
		recreation5.makePersistent();
		
		Calendar startRecreationDate6 = new GregorianCalendar(2000, 0, 3, 19, 0, 0);
		Calendar endRecreationDate6 = new GregorianCalendar(2000, 0, 3, 20, 30, 0);
		Pair<Calendar, Calendar> possibleRecreationSlot6 = new Pair<Calendar, Calendar>(startRecreationDate6, endRecreationDate6);
		Map<SphereName, Double> sphereRecreationInfluences6 = Utilities.generateSpheres(new dou