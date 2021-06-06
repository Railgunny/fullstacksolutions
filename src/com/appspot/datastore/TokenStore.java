package com.appspot.datastore;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;

public class TokenStore {

	public static String getToken(String id) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Token token = pm.getObjectById(Token.class, id);

			retur