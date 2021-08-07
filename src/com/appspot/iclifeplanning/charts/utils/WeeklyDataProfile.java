package com.appspot.iclifeplanning.charts.utils;

import java.util.HashMap;
import java.util.Map;

import javax.jdo.annotations.*;

import com.appspot.datastore.SphereName;

@PersistenceCapable
public class WeeklyDataProfile {
	
	@PrimaryKey
	@Persistent
	private String key;
	@Persistent
	private String userID;
	@Persistent
	private Integer weekNumber;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private HashMap<SphereName, Doub