package com.groupsurfing.hexsee.utils;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by LeThuc on 8/21/2015.
 */
public class ParseInfo  implements Parcelable{

    /**
     * alert : new adventure test
     * action : com.groupsurfing.hexsee
     * adventure_id : d447eda9-19e7-4b51-8b3e-a23edce540b1
     * title : Hello every on
     * type_push : new_adventure
     */
    private String alert;
    private String action;
    private String adventure_id;
    private String title;
    private String type_push;

    public void setAlert(String alert) {
        this.alert = alert;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setAdventure_id(String adventure_id) {
        this.adventure_id = adventure_id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setType_push(String type_push) {
        this.type_push = type_push;
    }

    public String getAlert() {
        return alert;
    }

    public String getAction() {
        return action;
    }

    public String getAdventure_id() {
        return adventure_id;
    }

    public String getTitle() {
        return title;
    }

    public String getType_push() {
        return type_push;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.alert);
        dest.writeString(this.action);
        dest.writeString(this.adventure_id);
        dest.writeString(this.title);
        dest.writeString(this.type_push);
    }

    public ParseInfo() {
    }

    protected ParseInfo(Parcel in) {
        this.alert = in.readString();
        this.action = in.readString();
        this.adventure_id = in.readString();
        this.title = in.readString();
        this.type_push = in.readString();
    }

    public static final Creator<ParseInfo> CREATOR = new Creator<ParseInfo>() {
        public ParseInfo createFromParcel(Parcel source) {
            return new ParseInfo(source);
        }

        public ParseInfo[] newArray(int size) {
            return new ParseInfo[size];
        }
    };
}
