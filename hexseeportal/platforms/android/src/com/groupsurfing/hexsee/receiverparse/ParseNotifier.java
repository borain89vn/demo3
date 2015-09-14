/**
 * @author Nam.Nguyen
 * @Date:Dec 10, 2013
 */
package com.groupsurfing.hexsee.receiverparse;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.groupsurfing.hexsee.utils.GKIMLog;


/**

 * 
 */
public class ParseNotifier extends BroadcastReceiver {

	private static final String TAG = ParseNotifier.class.getSimpleName();
	public static final String ACTION = "com.groupsurfing.hexsee";
	public static final String PARSE_EXTRA_DATA_KEY = "com.parse.Data";
	public static final String PARSE_EXTRA_RESULT_KEY = "results";
	// build handler message for handling specified message to XTifyController.
	private OnParseListener mOnParseListener = null;

	public interface OnParseListener {
		void onReceive(Context context, Intent intent);
	}

	@Override
	public void onReceive(Context context, Intent intent) {

		GKIMLog.l(1, TAG + "onReceive: Has message for pns");
		if (mOnParseListener != null) {
			mOnParseListener.onReceive(context, intent);
		} else {
			GKIMLog.l(3, TAG + " mOnParseListener is nullllll");
		}
	}

	public static IntentFilter getParseNotifierReceiverIntentFilter() {
		return new IntentFilter(PARSE_EXTRA_DATA_KEY);
	}

	public void setOnParseListener(OnParseListener listener) {
		GKIMLog.l(1, TAG + " setOnParseListener");
		mOnParseListener = listener;
	}

}
