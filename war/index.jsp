<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>

<%
  UserService userService = UserServiceFactory.getUserService();
  String signupUrl = "";

  if (userService.isUserLoggedIn()) {
    response.sendRedirect("/dashboard/index.jsp");
  } else {
    signupUrl = userService.createLoginURL("/dashboard/index.jsp");
  }
%>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <link rel="stylesheet" href="css/main.css" type="text/css" medi