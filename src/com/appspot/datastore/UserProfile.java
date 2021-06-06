
package com.appspot.datastore;

import java.util.HashMap;
import java.util.Map;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class UserProfile extends BaseDataObject {

	@Persistent
	@PrimaryKey
	private String userID;
	@Persistent
	private String nickname;
	@Persistent
	private String email;
	@Persistent(serialized="true", defaultFetchGroup = "true")
	private HashMap<SphereName, Double> spherePreferences;
	@Persistent
	private boolean fullyOptimized;
	@Persistent
	private Long joinTime;
	@Persistent
	private Long startOptimizing;
	@Persistent
	private Long finishOptimizing;

	public UserProfile(String userID, String name, String email, 
			HashMap<SphereName, Double> spherePreferences, boolean fullyOptimized, 
			long joinTime, long startOptimizing, long finishOptimizing) {
		super();
		this.userID = userID;
		this.nickname = name;
		this.email = email;
		this.spherePreferences = spherePreferences;
		this.fullyOptimized = fullyOptimized;
		this.joinTime = joinTime;
		this.startOptimizing = startOptimizing;
		this.finishOptimizing = finishOptimizing;
	}

	public Long getStartOptimizing() {
		return startOptimizing;
	}
