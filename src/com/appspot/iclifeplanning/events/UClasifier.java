package com.appspot.iclifeplanning.events;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.code.uclassify.client.UClassifyClient;
import com.google.code.uclassify.client.UClassifyClientFactory;
import com.uclassify.api._1.responseschema.Classification;
import com.uclassify.api._1.responseschema.Class;

public class UClasifier {
	private static final String USER_NAME = "iclifeplanning";
	private static final String READ_KEY = "JPP7UqHe3LbTTWnpuPpUUNK24SE";
	private static final String WRITE_KEY = "QQNFLRrBi2U5JL0fxFdzGadWg40";
	private static final String SPHERES_CLASIFIER = "Spheres";

	public static Map<String, Double