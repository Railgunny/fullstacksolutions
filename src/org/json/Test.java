package org.json;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.io.StringWriter;

/**
 * Test class. This file is not formally a member of the org.json library.
 * It is just a casual test tool.
 */
public class Test {
	
    /**
     * Entry point.
     * @param args
     */
    public static void main(String args[]) {
        Iterator it;
        JSONArray a;
        JSONObject j;
        JSONStringer jj;
        Object o;
        String s;
        
/** 
 *  Obj is a typical class that implements JSONString. It also
 *  provides some beanie methods that can be used to 
 *  construct a JSONObject. It also demonstrates constructing
 *  a JSONObject with an array of names.
 */
        class Obj implements JSONString {
        	public String aString;
        	public double aNumber;
        	public boolean aBoolean;
        	
            public Obj(String string, double n, boolean b) {
                this.aString = string;
                this.aNumber = n;
                this.aBoolean = b;
            }
            
            public double getNumber() {
            	return this.aNumber;
            }
            
            public String getString() {
            	return this.aString;
            }
            
            public boolean isBoolean() {
            	return this.aBoolean;
            }
            
            public String getBENT() {
            	return "All uppercase key";
            }
            
            public String getX() {
            	return "x";
            }
            
            public String toJSONString() {
            	return "{" + JSONObject.quote(this.aString) + ":" + 
            	JSONObject.doubleToString(this.aNumber) + "}";
            }            
            public String toString() {
            	return this.getString() + " " + this.getNumber() + " " + 
            			this.isBoolean() + "." + this.getBENT() + " " + this.getX();
            }
        }      
        

    	Obj obj = new Obj("A beany object", 42, true);
        
        try {     
            s = "[0.1]";
            a = new JSONArray(s);
            System.out.println(a.toString());
            System.out.println("");
            
            j = XML.toJSONObject("<![CDATA[This is a collection of test patterns and examples for org.json.]]>  Ignore the stuff past the end.  ");
            System.out.println(j.toString());
            System.out.println("");
            
            j = new JSONObject();
      