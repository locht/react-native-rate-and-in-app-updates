
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRateAndInAppUpdatesSpec.h"

@interface RateAndInAppUpdates : NSObject <NativeRateAndInAppUpdatesSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RateAndInAppUpdates : NSObject <RCTBridgeModule>
#endif

@end
