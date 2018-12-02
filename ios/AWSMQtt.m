//
//  AWSMQtt.m
//  demoAWS
//
//  Created by Dat Tran on 11/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AWSMqtt, RCTEventEmitter)
RCT_EXTERN_METHOD(setupAAWSMQTT)
RCT_EXTERN_METHOD(connectToAWSMQTT)
RCT_EXTERN_METHOD(publishToAWSMQTT:(NSString *)topic message:(NSString*)message)
RCT_EXTERN_METHOD(subscribeFromAwsMqtt:(NSString*)topic)
RCT_EXTERN_METHOD(unsubscribeTopic:(NSString*)topic)
RCT_EXTERN_METHOD(unsubscribeAllTopics)
@end
