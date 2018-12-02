//
//  AWSMqtt.swift
//  demoAWS
//
//  Created by Dat Tran on 11/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
@objc(AWSMqtt)//To make it a Objective C Class
class AWSMqtt: RCTEventEmitter {//This class needs some features provided by react native library
  
  private var connected = false;
  private var iotDataManager: AWSIoTDataManager!;
  private var iotManager: AWSIoTManager!;
  private var iot: AWSIoT!
  
  private var allSubscribedTopics = [String]()
  
  override static func requiresMainQueueSetup() -> Bool {//This code is needed. don't remove
    return true
  }
  
  override func supportedEvents() -> [String]! {//These are the name of events that the react native will receive
    return["connectionStatus","message"]
  }
  
  //Setup AWSIOT
  @objc public func setupAAWSMQTT() {
    let credentialsProvider = AWSCognitoCredentialsProvider(regionType: AWSRegion, identityPoolId: CognitoIdentityPoolId)
    let iotEndPoint = AWSEndpoint(urlString: IOT_ENDPOINT)
    
    let iotConfiguration = AWSServiceConfiguration(region: AWSRegion, credentialsProvider: credentialsProvider)
    
    let iotDataConfiguration = AWSServiceConfiguration(region: AWSRegion,
                                                       endpoint: iotEndPoint,
                                                       credentialsProvider: credentialsProvider)
    AWSServiceManager.default().defaultServiceConfiguration = iotConfiguration
    
    iotManager = AWSIoTManager.default()
    iot = AWSIoT.default()
    
    AWSIoTDataManager.register(with: iotConfiguration!, forKey: "AWSIoTDataManager")
  
    iotDataManager = AWSIoTDataManager(forKey: "AWSIoTDataManager")
    
    allSubscribedTopics.removeAll()
  }
  
  //Connect to AWSIOT using the ceritificate
  @objc public func connectToAWSMQTT() {
    func mqttEventCallback( _ status: AWSIoTMQTTStatus )
    {
      print("connection status = \(self.iotDataManager.getConnectionStatus().rawValue)")
      DispatchQueue.main.async {
        print("connection status = \(status.rawValue)")
        self.sendEvent(withName: "connectionStatus", body: ["status":status.rawValue])
        switch(status)
        {
        case .connecting:
          print("Connecting...")
        case .connected:
          print("Connected")
          self.connected = true
        case .disconnected:
          print("Disconnected")
        case .connectionRefused:
          print("Connection Refused")
        case .connectionError:
          print("Connection Error")
        case .protocolError:
          print("Protocol Error")
        default:
          print("unknown state: \(status.rawValue)")
        }
        NotificationCenter.default.post( name: Notification.Name(rawValue: "connectionStatusChanged"), object: self )
      }
    }
    
    if (connected == false)
    {
      let defaults = UserDefaults.standard
      var certificateId = defaults.string( forKey: "certificateId")
    
      if (certificateId == nil)
      {
        let uuid = UUID().uuidString;
        
        certificateId = defaults.string( forKey: "certificateId")
        if (certificateId == nil) {
          // Now create and store the certificate ID in NSUserDefaults
          let csrDictionary = [ "commonName":CertificateSigningRequestCommonName, "countryName":CertificateSigningRequestCountryName, "organizationName":CertificateSigningRequestOrganizationName, "organizationalUnitName":CertificateSigningRequestOrganizationalUnitName]
          
          self.iotManager.createKeysAndCertificate(fromCsr: csrDictionary, callback: {  (response ) -> Void in
            if (response != nil)
            {
              defaults.set(response?.certificateId, forKey:"certificateId")
              defaults.set(response?.certificateArn, forKey:"certificateArn")
              certificateId = response?.certificateId
              print("response: [\(String(describing: response))]")
              
              let attachPrincipalPolicyRequest = AWSIoTAttachPrincipalPolicyRequest()
              attachPrincipalPolicyRequest?.policyName = PolicyName
              attachPrincipalPolicyRequest?.principal = response?.certificateArn
              
              // Attach the policy to the certificate
              self.iot.attachPrincipalPolicy(attachPrincipalPolicyRequest!).continueWith (block: { (task) -> AnyObject? in
                if let error = task.error {
                  print("failed: [\(error)]")
                }
                print("result: [\(String(describing: task.result))]")
                
                // Connect to the AWS IoT platform
                if (task.error == nil)
                {
                  print("task: \(task)")
                  DispatchQueue.main.asyncAfter(deadline: .now()+2, execute: {
                    self.iotDataManager.connect( withClientId: uuid, cleanSession:true, certificateId:certificateId!, statusCallback: mqttEventCallback)
                    
                  })
                }
                print("task \(task)")
                return nil
              })
            }
            else
            {
              DispatchQueue.main.async {
                print("Unable to create keys and/or certificate, check values in Constants.swift")
              }
            }
          } )
        }
      }
      else
      {
        let uuid = UUID().uuidString;
        let certId = "cd2212a93a0feb5ef88fec2f055463c33d7a13886de1152f82d90fc659f3898b"
        DispatchQueue.main.async {
          // Connect to the AWS IoT service
          self.iotDataManager.connect(withClientId: uuid, cleanSession:true, certificateId:certificateId!, statusCallback: mqttEventCallback)

        }
      }
    }
    else
    {
      print("Force Disconnecting...")
      
      DispatchQueue.global(qos: DispatchQoS.QoSClass.default).async {
        self.iotDataManager.disconnect();
        DispatchQueue.main.async {
          self.connected = false
        }
      }
    }
  }
  
  //Publish a message to AWSIOT channel/topic
  @objc public func publishToAWSMQTT(_ topic:String, message:String) {
    iotDataManager.publishString(message, onTopic:topic, qoS: .messageDeliveryAttemptedAtMostOnce )
  }
  
  //Subscribe to a channel/topic
  @objc func subscribeFromAwsMqtt(_ topic:String) {
    if (allSubscribedTopics.contains(topic) == false) {
      allSubscribedTopics.append(topic)
    }
    iotDataManager.subscribe(toTopic: topic, qoS: .messageDeliveryAttemptedAtMostOnce, messageCallback: { (payload) ->Void in
      let stringValue = NSString(data: payload, encoding: String.Encoding.utf8.rawValue)!
      print(stringValue)
      self.sendEvent(withName: "message", body: stringValue)
    } )
  }
  
  //Unsubscribe to a specific topic/channel
  @objc func unsubscribeTopic(_ topic:String) {
    iotDataManager.unsubscribeTopic(topic)
    if let index = allSubscribedTopics.index(of: topic) {
      allSubscribedTopics.remove(at: index)
    }
  }
  
  //unsubscribe to all topics/channels
  @objc func unsubscribeAllTopics() {
    for topic in allSubscribedTopics {
      iotDataManager.unsubscribeTopic(topic)
    }
    allSubscribedTopics.removeAll()
  }
  
}
