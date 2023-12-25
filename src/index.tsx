import { Platform, Linking, NativeModules } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rate-and-in-app-updates' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// const RateAndInAppUpdates = NativeModules.RateAndInAppUpdates
//   ? NativeModules.RateAndInAppUpdates
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );

const { RNRate } = NativeModules
  ? NativeModules
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const AppleNativePrefix = 'itms-apps://itunes.apple.com/app/id';
const AppleWebPrefix = 'https://itunes.apple.com/app/id';
const GooglePrefix = 'https://play.google.com/store/apps/details?id=';
const AmazonPrefix = 'amzn://apps/android?p=';

export const AndroidMarket = {
  Google: 1,
  Amazon: 2,
  Other: 3,
};

const noop = () => {};

class Rate {
  static filterOptions(inputOptions) {
    const options = {
      AppleAppID: '',
      GooglePackageName: '',
      AmazonPackageName: '',
      OtherAndroidURL: '',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      inAppDelay: 3.0,
      fallbackPlatformURL: '',
    };
    Object.keys(inputOptions).forEach((key) => {
      options[key] = inputOptions[key];
    });
    return options;
  }

  static rate(inputOptions, callback = noop) {
    const options = Rate.filterOptions(inputOptions);
    if (Platform.OS === 'ios') {
      options.AppleNativePrefix = AppleNativePrefix;
      RNRate.rate(options, (response, error) => {
        callback(response, error);
      });
    } else if (Platform.OS === 'android') {
      if (options.preferredAndroidMarket === AndroidMarket.Google) {
        if (options.preferInApp) {
          RNRate.rate(options, (response, error) => {
            if (!response) {
              if (options.openAppStoreIfInAppFails) {
                Rate.openURL(
                  GooglePrefix + options.GooglePackageName,
                  callback
                );
              } else {
                callback(false, error);
              }
            } else {
              callback(response, error);
            }
          });
        } else {
          Rate.openURL(GooglePrefix + options.GooglePackageName, callback);
        }
      } else if (options.preferredAndroidMarket === AndroidMarket.Amazon) {
        Rate.openURL(AmazonPrefix + options.AmazonPackageName, callback);
      } else if (options.preferredAndroidMarket === AndroidMarket.Other) {
        Rate.openURL(options.OtherAndroidURL, callback);
      }
    } else {
      Rate.openURL(options.fallbackPlatformURL, callback);
    }
  }

  static openURL(url, callback = noop) {
    Linking.canOpenURL(url).then((supported) => {
      callback(supported);
      if (supported) {
        Linking.openURL(url);
      }
    });
  }
}

// export default Rate;

export {
  AndroidUpdateType as IAUUpdateKind,
  AndroidAvailabilityStatus as IAUAvailabilityStatus,
  AndroidInstallStatus as IAUInstallStatus,
  AndroidOther as IAUOther,
} from './types';

// @ts-expect-error
import InAppUpdates from './InAppUpdates';

// export default InAppUpdates;
export { Rate, InAppUpdates };

// export function multiply(a: number, b: number): Promise<number> {
//   return RateAndInAppUpdates.multiply(a, b);
// }
