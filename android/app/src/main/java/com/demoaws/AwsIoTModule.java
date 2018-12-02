package com.demoaws;

import android.util.Log;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.iot.AWSIotKeystoreHelper;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttClientStatusCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttManager;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttNewMessageCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttQos;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.iot.AWSIotClient;
import com.amazonaws.services.iot.model.AttachPrincipalPolicyRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.UUID;

import javax.annotation.Nullable;

public class AwsIoTModule extends ReactContextBaseJavaModule {

    static final String LOG_TAG = "AwsIoT Module";
    // IoT endpoint
    // AWS Iot CLI describe-endpoint call returns: XXXXXXXXXX.iot.<region>.amazonaws.com
    private static final String CUSTOMER_SPECIFIC_ENDPOINT = "a1h7ns6fsx2bpe-ats.iot.ap-southeast-1.amazonaws.com";//string

    // --- Constants to modify per your configuration ---
    // Cognito pool ID. For this app, pool needs to be unauthenticated pool with
    // AWS IoT permissions.
    private static final String COGNITO_POOL_ID = "ap-southeast-1:5337c71a-6c6d-4db0-ad90-5927e9f8f1cf";//string
    // Name of the AWS IoT policy to attach to a newly created certificate
    private static final String AWS_IOT_POLICY_NAME = "iotesp8266policy";//String
    // Region of AWS IoT
    private static final Regions MY_REGION = Regions.AP_SOUTHEAST_1;//enum
    // Filename of KeyStore file on the filesystem
    private static final String KEYSTORE_NAME = "debug.keystore";//string
    // Password for the private key in the KeyStore
    private static final String KEYSTORE_PASSWORD = "android";//string
    // Certificate and key aliases in the KeyStore
    private static final String CERTIFICATE_ID = "6061c7ea3e330934e45de94989bfe4113cf4ad64d6e119bfd11af17f82a07491";//string
    AWSIotClient mIotAndroidClient;
    AWSIotMqttManager mqttManager;
    String clientId;
    String keystorePath;
    String keystoreName;
    String keystorePassword;
    KeyStore clientKeyStore = null;
    String certificateId;
    ArrayList<String> topicList = new ArrayList<>();
    CognitoCachingCredentialsProvider credentialsProvider;
    private ReactApplicationContext reactContext;

    public AwsIoTModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        clientId = UUID.randomUUID().toString();
    }


    @Override
    public String getName() {
        return "IoTModule";
    }

    @ReactMethod
    public void initializeAWSMqtt() {
        Log.v("Initialize ", "AwsMqtt");
        // Initialize the AWS Cognito credentials provider
        credentialsProvider = new CognitoCachingCredentialsProvider(
                reactContext.getApplicationContext(), // context
                COGNITO_POOL_ID, // Identity Pool ID
                MY_REGION // Region
        );

        // MQTT Client
        mqttManager = new AWSIotMqttManager(clientId, CUSTOMER_SPECIFIC_ENDPOINT);
        Region region = Region.getRegion(MY_REGION);
        // IoT Client (for creation of certificate if needed)
        mIotAndroidClient = new AWSIotClient(credentialsProvider);
        mIotAndroidClient.setRegion(region);

        keystorePath = reactContext.getFilesDir().getPath();
        keystoreName = KEYSTORE_NAME;
        keystorePassword = KEYSTORE_PASSWORD;
        certificateId = CERTIFICATE_ID;

        // To load cert/key from keystore on filesystem
        try {
            if (AWSIotKeystoreHelper.isKeystorePresent(keystorePath, keystoreName)) {
                if (AWSIotKeystoreHelper.keystoreContainsAlias(certificateId, keystorePath,
                        keystoreName, keystorePassword)) {
                    Log.i(LOG_TAG, "Certificate " + certificateId
                            + " found in keystore - using for MQTT.");
                    // load keystore from file into memory to pass on connection
                    clientKeyStore = AWSIotKeystoreHelper.getIotKeystore(certificateId,
                            keystorePath, keystoreName, keystorePassword);
                } else {
                    Log.i(LOG_TAG, "Key/cert " + certificateId + " not found in keystore.");
                }
            } else {
                Log.i(LOG_TAG, "Keystore " + keystorePath + "/" + keystoreName + " not found.");
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, "An error occurred retrieving cert/key from keystore.", e);
        }

        if (clientKeyStore == null) {
            Log.i(LOG_TAG, "Cert/key was not found in keystore - creating new key and certificate.");

            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        // Create a new private key and certificate. This call
                        // creates both on the server and returns them to the
                        // device.
                        CreateKeysAndCertificateRequest createKeysAndCertificateRequest =
                                new CreateKeysAndCertificateRequest();
                        createKeysAndCertificateRequest.setSetAsActive(true);
                        final CreateKeysAndCertificateResult createKeysAndCertificateResult;
                        createKeysAndCertificateResult =
                                mIotAndroidClient.createKeysAndCertificate(createKeysAndCertificateRequest);
                        Log.i(LOG_TAG,
                                "Cert ID: " +
                                        createKeysAndCertificateResult.getCertificateId() +
                                        " created.");

                        // store in keystore for use in MQTT client
                        // saved as alias "default" so a new certificate isn't
                        // generated each run of this application
                        AWSIotKeystoreHelper.saveCertificateAndPrivateKey(certificateId,
                                createKeysAndCertificateResult.getCertificatePem(),
                                createKeysAndCertificateResult.getKeyPair().getPrivateKey(),
                                keystorePath, keystoreName, keystorePassword);

                        // load keystore from file into memory to pass on
                        // connection
                        clientKeyStore = AWSIotKeystoreHelper.getIotKeystore(certificateId,
                                keystorePath, keystoreName, keystorePassword);

                        // Attach a policy to the newly created certificate.
                        // This flow assumes the policy was already created in
                        // AWS IoT and we are now just attaching it to the
                        // certificate.
                        AttachPrincipalPolicyRequest policyAttachRequest =
                                new AttachPrincipalPolicyRequest();
                        policyAttachRequest.setPolicyName(AWS_IOT_POLICY_NAME);
                        policyAttachRequest.setPrincipal(createKeysAndCertificateResult
                                .getCertificateArn());
                        mIotAndroidClient.attachPrincipalPolicy(policyAttachRequest);


                    } catch (Exception e) {
                        Log.e(LOG_TAG,
                                "Exception occurred when generating new private key and certificate.",
                                e);
                    }
                }
            }).start();
        }
    }

    @ReactMethod
    public void connectAWSMqtt() {
        Log.v("Connect", "Started");
        try {
            if (clientKeyStore == null) {
                Log.i(LOG_TAG, "Cert/key was not found in keystore - creating new key and certificate.");

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            // Create a new private key and certificate. This call
                            // creates both on the server and returns them to the
                            // device.
                            CreateKeysAndCertificateRequest createKeysAndCertificateRequest =
                                    new CreateKeysAndCertificateRequest();
                            createKeysAndCertificateRequest.setSetAsActive(true);
                            final CreateKeysAndCertificateResult createKeysAndCertificateResult;
                            createKeysAndCertificateResult =
                                    mIotAndroidClient.createKeysAndCertificate(createKeysAndCertificateRequest);
                            Log.i(LOG_TAG,
                                    "Cert ID: " +
                                            createKeysAndCertificateResult.getCertificateId() +
                                            " created.");

                            // store in keystore for use in MQTT client
                            // saved as alias "default" so a new certificate isn't
                            // generated each run of this application
                            AWSIotKeystoreHelper.saveCertificateAndPrivateKey(certificateId,
                                    createKeysAndCertificateResult.getCertificatePem(),
                                    createKeysAndCertificateResult.getKeyPair().getPrivateKey(),
                                    keystorePath, keystoreName, keystorePassword);

                            // load keystore from file into memory to pass on
                            // connection
                            clientKeyStore = AWSIotKeystoreHelper.getIotKeystore(certificateId,
                                    keystorePath, keystoreName, keystorePassword);

                            // Attach a policy to the newly created certificate.
                            // This flow assumes the policy was already created in
                            // AWS IoT and we are now just attaching it to the
                            // certificate.
                            AttachPrincipalPolicyRequest policyAttachRequest =
                                    new AttachPrincipalPolicyRequest();
                            policyAttachRequest.setPolicyName(AWS_IOT_POLICY_NAME);
                            policyAttachRequest.setPrincipal(createKeysAndCertificateResult
                                    .getCertificateArn());
                            mIotAndroidClient.attachPrincipalPolicy(policyAttachRequest);


                        } catch (Exception e) {
                            Log.e(LOG_TAG,
                                    "Exception occurred when generating new private key and certificate." +
                                            e.getLocalizedMessage());
                        }
                    }
                }).start();
            }
            mqttManager.connect(clientKeyStore, new AWSIotMqttClientStatusCallback() {
                @Override
                public void onStatusChanged(final AWSIotMqttClientStatus status,
                                            final Throwable throwable) {
                    Log.d(LOG_TAG, "Status = " + String.valueOf(status));
                    WritableMap params = Arguments.createMap();
                    params.putString("status", status.toString());
                    sendEvent(reactContext, "Status", params);
                    if (status == AWSIotMqttClientStatus.Connecting) {
//                                tvStatus.setText("Connecting...");
                        Log.v(LOG_TAG, "Connecting");

                    } else if (status == AWSIotMqttClientStatus.Connected) {
                        Log.v(LOG_TAG, "Connected");

                    } else if (status == AWSIotMqttClientStatus.Reconnecting) {
                        if (throwable != null) {
                            Log.e(LOG_TAG, "Connection error.", throwable);
                        }
                        Log.v(LOG_TAG, "ReConnecting");
                    } else if (status == AWSIotMqttClientStatus.ConnectionLost) {
                        if (throwable != null) {
                            Log.e(LOG_TAG, "Connection error.", throwable);
                            throwable.printStackTrace();
                        }
                        Log.v(LOG_TAG, "Disconnecting");
                    } else {
                        Log.v(LOG_TAG, "Disconnected");

                    }
                }
            });
        } catch (final Exception e) {
            Log.e(LOG_TAG, "Connection error.", e);
        }
    }

    @ReactMethod
    public void publish(String topic, String msg) {
        try {
            mqttManager.publishString(msg, topic, AWSIotMqttQos.QOS0);
        } catch (Exception e) {
            Log.e(LOG_TAG, "Publish error.", e);
        }

    }

    @ReactMethod
    public void subscribe(String topic) {
        topicList.add(topic);
        try {
            mqttManager.subscribeToTopic(topic, AWSIotMqttQos.QOS0,
                    new AWSIotMqttNewMessageCallback() {
                        @Override
                        public void onMessageArrived(final String topic, final byte[] data) {
                            try {
                                String message = new String(data, "UTF-8");
                                if (!message.isEmpty()) {
                                    WritableMap params = Arguments.createMap();
                                    params.putString("message", message);
                                    sendEvent(reactContext, "subscribe", params);
                                }
                            } catch (Exception e) {
                                Log.e(LOG_TAG, "Message encoding error.", e);
                            }
                        }
                    });
        } catch (Exception e) {
            Log.e(LOG_TAG, "Subscription error.", e);
        }
    }


    @ReactMethod
    public void unsubscribe(String topic) {
        Log.v("Unsubscribe", "");
        try {
            mqttManager.unsubscribeTopic(topic);
            topicList.remove(topicList.indexOf(topic));
        } catch (Exception e) {
            Log.e(LOG_TAG, "Disconnect error.", e);
        }
    }

    @ReactMethod
    public void unsubscribeAll() {
        Iterator i = topicList.iterator();
        while (i.hasNext()) {
            try {
                mqttManager.unsubscribeTopic(i.next().toString());
            } catch (Exception e) {
                Log.e(LOG_TAG, "Disconnect error.", e);
            }
        }
        topicList.clear();
        Log.v(LOG_TAG, "Remove All" + topicList.size() + "");
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}