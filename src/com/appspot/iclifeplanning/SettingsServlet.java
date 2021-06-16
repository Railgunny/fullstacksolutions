package com.appspot.iclifeplanning;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appspot.datastore.SphereName;
import com.appspot.datastore.UserDesiredLifeBalance;
import com.appspot.datastore.UserDesiredLifeBalanceStore;
import com.appspot.datastore.UserProfile;
import com.appspot.datastore.UserProfileStore;
import com.appspot.iclifeplanning.authentication.AuthService;
import com.appspot.iclifeplanning.authentication.CalendarUtils;
import com.google.appengine.repackaged.com.google.protobuf.TextFormat.ParseException;
import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

/**
 * Settings servlet. 
 * 
 * @author Agnieszka Magda Madurska (amm208@doc.ic.ac.uk)
 * 
 */
@SuppressWarnings("serial")
public class SettingsServlet extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		JSONObject result = new JSONObject();
		String userID = AuthService.getAuthServiceInstance().getCurrentUserId();
		try {
			UserProfile up = UserProfileStore.getUserProfile(userID);
			HashMap<SphereName, Double> preferences = up.getSpherePreferences();
			long from = up.getStartOptimizing();
			long to = up.getFinishOptimizing();
			Calendar fromDate = new GregorianCalendar();
			fromDate.setTimeInMillis(from);
			Calendar toDate = new GregorianCalendar();
			toDate.setTimeInMillis(to);
			
			JSONArray preferencesArray = new JSONArray();
			JSONObject pref;
			for (Entry e : preferences.entrySet()) {
				pref = new JSONObject();
				pref.put("name",((SphereName) (e.getKey())).name().toLowerCase());
				pref.put("value","" + ((Double)e.getValue()*100) + "");
				preferencesArray.put(pref);
			}
			//result.put("userID", userID);
			result.put("fullOpt", "" + ((Boolean)up.wantsFullOpt()).toString().toUpperCase()+ "");
			result.put("spheresSettings", preferencesArray);
			result.put("fromDate", fromDate.get(Calendar.DAY_OF_MONTH) + "/" + 
					(int)(toDate.get(Calendar.MONTH) + 1) + "