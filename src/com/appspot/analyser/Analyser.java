
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
	static final int 