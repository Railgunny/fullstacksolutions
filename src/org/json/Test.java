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
            o = null;
            j.put("booga", o);
            j.put("wooga", JSONObject.NULL);
            System.out.println(j.toString());
            System.out.println("");
           
            j = new JSONObject();
            j.increment("two");
            j.increment("two");
            System.out.println(j.toString());
            System.out.println("");
            
            
            s = "<test><blank></blank><empty/></test>";
            j = XML.toJSONObject(s);
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            s = "{     \"list of lists\" : [         [1, 2, 3],         [4, 5, 6],     ] }";
            j = new JSONObject(s);
            System.out.println(j.toString(4));
            System.out.println(XML.toString(j));
                    
            s = "<recipe name=\"bread\" prep_time=\"5 mins\" cook_time=\"3 hours\"> <title>Basic bread</title> <ingredient amount=\"8\" unit=\"dL\">Flour</ingredient> <ingredient amount=\"10\" unit=\"grams\">Yeast</ingredient> <ingredient amount=\"4\" unit=\"dL\" state=\"warm\">Water</ingredient> <ingredient amount=\"1\" unit=\"teaspoon\">Salt</ingredient> <instructions> <step>Mix all ingredients together.</step> <step>Knead thoroughly.</step> <step>Cover with a cloth, and leave for one hour in warm room.</step> <step>Knead again.</step> <step>Place in a bread baking tin.</step> <step>Cover with a cloth, and leave for one hour in warm room.</step> <step>Bake in the oven at 180(degrees)C for 30 minutes.</step> </instructions> </recipe> ";
            j = XML.toJSONObject(s);
            System.out.println(j.toString(4));
            System.out.println();
            
            j = JSONML.toJSONObject(s);
            System.out.println(j.toString());
            System.out.println(JSONML.toString(j));
            System.out.println();
            
            a = JSONML.toJSONArray(s);
            System.out.println(a.toString(4));
            System.out.println(JSONML.toString(a));
            System.out.println();
            
            s = "<div id=\"demo\" class=\"JSONML\"><p>JSONML is a transformation between <b>JSON</b> and <b>XML</b> that preserves ordering of document features.</p><p>JSONML can work with JSON arrays or JSON objects.</p><p>Three<br/>little<br/>words</p></div>";
            j = JSONML.toJSONObject(s);
            System.out.println(j.toString(4));
            System.out.println(JSONML.toString(j));
            System.out.println();
            
            a = JSONML.toJSONArray(s);
            System.out.println(a.toString(4));
            System.out.println(JSONML.toString(a));
            System.out.println();
            
            s = "<person created=\"2006-11-11T19:23\" modified=\"2006-12-31T23:59\">\n <firstName>Robert</firstName>\n <lastName>Smith</lastName>\n <address type=\"home\">\n <street>12345 Sixth Ave</street>\n <city>Anytown</city>\n <state>CA</state>\n <postalCode>98765-4321</postalCode>\n </address>\n </person>";
            j = XML.toJSONObject(s);
            System.out.println(j.toString(4));
            
            j = new JSONObject(obj);
            System.out.println(j.toString());
            
            s = "{ \"entity\": { \"imageURL\": \"\", \"name\": \"IXXXXXXXXXXXXX\", \"id\": 12336, \"ratingCount\": null, \"averageRating\": null } }";
            j = new JSONObject(s);
            System.out.println(j.toString(2));

            jj = new JSONStringer();
            s = jj
	            .object()
	                .key("single")
	                .value("MARIE HAA'S")
	                .key("Johnny")
	                .value("MARIE HAA\\'S")
	                .key("foo")
	                .value("bar")
	                .key("baz")
	                .array()
	                    .object()
	                        .key("quux")
	                        .value("Thanks, Josh!")
	                    .endObject()
	                .endArray()
	                .key("obj keys")
	                .value(JSONObject.getNames(obj))
	            .endObject()
            .toString();
            System.out.println(s);

            System.out.println(new JSONStringer()
                .object()
                	.key("a")
                	.array()
                		.array()
                			.array()
                				.value("b")
                            .endArray()
                        .endArray()
                    .endArray()
                .endObject()
                .toString());

            jj = new JSONStringer();
            jj.array();
            jj.value(1);
            jj.array();
            jj.value(null);
            jj.array();
            jj.object();
            jj.key("empty-array").array().endArray();
            jj.key("answer").value(42);
            jj.key("null").value(null);
            jj.key("false").value(false);
            jj.key("true").value(true);
            jj.key("big").value(123456789e+88);
            jj.key("small").value(123456789e-88);
            jj.key("empty-object").object().endObject();
            jj.key("long");
            jj.value(9223372036854775807L);
            jj.endObject();
            jj.value("two");
            jj.endArray();
            jj.value(true);
            jj.endArray();
            jj.value(98.6);
            jj.value(-100.0);
            jj.object();
            jj.endObject();
            jj.object();
            jj.key("one");
            jj.value(1.00);
            jj.endObject();
            jj.value(obj);
            jj.endArray();
            System.out.println(jj.toString());

            System.out.println(new JSONArray(jj.toString()).toString(4));

        	int ar[] = {1, 2, 3};
        	JSONArray ja = new JSONArray(ar);
        	System.out.println(ja.toString());
        	
        	String sa[] = {"aString", "aNumber", "aBoolean"};            
            j = new JSONObject(obj, sa);
            j.put("Testing JSONString interface", obj);
            System.out.println(j.toString(4));          
            
            j = new JSONObject("{slashes: '///', closetag: '</script>', backslash:'\\\\', ei: {quotes: '\"\\''},eo: {a: '\"quoted\"', b:\"don't\"}, quotes: [\"'\", '\"']}");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = new JSONObject(
                "{foo: [true, false,9876543210,    0.0, 1.00000001,  1.000000000001, 1.00000000000000001," +
                " .00000000000000001, 2.00, 0.1, 2e100, -32,[],{}, \"string\"], " +
                "  to   : null, op : 'Good'," +
                "ten:10} postfix comment");
            j.put("String", "98.6");
            j.put("JSONObject", new JSONObject());