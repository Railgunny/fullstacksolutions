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
import com.google.gdata.data.calend