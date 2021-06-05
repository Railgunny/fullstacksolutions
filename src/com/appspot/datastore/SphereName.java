package com.appspot.datastore;

public enum SphereName {
	HEALTH {
		@Override
		public Double defaultValue() {
			return 0.25;
		}
	}, 
	WORK {
		@Override
		public Double defaultValue() {
			return 0.25;
		}
	}, 
	FAMILY {
		@Override
		public Double defaultValue() {
			retur