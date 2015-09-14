/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.groupsurfing.hexsee;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.TextView;

import com.google.gson.Gson;
import com.groupsurfing.hexsee.receiverparse.ParseNotifier;
import com.groupsurfing.hexsee.utils.GKIMLog;
import com.groupsurfing.hexsee.utils.ParseInfo;

import org.apache.cordova.*;
import org.apache.cordova.splashscreen.SplashScreen;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends CordovaActivity
{
    public  final  String KEY_PNS="ParseInfo";
    private ParseNotifier parseNotifier = null;
    Bundle bundle;
    SharedPreferences prefs;

    String json=null;
    boolean isCreatedShortCut;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
      //  parseNotifier = new ParseNotifier();
        bundle = getIntent().getExtras();
        prefs= getSharedPreferences("shortcutPrefs", Context.MODE_PRIVATE);


        if(bundle!=null){
            ParseInfo parseInfo =bundle.getParcelable(KEY_PNS);
            String adventure_id=parseInfo.getAdventure_id();
            if( parseInfo!=null){
                if(adventure_id!=null)
                {
                    String url=launchUrl+"#/journal/"+adventure_id;
                        loadUrl(url);
                }
            }
        }else{
            loadUrl(launchUrl);
        }
    }

    @Override
    protected void onPause() {
        GKIMLog.lf(getApplicationContext(), 1, TAG + "=>onPause");
        super.onPause();
//        if (parseNotifier != null) {
//            unregisterReceiver(parseNotifier);
//        }
    }
    @Override
    protected void onResume() {
        GKIMLog.lf(getApplicationContext(), 1, TAG + "=>onResume");
        super.onResume();
        if (prefs.getBoolean("isShortCut", true)) {
            addShortcutIcon(this);
            prefs.edit().putBoolean("isShortCut", false).commit();
        }

    }

    private ParseNotifier.OnParseListener mParseNotierListener = new ParseNotifier.OnParseListener() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            GKIMLog.l(1, TAG + " onReceive pns");
            String action = intent.getAction();
            GKIMLog.l(1, TAG + "  action " + action);
            if (intent == null || intent.getExtras() == null) {
                return;
            }
            String json = intent.getExtras().getString(ParseNotifier.PARSE_EXTRA_DATA_KEY);
            GKIMLog.l(4, TAG + "  json " + json);
            try {

                JSONObject jsonObject = new JSONObject(json);
                if (jsonObject.has("alert")) {
                    String alert = jsonObject.getString("alert");
                    GKIMLog.l(4, "alert: " + alert);
                    AlertDialog dialog;
                    if (android.os.Build.VERSION.SDK_INT >= 11) {
                        dialog = new AlertDialog.Builder(MainActivity.this, android.R.style.Theme_Holo_Light_Dialog).create();
                    } else {
                        dialog = new AlertDialog.Builder(MainActivity.this, android.R.style.Theme_DeviceDefault_Light_Panel).create();
                    }
                    dialog.setCanceledOnTouchOutside(false);
                    dialog.setCancelable(false);
//					dialog.setTitle(getResources().getString(R.string.app_name));

                    dialog.setMessage(alert + "");
                    dialog.setButton(AlertDialog.BUTTON_NEGATIVE, getString(R.string.ok), new DialogInterface.OnClickListener() {

                        @Override
                        public void onClick(DialogInterface dialog, int arg1) {

                        }
                    });
//                    dialog.setButton(AlertDialog.BUTTON_POSITIVE, getString(R.string.cancel), new DialogInterface.OnClickListener() {
//
//                        @Override
//                        public void onClick(DialogInterface arg0, int arg1) {
//
//                        }
//                    });

                    if (!dialog.isShowing()) {
                        dialog.show();
                    }
                    if (dialog.isShowing()) {
                        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.argb(00, 255, 255, 255)));
                    }
//                    if (announcementId != null) {
//                        dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTag(announcementId);
//                    }
                    TextView messageView = (TextView)dialog.findViewById(android.R.id.message);
                    if (messageView != null) {
                        messageView.setGravity(Gravity.CENTER);
                    }
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };
    private void addShortcutIcon(Context context) {
        //shorcutIntent object
        Intent shortcutIntent = new Intent(context,
                MainActivity.class);

        shortcutIntent.setAction(Intent.ACTION_MAIN);
        //shortcutIntent is added with addIntent
        Intent addIntent = new Intent();
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_NAME, "Hexsee Mobile");
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE,
                Intent.ShortcutIconResource.fromContext(context,
                        R.drawable.icon));

        addIntent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");
        // finally broadcast the new Intent
        context.sendBroadcast(addIntent);
    }

}
