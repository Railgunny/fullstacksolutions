
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
		Map<SphereName, Double> sphereRecreationInfluences6 = Utilities.generateSpheres(new double[] { 0.0, 0.0, 0.0, 1.0 });
		Proposal recreation6 = new Proposal("Have a smoke", "Co mowi palma do palmy? Za palmy!", null, null, 20, 60, false, true, sphereRecreationInfluences6);
		recreation6.setPossibleTimeSlot(possibleRecreationSlot6);
		recreation6.makePersistent();
		
		
		LinkedList<Proposal> recreations = new LinkedList<Proposal>();
		recreations.add(recreation);
		recreations.add(recreation2);
		recreations.add(recreation3);
		//recreations.add(recreation4);
		//recreations.add(recreation5);
		//recreations.add(recreation6);
		proposals.put(SphereName.RECREATION, recreations);
	}

	@SuppressWarnings("unchecked")
	public List<List<Suggestion>> getSuggestions(List<? extends IEvent> events, String currentUserId) throws IOException {
		UserProfile profile = UserProfileStore.getUserProfile(currentUserId);
		this.events = (List<IEvent>) events;
		return
		 convertToSuggestions(this.getSuggestions(profile.getSpherePreferences(),
		 profile.isFullyOptimized()));
	}
	
	//Method returning sets of sugestions to the user
	private List<List<CalendarStatus>> getSuggestions(Map<SphereName, Double> spherePreferences, boolean optimizeFull) throws IOException {
		//no events in calendar...
		if (events.size() == 0)
			return null;
		LinkedList<List<CalendarStatus>> result = new LinkedList<List<CalendarStatus>>();
		//Generate initial calendar status
		CalendarStatus start = checkGoals(events, spherePreferences);
		//Already within our goals...
		if (isCloseEnough(start, optimizeFull))
			return result;
		removeStaticEvents(events);
		//generate virtual calendars for each event and proposal in our database
		List<CalendarStatus> statuses = Utilities.merge( generateProposalStatuses(start.getDeficitSpheres(optimizeFull), start, true) , 
				generateEventStatuses(events, start)
				);
		if (statuses.isEmpty())
			return result;
		for (int i = 0; result.size() < maxSuggestions && i < statuses.size(); i++) {
			LinkedList<CalendarStatus> list = new LinkedList<CalendarStatus>();
			CalendarStatus nextMin = statuses.get(i);
			CalendarStatus nextStatus = nextMin;
			//remove event form our list, so that we won't schedule same thing twice
			removeEvent(nextMin);
			int count = 1;
			int k = i + 1;
			List<CalendarStatus> alternatives = new LinkedList<CalendarStatus>();
			alternatives.add(nextStatus);
			/* Check if any of the neighbours can become an alternative for our min event
			 * It needs to have almost same influence on the calendar and belong to same sphere
			 */
			while (k < statuses.size() && count < 3) {
				CalendarStatus next = statuses.get(k);
				if (next.compareTo(start) > 0
						|| (next.getCoefficient() > 0.05 && next.getCoefficient() > nextMin.getCoefficient() * (1 + Analyser.ALTERNATIVE)))
					break;
				SphereName mine;
				SphereName nextSphere;
				//checking of major spheres
				if (nextStatus.containsProposal())
					mine = ((Proposal) nextStatus.getEvent()).getMajorSphere();
				else
					mine = Utilities.calculateMajorSphere(nextStatus.getEvent());
				if(next.containsProposal())
					nextSphere = ((Proposal) next.getEvent()).getMajorSphere();
				else
					nextSphere = Utilities.calculateMajorSphere(next.getEvent());
				if(!mine.equals(nextSphere)){
					k++;
					continue;
				}
				removeEvent(next);
				statuses.remove(next);
				alternatives.add(next);
				//Our next status to be passed down will contain proposal
				if (!nextStatus.containsProposal() && next.containsProposal())
					nextStatus = next;
				count++;
			}
			alternatives.remove(nextStatus);
			nextStatus.addAlternatives(alternatives);
			nextStatus.updateSlots();
			List<CalendarStatus> rest = getSuggestions(nextStatus, optimizeFull, maxDepth);
			if (rest != null) {
				//peroform recalculation to improve our calendar based on what we have just scheduled
				CalendarStatus toChange = rest.remove(0);
				CalendarStatus changed = rest.remove(0);
				int reps = 0;
				do {
					Pair<List<CalendarStatus>, List<CalendarStatus>> res = toChange.recalculate(changed);
					List<CalendarStatus> successes = res.getFirst();
					CalendarStatus best = successes.remove(0);
					best.addAlternatives(successes);
					toChange = best;
					CalendarStatus tmp = toChange;
					toChange = changed;
					changed = tmp;
					reps++;
				} while (changed.hasImproved());
				list.addAll(rest);
				//return events in the correct order
				if (reps % 2 == 1) {
					list.addFirst(toChange);
					list.addFirst(changed);
					restoreEvents(changed);
				} else {
					list.addFirst(changed);
					list.addFirst(toChange);
					restoreEvents(toChange);
				}
			}
			else {
				list.add(nextStatus);
				restoreEvents(nextStatus);
			}
			result.add(list);
		}
		return result;
	}
	
	//Recursive function generating new suggestion considering what we chose before
	private List<CalendarStatus> getSuggestions(CalendarStatus currentStatus, boolean optimizeFull, int depth) throws IOException {
		if (isCloseEnough(currentStatus, optimizeFull) || (events.size() == 0 && !haveAnyProposals()) || depth <= 0)
			return null;
		//generate calendars with virtually scheduled events again, pick minimum and find its alternatives
		List<CalendarStatus> statuses = Utilities.merge(generateProposalStatuses(currentStatus.getDeficitSpheres(optimizeFull), currentStatus, false) ,
				generateEventStatuses(events,currentStatus) );

		if (statuses.isEmpty())
			return null;
		LinkedList<CalendarStatus> list = new LinkedList<CalendarStatus>();
		CalendarStatus nextMin = statuses.get(0);

		CalendarStatus nextStatus = nextMin;
		removeEvent(nextMin);
		int i = 1;
		int count = 1;
		List<CalendarStatus> alternatives = new LinkedList<CalendarStatus>();
		alternatives.add(nextStatus);
		//Find alternatives
		while (i < statuses.size() && count < 3) {
			CalendarStatus next = statuses.get(i);
			if (next.compareTo(currentStatus) > 0
					|| (next.getCoefficient() > 0.05 && next.getCoefficient() > nextMin.getCoefficient() * (1 + Analyser.ALTERNATIVE)))
				break;
			SphereName mine;
			SphereName nextSphere;
			if (nextStatus.containsProposal())
				mine = ((Proposal) nextStatus.getEvent()).getMajorSphere();
			else
				mine = Utilities.calculateMajorSphere(nextStatus.getEvent());
			if(next.containsProposal())
				nextSphere = ((Proposal) next.getEvent()).getMajorSphere();
			else
				nextSphere = Utilities.calculateMajorSphere(next.getEvent());
			if(!mine.equals(nextSphere)){
				i++;
				continue;
			}
			removeEvent(next);
			statuses.remove(next);
			alternatives.add(next);
			if(!nextStatus.containsProposal() && next.containsProposal())
			 nextStatus = next;
			count++;
		}
		alternatives.remove(nextStatus);
		nextStatus.addAlternatives(alternatives);
		nextStatus.updateSlots();
		
		CalendarStatus toChange = currentStatus;
		CalendarStatus changed = nextStatus;
		List<CalendarStatus> removed = new LinkedList<Calendar