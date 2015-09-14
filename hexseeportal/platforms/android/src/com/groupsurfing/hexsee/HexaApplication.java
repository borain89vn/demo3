package com.groupsurfing.hexsee;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseInstallation;

/**
 * Created by LeThuc on 8/19/2015.
 */
public class HexaApplication extends Application {
    public String APP_ID_P = "mrDfvMvUIBud6lFymIwAiYOjCuVvVwTtDqN7Vxfo"; //Parse dev Anh PKT
    public String CLIENT_ID_P = "NRIgKZggwbgUji6wvaS1CR6BRUGTOnyPMlxqsejy";
    @Override
    public void onCreate() {
        super.onCreate();
        Log.e("HexaApplication", "HexaApplication");
        Parse.initialize(this, APP_ID_P, CLIENT_ID_P);
        ParseInstallation.getCurrentInstallation().saveInBackground();


    }
}
