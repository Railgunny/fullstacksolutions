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
            j.put("JSONArray", new JSONArray());
            j.put("int", 57);
            j.put("double", 123456789012345678901234567890.);
            j.put("true", true);
            j.put("false", false);
            j.put("null", JSONObject.NULL);
            j.put("bool", "true");
            j.put("zero", -0.0);
            j.put("\\u2028", "\u2028");
            j.put("\\u2029", "\u2029");
            a = j.getJSONArray("foo");
            a.put(666);
            a.put(2001.99);
            a.put("so \"fine\".");
            a.put("so <fine>.");
            a.put(true);
            a.put(false);
            a.put(new JSONArray());
            a.put(new JSONObject());
            j.put("keys", JSONObject.getNames(j));
            System.out.println(j.toString(4));
            System.out.println(XML.toString(j));

            System.out.println("String: " + j.getDouble("String"));
            System.out.println("  bool: " + j.getBoolean("bool"));
            System.out.println("    to: " + j.getString("to"));
            System.out.println("  true: " + j.getString("true"));
            System.out.println("   foo: " + j.getJSONArray("foo"));
            System.out.println("    op: " + j.getString("op"));
            System.out.println("   ten: " + j.getInt("ten"));
            System.out.println("  oops: " + j.optBoolean("oops"));

            s = "<xml one = 1 two=' \"2\" '><five></five>First \u0009&lt;content&gt;<five></five> This is \"content\". <three>  3  </three>JSON does not preserve the sequencing of elements and contents.<three>  III  </three>  <three>  T H R E E</three><four/>Content text is an implied structure in XML. <six content=\"6\"/>JSON does not have implied structure:<seven>7</seven>everything is explicit.<![CDATA[CDATA blocks<are><supported>!]]></xml>";
            j = XML.toJSONObject(s);
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");
            
            ja = JSONML.toJSONArray(s);
            System.out.println(ja.toString(4));
            System.out.println(JSONML.toString(ja));
            System.out.println("");
            
            s = "<xml do='0'>uno<a re='1' mi='2'>dos<b fa='3'/>tres<c>true</c>quatro</a>cinqo<d>seis<e/></d></xml>";
            ja = JSONML.toJSONArray(s);
            System.out.println(ja.toString(4));
            System.out.println(JSONML.toString(ja));
            System.out.println("");

            s = "<mapping><empty/>   <class name = \"Customer\">      <field name = \"ID\" type = \"string\">         <bind-xml name=\"ID\" node=\"attribute\"/>      </field>      <field name = \"FirstName\" type = \"FirstName\"/>      <field name = \"MI\" type = \"MI\"/>      <field name = \"LastName\" type = \"LastName\"/>   </class>   <class name = \"FirstName\">      <field name = \"text\">         <bind-xml name = \"text\" node = \"text\"/>      </field>   </class>   <class name = \"MI\">      <field name = \"text\">         <bind-xml name = \"text\" node = \"text\"/>      </field>   </class>   <class name = \"LastName\">      <field name = \"text\">         <bind-xml name = \"text\" node = \"text\"/>      </field>   </class></mapping>";
            j = XML.toJSONObject(s);

            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");
            ja = JSONML.toJSONArray(s);
            System.out.println(ja.toString(4));
            System.out.println(JSONML.toString(ja));
            System.out.println("");

            j = XML.toJSONObject("<?xml version=\"1.0\" ?><Book Author=\"Anonymous\"><Title>Sample Book</Title><Chapter id=\"1\">This is chapter 1. It is not very long or interesting.</Chapter><Chapter id=\"2\">This is chapter 2. Although it is longer than chapter 1, it is not any more interesting.</Chapter></Book>");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = XML.toJSONObject("<!DOCTYPE bCard 'http://www.cs.caltech.edu/~adam/schemas/bCard'><bCard><?xml default bCard        firstname = ''        lastname  = '' company   = '' email = '' homepage  = ''?><bCard        firstname = 'Rohit'        lastname  = 'Khare'        company   = 'MCI'        email     = 'khare@mci.net'        homepage  = 'http://pest.w3.org/'/><bCard        firstname = 'Adam'        lastname  = 'Rifkin'        company   = 'Caltech Infospheres Project'        email     = 'adam@cs.caltech.edu'        homepage  = 'http://www.cs.caltech.edu/~adam/'/></bCard>");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = XML.toJSONObject("<?xml version=\"1.0\"?><customer>    <firstName>        <text>Fred</text>    </firstName>    <ID>fbs0001</ID>    <lastName> <text>Scerbo</text>    </lastName>    <MI>        <text>B</text>    </MI></customer>");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = XML.toJSONObject("<!ENTITY tp-address PUBLIC '-//ABC University::Special Collections Library//TEXT (titlepage: name and address)//EN' 'tpspcoll.sgm'><list type='simple'><head>Repository Address </head><item>Special Collections Library</item><item>ABC University</item><item>Main Library, 40 Circle Drive</item><item>Ourtown, Pennsylvania</item><item>17654 USA</item></list>");
            System.out.println(j.toString());
            System.out.println(XML.toString(j));
            System.out.println("");

            j = XML.toJSONObject("<test intertag status=ok><empty/>deluxe<blip sweet=true>&amp;&quot;toot&quot;&toot;&#x41;</blip><x>eks</x><w>bonus</w><w>bonus2</w></test>");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = HTTP.toJSONObject("GET / HTTP/1.0\nAccept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, application/vnd.ms-powerpoint, application/vnd.ms-excel, application/msword, */*\nAccept-Language: en-us\nUser-Agent: Mozilla/4.0 (compatible; MSIE 5.5; Windows 98; Win 9x 4.90; T312461; Q312461)\nHost: www.nokko.com\nConnection: keep-alive\nAccept-encoding: gzip, deflate\n");
            System.out.println(j.toString(2));
            System.out.println(HTTP.toString(j));
            System.out.println("");

            j = HTTP.toJSONObject("HTTP/1.1 200 Oki Doki\nDate: Sun, 26 May 2002 17:38:52 GMT\nServer: Apache/1.3.23 (Unix) mod_perl/1.26\nKeep-Alive: timeout=15, max=100\nConnection: Keep-Alive\nTransfer-Encoding: chunked\nContent-Type: text/html\n");
            System.out.println(j.toString(2));
            System.out.println(HTTP.toString(j));
            System.out.println("");

            j = new JSONObject("{nix: null, nux: false, null: 'null', 'Request-URI': '/', Method: 'GET', 'HTTP-Version': 'HTTP/1.0'}");
            System.out.println(j.toString(2));
            System.out.println("isNull: " + j.isNull("nix"));
            System.out.println("   has: " + j.has("nix"));
            System.out.println(XML.toString(j));
            System.out.println(HTTP.toString(j));
            System.out.println("");

            j = XML.toJSONObject("<?xml version='1.0' encoding='UTF-8'?>"+"\n\n"+"<SOAP-ENV:Envelope"+
              " xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\""+
              " xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\""+
              " xmlns:xsd=\"http://www.w3.org/1999/XMLSchema\">"+
              "<SOAP-ENV:Body><ns1:doGoogleSearch"+
              " xmlns:ns1=\"urn:GoogleSearch\""+
              " SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">"+
              "<key xsi:type=\"xsd:string\">GOOGLEKEY</key> <q"+
              " xsi:type=\"xsd:string\">'+search+'</q> <start"+
              " xsi:type=\"xsd:int\">0</start> <maxResults"+
              " xsi:type=\"xsd:int\">10</maxResults> <filter"+
              " xsi:type=\"xsd:boolean\">true</filter> <restrict"+
              " xsi:type=\"xsd:string\"></restrict> <safeSearch"+
              " xsi:type=\"xsd:boolean\">false</safeSearch> <lr"+
              " xsi:type=\"xsd:string\"></lr> <ie"+
              " xsi:type=\"xsd:string\">latin1</ie> <oe"+
              " xsi:type=\"xsd:string\">latin1</oe>"+
              "</ns1:doGoogleSearch>"+
              "</SOAP-ENV:Body></SOAP-ENV:Envelope>");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = new JSONObject("{Envelope: {Body: {\"ns1:doGoogleSearch\": {oe: \"latin1\", filter: true, q: \"'+search+'\", key: \"GOOGLEKEY\", maxResults: 10, \"SOAP-ENV:encodingStyle\": \"http://schemas.xmlsoap.org/soap/encoding/\", start: 0, ie: \"latin1\", safeSearch:false, \"xmlns:ns1\": \"urn:GoogleSearch\"}}}}");
            System.out.println(j.toString(2));
            System.out.println(XML.toString(j));
            System.out.println("");

            j = CookieList.toJSONObject("  f%oo = b+l=ah  ; o;n%40e = t.wo ");
            System.out.println(j.toString(2));
            System.out.println(CookieList.toString(j));
            System.out.println("");

            j = Cookie.toJSONObject("f%oo=blah; secure ;expires = April 24, 2002");
            System.out.println(j.toString(2));
            System.out.println(Cookie.toString(j));
            System.out.println("");

            j = new JSONObject("{script: 'It is not allowed in HTML to send a close script tag in a string<script>because it confuses browsers</script>so we insert a backslash before the /'}");
            System.out.println(j.toString());
            System.out.println("");

            JSONTokener jt = new JSONTokener("{op:'test', to:'session', pre:1}{op:'test', to:'session', pre:2}");
            j = new JSONObject(jt);
            System.out.println(j.toString());
            System.out.println("pre: " + j.optInt("pre"));
            int i = jt.skipTo('{');
            System.out.println(i);
            j = new JSONObject(jt);
            System.out.println(j.toString());
            System.out.println("");

            a = CDL.toJSONArray("Comma delimited list test, '\"Strip\"Quotes', 'quote, comma', No quotes, 'Single Quotes', \"Double Quotes\"\n1,'2',\"3\"\n,'It is \"good,\"', \"It works.\"\n\n");

            s = CDL.toString(a);
            System.out.println(s);
            System.out.println("");
            System.out.println(a.toString(4));
            System.out.println("");
            a = CDL.toJSONArray(s);
            System.out.println(a.toString(4));
            System.out.println("");

            a = new JSONArray(" [\"<escape>\", next is an implied null , , ok,] ");
            System.out.println(a.toString());
            System.out.println("");
            System.out.println(XML.toString(a));
            System.out.println("");

            j = new JSONObject("{ fun => with non-standard forms ; forgiving => This package can be used to parse formats tha