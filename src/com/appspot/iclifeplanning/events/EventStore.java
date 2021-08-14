package com.appspot.iclifeplanning.events;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.appspot.datastore.UserProfile;
import com.appspot.datastore.UserProfileStore;
import com.appspot.iclifeplanning.authentication.AuthService;
import com.appspot.iclifeplanning.authentication.CalendarUtils;
import com.google.apphosting.api.UserServicePb.UserService;
import com.google.gdata.client.Query.CustomParameter;
import com.google.gdata.clie