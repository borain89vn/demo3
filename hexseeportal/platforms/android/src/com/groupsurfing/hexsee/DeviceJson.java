package com.groupsurfing.hexsee;

/**
 * Created by LeThuc on 8/19/2015.
 */


public class DeviceJson  {


    /**
     * deviceType :
     * appVersion :
     * osVersion :
     * installationId :
     * deviceId :
     */
    private String deviceType;
    private String appVersion;
    private String osVersion;
    private String installationId;
    private String deviceId;

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public void setInstallationId(String installationId) {
        this.installationId = installationId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public String getInstallationId() {
        return installationId;
    }

    public String getDeviceId() {
        return deviceId;
    }
}
