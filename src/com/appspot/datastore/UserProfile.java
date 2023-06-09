
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

	public void setStartOptimizing(Long startOptimizing) {
		this.startOptimizing = startOptimizing;
	}

	public Long getFinishOptimizing() {
		return finishOptimizing;
	}

	public void setFinishOptimizing(Long finishOptimizing) {
		this.finishOptimizing = finishOptimizing;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		//add checks and throw exception
		this.email = email;
	}

	public boolean isFullyOptimized() {
		return fullyOptimized;
	}

	public void setFullyOptimized(boolean fullyOptimized) {
		this.fullyOptimized = fullyOptimized;
	}

	public String getUserID() {
		return userID;
	}

	public String getName() {
		return nickname;
	}

	public long getJoinTime() {
		return joinTime;
	}

	public HashMap<SphereName, Double> getSpherePreferences() {
		return spherePreferences;
	}	

	public String toString() {
		String res = getUserID() + " nick: " + nickname + " email: " + getEmail() +"\n";
		res = res.concat("Sphere Choices: \n");
		for(SphereName name : spherePreferences.keySet()){
			res = res.concat(name.toString() + " : " + spherePreferences.get(name) + "\n");
		}
		return res;
	}

	public void setSpherePreferences(HashMap<SphereName, Double> spherePreferences2) {
		spherePreferences = spherePreferences2;
	}

	public boolean wantsFullOpt(){
		return fullyOptimized;
	}
}