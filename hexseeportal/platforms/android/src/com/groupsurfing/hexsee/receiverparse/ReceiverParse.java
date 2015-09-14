package com.groupsurfing.hexsee.receiverparse;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.gson.Gson;
import com.groupsurfing.hexsee.MainActivity;
import com.groupsurfing.hexsee.utils.GKIMLog;
import com.groupsurfing.hexsee.utils.ParseInfo;
import com.parse.ParsePushBroadcastReceiver;

public class ReceiverParse extends ParsePushBroadcastReceiver {

    @Override
    protected void onPushOpen(Context context, Intent intent) {
        Bundle extras = intent.getExtras();
        Gson gson = new Gson();
        ParseInfo parseInfo = gson.fromJson(extras.getString("com.parse.Data"), ParseInfo.class);
        Intent mIntent = new Intent(context, MainActivity.class);
        mIntent.putExtra("ParseInfo", parseInfo);
        Class<? extends Activity> cls = getActivity(context, intent);
        mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(mIntent);
    }
} 
