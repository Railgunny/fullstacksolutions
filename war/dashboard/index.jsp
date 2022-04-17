
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.appspot.iclifeplanning.authentication.CalendarUtils" %>
<%@ page import="com.appspot.iclifeplanning.authentication.TokenException" %>

<%@ page import="java.lang.NullPointerException" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.net.URL" %>

<%
  UserService userService = UserServiceFactory.getUserService();
  CalendarUtils.setUpIfNewUser();
  //TODO: check if the token is there first:
  try {
    CalendarUtils.getCalendarUtils().setTokenFromReply(request.getQueryString());
  } catch (NullPointerException e) {
    //This is expected in most cases
  }

  String noTokenDiv = "<div id=\"calendar_div_toggle\"><a href=\"#\">Show calendar</a></div>";
  String calendars = "";

  try {
    Set<String> feeds = CalendarUtils.getCalendarUtils().getCalendarURLs();
    for(String url : feeds) {
      calendars += "&amp;src=" + url;
    }
  } catch (TokenException e) {
    noTokenDiv = "<div id=\"no_token\"><a href=\"" +
    CalendarUtils.getCalendarUtils().getCalendarAccessUrl(request.getRequestURL().toString()) +
    "\">Calendar not authorised! Please, follow this link.</a></div>";
  } catch (IOException e) {
    
  }
%>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <link rel="stylesheet" href="../css/main.css" type="text/css" media="screen">
    <link rel="stylesheet" href="../css/lavalamp3.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/co da-slider.css" type="text/css" media="screen" title="no title" charset="utf-8">