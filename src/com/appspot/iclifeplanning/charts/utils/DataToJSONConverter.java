package com.appspot.iclifeplanning.charts.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.appspot.datastore.SphereName;

public class DataToJSONConverter
{
	// converts a map of string-double objects (or parsable to double) to a two dimension