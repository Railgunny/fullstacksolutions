package com.appspot.iclifeplanning.charts;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.appspot.datastore.SphereName;
import com.appspot.datastore.UserProfile;
import com.appspot.datastore.UserProfileStore;
import com.appspot.iclifeplanning.charts.utils.DataToJSONConverter;
import com.appspot.iclifeplanning.charts.utils.WeeklyDataProfile;
import com.appspot.iclifeplanning.charts.utils.WeeklyDataProfileStore;

@SuppressWarnings("serial")
public class SpheresHistoryServlet extends HttpServlet
{

	public void doGet(HttpServletRequest request_, HttpServletResponse response_)
			throws IOException
	{
		String userID = request_.getParameter("userName");
		UserProfile userProfile = UserProfileStore.getUserProfile(userID);
		if(userProfile==null)
		{
			return;
		}
		// Get data for all weeks
		List<WeeklyDataProfile> listOfAllWeeks = WeeklyDataProfileStore.getUserWeeklyDataProfiles(userID);
		if(listOfAllWeeks == null || listOfAllWeeks.size()==0)
		{
			return;
		}
		// Extract names of spheres from the first week entry
		Set<SphereName> sphereNamesSet = listOfAllWeeks.get(0).getSphereResults().keySet();
		int numberOfSpheres = sphereNamesSet.size();
		SphereName[] sphereNames = new SphereName[numberOfSpheres];
		// Put names of spheres in an array
		int pos = 0;
		for(SphereName s : sphereNamesSet)
		{
			sphereNames[pos] = s;
			pos++;
		}

		// Two-dimensional array holding weekly data for each sphere. Data for sphere with name
		/