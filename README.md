# react-native-rate-and-in-app-updates

react-native-rate-and-in-app-updates

## Installation

```sh
yarn add react-native-rate-and-in-app-updates
```

# sp-react-native-in-app-updates

![In app update example](https://user-images.githubusercontent.com/8539174/88419625-6db0ef00-cddd-11ea-814e-389db852368b.gif)

## Getting started

<br>

### What is this?

This is a **react-native native module** that works on both **iOS** and **Android**, and checks the stores (play/app) for a new version of your app and can prompt your user for an update.

It uses **embedded** [in-app-updates via Play-Core](https://developer.android.com/guide/playcore/in-app-updates) on Android (to check & download google play patches natively from within the app), and [react-native-siren](https://github.com/GantMan/react-native-siren) on iOS (to check & navigate the user to the AppStore).

### Why?

Because to this day I'm not aware of any react-native libraries that use play core to offer embedded in-app-updates besides this one

<br>

## Installation

`$ npm install sp-react-native-in-app-updates --save`

<br>

##### iOS only:

On **iOS** you may need to also add the following lines in your Info.plist to be able to launch the store deep link.

```
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>itms-apps</string>
</array>
```

<br>

##### Note:

This project uses [`react-native-device-info`](https://github.com/react-native-device-info/react-native-device-info#installation) in the background. Install it to ensure everything works correctly.

## Usage

```javascript
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(
  false // isDebug
);
// curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
inAppUpdates.checkNeedsUpdate({ curVersion: '0.0.8' }).then((result) => {
  if (result.shouldUpdate) {
    let updateOptions: StartUpdateOptions = {};
    if (Platform.OS === 'android') {
      // android only, on iOS the user will be promped to go to your app store page
      updateOptions = {
        updateType: IAUUpdateKind.FLEXIBLE,
      };
    }
    inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
  }
});
```

### Usage with app updates for specific country (iOS only)

```javascript
//                              👇🏻 (optional)
inAppUpdates.checkNeedsUpdate({ country: 'it' }).then((result) => {
  if (result.shouldUpdate) {
    const updateOptions: StartUpdateOptions = Platform.select({
      ios: {
        title: 'Update available',
        message:
          'There is a new version of the app available on the App Store, do you want to update it?',
        buttonUpgradeText: 'Update',
        buttonCancelText: 'Cancel',
        country: 'it', // 👈🏻 the country code for the specific version to lookup for (optional)
      },
      android: {
        updateType: IAUUpdateKind.IMMEDIATE,
      },
    });
    inAppUpdates.startUpdate(updateOptions);
  }
});
```

<br>
<br>

### Methods:

<br>

#### `checkNeedsUpdate(checkOptions: CheckOptions) : Promise<NeedsUpdateResponse>`

Checks if there are any updates available.

Where:
`CheckOptions`

| Options                 | Type                | Description                                                                                                                                                                                                       |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| curVersion              | (required) String   | The semver of your current app version                                                                                                                                                                            |
| toSemverConverter       | (optional) Function | This will run right after the store version is fetched in case you want to change it before it's compared as a semver                                                                                             |
| customVersionComparator | (optional) Function | By default this library uses `semver` behind the scenes to compare the store version with the `curVersion` value, but you can pass your own version comparator if you want to                                     |
| country (iOS only)      | (optional) String   | default `undefined`, it will filter by country code while requesting an update, The value should be [ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) |

and `NeedsUpdateResponse`:

| Result       | Type    | Description                                                 |
| ------------ | ------- | ----------------------------------------------------------- |
| shouldUpdate | Boolean | Wether there's a newer version on the store or not          |
| storeVersion | String  | The latest app/play store version we're aware of            |
| other        | Object  | Other info returned from the store (differs on Android/iOS) |

<br>

#### `startUpdate(updateOptions: StartUpdateOptions) : Promise`

Shows pop-up asking user if they want to update, giving them the option to download said update.

Where:
`StartUpdateOptions `

| Option                            | Type                                                                                                                          | Description                                                                                                                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| updateType (Android ONLY)         | (required on Android) [IAUUpdateKind](https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78) | Either `IAUUpdateKind.FLEXIBLE` or `IAUUpdateKind.IMMEDIATE`. This uses play-core below the hood, read more [here](https://developer.android.com/guide/playcore/in-app-updates) about the two modes.                        |
| title (iOS only)                  | (optional) String                                                                                                             | The title of the alert prompt when there's a new version. (default: `Update Available`)                                                                                                                                     |
| message (iOS only)                | (optional) String                                                                                                             | The content of the alert prompt when there's a new version (default: `There is an updated version available on the App Store. Would you like to upgrade?`)                                                                  |
| buttonUpgradeText (iOS only)      | (optional) String                                                                                                             | The text of the confirmation button on the alert prompt (default: `Upgrade `)                                                                                                                                               |
| buttonCancelText (iOS only)       | (optional) String                                                                                                             | The text of the cancelation button on the alert prompt (default: `Cancel`)                                                                                                                                                  |
| forceUpgrade (iOS only)           | (optional) Boolean                                                                                                            | If set to true the user won't be able to cancel the upgrade (default: `false`)                                                                                                                                              |
| bundleId (iOS only)               | (optional) String                                                                                                             | The id that identifies the app (ex: com.apple.mobilesafari). If undefined, it will be retrieved with react-native-device-info. (default: `undefined`)                                                                       |
| country (iOS only)                | (optional) String                                                                                                             | If set, it will filter by country code while requesting an update, The value should be [ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) (default: `undefined`) |
| versionSpecificOptions (iOS only) | (optional) Array\<IosStartUpdateOptionWithLocalVersion>                                                                       | An array of IosStartUpdateOptionWithLocalVersion that specify rules dynamically based on what version the device is currently running. (default: `undefined`)                                                               |

<br>

#### `installUpdate() : void` (Android only)

Installs a downloaded update.
<br>

#### `addStatusUpdateListener(callback: (status: StatusUpdateEvent) : void) : void` (Android only)

Adds a listener for tracking the current status of the update download.

Where: `StatusUpdateEvent`

| Option               | Type                                                                                                          | Description                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| status               | [AndroidInstallStatus](https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L1) | The status of the installation (https://developer.android.com/reference/com/google/android/play/core/install/model/InstallStatus) |
| bytesDownloaded      | int                                                                                                           | How many bytes were already downloaded                                                                                            |
| totalBytesToDownload | int                                                                                                           | The total amount of bytes in the update                                                                                           |

<br>

#### `removeStatusUpdateListener(callback: (status: StatusUpdateEvent) : void): void` (Android only)

Removes an existing download status listener.
<br>
<br>

## Example:

[Example project](https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/v1/Example/App.tsx#L38)
<br>
<br>

## Typical debugging workflow we had success with:

Debugging in-app-updates is tricky, so arm yourself with patience, enable debug logs by passing true to our library constructor. To enable `console.log` for _release_ you may need `react-native log-android` or `react-native log-ios`.

First of all use a **REAL device**.

##### Step 1: Enable **internal app sharing** (google it) on your android device

##### Step 2: Create a release apk (or aab) with the lower version of your app (i.e version 100)

(you don't like the debug variant right? Neither do we, but we couldn't find an easier way to check that everything's working fine - debug builds don't work with in-app-updates unfortunately)

##### Step 3: Create a release apk (or aab) with the higher version of your app (i.e version 101)

This is what you'd be updating to

##### Step 4: Upload both apk's to internal app sharing

##### Step 5: Install the version 100 on your device.

##### Step 6: Open the internal app sharing link of version 101 on your device but DON'T install it

Make sure that the button within that link says UPDATE (and NOT install)

That means google play knows there's an available update

##### Step 7: Open the installed (100) version of the app, and make sure that your code works (that you see an update popup)

Haven't really found any easier ways to test that everything works, but hey.. it get's the job done

<br>

## Troubleshooting

Keep in mind that this library is JUST a **WRAPPER** of the in-app-update api, so if you have trouble making in-app-updates work it's most probably because you're doing something wrong with google play.
<br>

- In-app updates works only with devices running Android 5.0 (**API level 21**) or higher.
- Testing this won’t work on a debug build. You would need a release build signed with the same key you use to sign your app before uploading to the Play Store (dummy signing can be used). It would be a good time to use the internal testing track.
- In-app updates are available only to user accounts that own the app. So, make sure the account you’re using has downloaded your app from Google Play at least once before using the account to test in-app updates.
- Because Google Play can only update an app to a higher version code, make sure the app you are testing as a lower version code than the update version code.
- Make sure the account is eligible and the Google Play cache is up to date. To do so, while logged into the Google Play Store account on the test device, proceed as follows:
  Make sure you completely close the Google Play Store App.
  Open the Google Play Store app and go to the My Apps & Games tab.

**Important: If the app you are testing doesn’t appear with an available update, don't bother checking for updates programmatically, because you'll probably never see any available updates via code either.**

<br>

## Contributing:

This library is offered as is, if you'd like to change something please open a PR

<br>

## Changelog

Read the [CHANGELOG.md](https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/CHANGELOG.md) file

## License

MIT

# react-native-rate

React Native Rate is a cross platform solution to getting users to easily rate your app.

##### Stores Supported:

| Apple App Store | Google Play | Amazon | Other Android Markets                                                               | All Others                                                                                            |
| --------------- | ----------- | ------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **✓**           | **✓**       | **✓**  | **✓** Building your app for a different Android store, you can provide your own URL | **✓** If your platform isn't one of the others, you can input a fallback url to send users to instead |

## Getting started

`$ npm i react-native-rate`

### Mostly automatic installation (new way with react-native v0.60+)

`cd ios && pod install && cd ../`

### Mostly automatic installation (old way)

`$ react-native link react-native-rate`

### Manual installation

#### iOS

##### Without CocoaPods

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-rate` and add `RNRate.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNRate.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

##### Using CocoaPods

Add the following to your `Podfile` (and run `pod install`):

```
pod 'RNRate', :path => '../node_modules/react-native-rate'
```

#### Other Platforms

Android, Windows, etc don't use any native code. So don't worry! (There still is linking to Android if you do react-native link. We only left this here so that we can call native code if there is native code to call someday.)

#### iOS Specific:

Users using iOS 10.3 (from 2017) and above can now use `SKStoreReviewController` to open a Rating Alert right from within their app. There are a few gotchas to using this ReviewController though:

- Users are first presented with a pop up allowing them to choose 1-5 stars. If they give a numerical rating, the pop up will allow them to then write a review. They can cancel at any time, leaving you with either nothing, a rating, or a rating and review.
- To prevent annoying popups, Apple decides whether or not you can display it, and they do not offer a callback to let you know if it was displayed or not. It is limited to being shown 3-4 times per year.
- If you do want this ReviewController to show up, we wrote a little hack to see if it worked, and if it doesn't, we just open the App Store (using the optional for all devices pre-iOS10.3). Hopefully this hack continues to work, and hopefully Apple updates the API so we don't have to use this hack.
- If you set `options.preferInApp = true`, the popup will happen on appropriate devices the first time you call it after the app is open. The hack used checks the number of windows the application has. For some reason, when the inapp window is dismissed, it is still on the stack. So if you try it again, the popup will appear (if it is 3 or less times you've done it this year), but after a short delay, the App Store will open too.
- Due to all these issues, we recommend only setting preferInApp to true when you are absolutely sure you want a one time, rare chance to ask users to rate your app from within the app. Do not use it to spam them between levels. Do not have a button for rating/reviewing the app, and call this method. And if you want to have a really professional app, save the number of attempts to the device, along with a date. Otherwise you will get some strange behavior.
- If you want to open via the `SKStoreReviewController`, but don't want the App Store App to open after the timeout, you can set `openAppStoreIfInAppFails:false` in options. By default, it will open after the timeout.

#### Android Specific for in-app popups:

- Similar to iOS since 2017, Android FINALLY supports an in-app dialogue that allows users to rate/review your app. As of August 2020, this is our first release using Android's PlayCore in-app-review popup, so there may be some hiccups. Note that this only works for the Android Google Play store (and Chrome OS devices that have the Google Play Store installed). No Amazon marketplace, sorry :( Also requires Android 5.0 and above, which I think has been required for newer versions of React Native for at least the least year or two. So if you've updated your `react-native` library since probably 2018, you should be good to use this.
- If you set `preferredAndroidMarket = AndroidMarket.Google` and `options.preferInApp = true`, it will open the native UI in the app (see [Official docs](https://developer.android.com/guide/playcore/in-app-review)).
- Your app needs to be published at least once to the Play Store for it to show (see [How to test](https://developer.android.com/guide/playcore/in-app-review/test)).
- It seems that it only shows on a real device, not on a simulator.
- Need troubleshooting? Check out the [official documentation on common problems](https://developer.android.com/guide/playcore/in-app-review/test#troubleshooting) here.
- Want to show the in-app review dialogue even after the user has reviewed your app? Maybe they tapped a button to edit their review? Unfortunately, like Apple, Google doesn't tell us if the user has reviewed or not. So if you try to open the in-app dialogue, your callback will be **SUCCESS**. But actually, nothing will happen. And since it is "successful", the Play Store page won't open either. In order to handle this, I suggest 1 of two solutions. Either create a separate button that ALWAYS opens the play store (never the in-app prompt). Or create some logic to estimate if a user has rated or not. For example, if the user comes back to the app within 10 seconds, they probably didn't rate the app. Or you could just never try the in-app prompt once it has been successful once. Or, if you're a programming genius, and you know the usernames of your users, make a Google Play query and search for their review. If exists, don't try again. Ya, but I bet you won't have access to that info. But that's hopeful dreaming.

## Example

```javascript
import React from 'react';
import { View, Button } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';

export default class ExamplePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rated: false,
    };
  }

  render() {
    return (
      <View>
        <Button
          title="Rate App"
          onPress={() => {
            const options = {
              AppleAppID: '2193813192',
              GooglePackageName: 'com.mywebsite.myapp',
              AmazonPackageName: 'com.mywebsite.myapp',
              OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
              preferredAndroidMarket: AndroidMarket.Google,
              preferInApp: false,
              openAppStoreIfInAppFails: true,
              fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html',
            };
            Rate.rate(options, (success, errorMessage) => {
              if (success) {
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                this.setState({ rated: true });
              }
              if (errorMessage) {
                // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                console.error(
                  `Example page Rate.rate() error: ${errorMessage}`
                );
              }
            });
          }}
        />
      </View>
    );
  }
}
```

#### options:

There are lots of options. You can ignore some of them if you don't plan to have them on that App Store.

| Option                   | Description                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AppleAppID               | When you create an app in iTunes Connect, you get a number that is around 10 digits long.                                                                                                                                                                                                                                                                                   |
| GooglePackageName        | Created when you create an app on Google Play Developer Console.                                                                                                                                                                                                                                                                                                            |
| AmazonPackageName        | Create when you create an app on the Amazon Developer Console.                                                                                                                                                                                                                                                                                                              |
| preferredAndroidMarket   | This only matters if you plan to deploy to both Google Play and Amazon or other markets. Since there is no reliable way to check at run time where the app was downloaded from, we suggest creating your own build logic to decipher if the app was built for Google Play or Amazon, or Other markets. Available Options: AndroidMarket.Google, AndroidMarket.Amazon, Other |
| preferInApp              | If true and user is on iOS, tries to use `SKStoreReviewController`. If true and user is on Android, it will try to use the native UI. If fails for whatever reason, or user is on another platform, opens the App Store externally. Default `false`                                                                                                                         |
| fallbackPlatformURL      | `if ((Platform.OS != 'ios) && (Platform.OS != 'android'))`, open this URL.                                                                                                                                                                                                                                                                                                  |
| inAppDelay               | (IOS ONLY) Delay to wait for the InApp review dialog to show (if preferInApp == true). After delay, opens the App Store if the InApp review doesn't show. Default 3.0                                                                                                                                                                                                       |
| openAppStoreIfInAppFails | If `preferInApp = true` but the native iOS and Android UI failed, opens the store externally. Default `true`                                                                                                                                                                                                                                                                |

##### Options Example1

```javascript
// iOS only, not using in-app rating (this is the default)
const options = {
  AppleAppID: '2193813192',
};
```

##### Options Example2

```javascript
// Android only, able to target both Google Play & Amazon stores. You have to write custom build code to find out if the build was for the Amazon App Store, or Google Play
import { androidPlatform } from './buildConstants/androidPlatform'; // this is a hypothetical constant created at build time
const options = {
  GooglePackageName: 'com.mywebsite.myapp',
  AmazonPackageName: 'com.mywebsite.myapp',
  preferredAndroidMarket:
    androidPlatform == 'google' ? AndroidMarket.Google : AndroidMarket.Amazon,
};
```

##### Options Example3

```javascript
// targets only iOS app store and Amazon App Store (not google play or anything else). Also, on iOS, tries to open SKStoreReviewController.
const options = {
  AppleAppID: '2193813192',
  AmazonPackageName: 'com.mywebsite.myapp',
  preferredAndroidMarket: AndroidMarket.Amazon,
  preferInApp: true,
};
```

##### Options Example4

```javascript
// targets iOS, Google Play, and Amazon. Also targets Windows, so has a specific URL if Platform isn't ios or android. Like example 2, custom build tools are used to check if built for Google Play or Amazon. Prefers not using InApp rating for iOS.
import { androidPlatform } from './buildConstants/androidPlatform'; // this is a hypothetical constant created at build time
const options = {
  AppleAppID: '2193813192',
  GooglePackageName: 'com.mywebsite.myapp',
  AmazonPackageName: 'com.mywebsite.myapp',
  preferredAndroidMarket:
    androidPlatform == 'google' ? AndroidMarket.Google : AndroidMarket.Amazon,
  fallbackPlatformURL: 'ms-windows-store:review?PFN:com.mywebsite.myapp',
};
```

##### Options Example5

```javascript
// targets 4 different android stores: Google Play, Amazon, and 2 fake hypothetical stores: CoolApps and Andrule
import { androidPlatform } from './buildConstants/androidPlatform'; // this is a hypothetical constant created at build time
const options = {
  GooglePackageName: 'com.mywebsite.myapp',
  AmazonPackageName: 'com.mywebsite.myapp',
  preferredAndroidMarket:
    androidPlatform == 'google'
      ? AndroidMarket.Google
      : androidPlatform == 'amazon'
      ? AndroidMarket.Amazon
      : AndroidMarket.Other,
  OtherAndroidURL:
    androidPlatform == 'CoolApps'
      ? 'http://www.coolapps.net/apps/31242342'
      : 'http://www.andrule.com/apps/dev/21312',
};
```

##### Options Example6

```javascript
// Tries to open the SKStoreReviewController in app for iOS only, but if it fails, nothing happens instead of opening the App Store app after 5.0s. Technically, you do not need to add inAppDelay in options below because it has a default value. I am only writing it below to show the difference between openAppStoreIfInAppFails true/false values and what would happen after the inAppDelay.
const options = {
  AppleAppID: '2193813192',
  preferInApp: true,
  inAppDelay: 5.0,
  openAppStoreIfInAppFails: false,
};
```

#### About Package Names (Google Play & Android) and Bundle Identifiers (Apple):

If you want to keep the same package name and bundle identifier everywhere, we suggest the following:

- All lowercase letters
- No numbers
- Use reverse domain style: com.website.appname

#### I’m new to mobile development. Why is rating important?

Though this isn’t specific to this module, some new developers are not quite sure why rating is important.

First off, rating and reviews are technically two different things. Rating being typically a 1-5 star rating, and a review being text that a user writes. Both are important for different reasons.

A higher rating increases your app’s chance of being shown in search results. Some even think that ANY rating will increase your app’s chance, though I don’t know the algorithm. Some users
also look at stars and weigh their decision to download or not partially on this metric.

Likewise, reviews give both developers and users good feedback on how the app is doing. Developers can use these reviews as quotes in their app description, and in some stores even reply to reviews (iOS, Google Play, Amazon, and possibly others).

Getting good reviews and good ratings will increase your app’s popularity and downloads. Of course, getting a user to rate your app is mainly about maximizing your probability of success, vs annoying them. There are a lot of articles online on how best to get users to rate your app, but we won’t go into them here.

Your job as the developer, using this module, is to create an experience for the user, and at the right time, ask them to rate. This can be in the form of a pop up, a perpetual button on a settings menu, or after being a level in a game. It’s up to you.

#### What does this module do when you call rate()

For those that don’t want to read through the code, this module will open a link to the App Store of your choosing based on your options and user’s device. The App Store will be on your app’s page. If possible, it will be on the Ratings/Reviews section.

If possible, the App Store will be opened in the native app for the Store (ie the App Store app). If not possible, it will be opened from the user’s browser.

The only time when the above is not true is for iOS when you setup your options to use the `SKStoreReviewController`. In this case, a native UI pop up (created by Apple) is displayed from within you app.

#### Rate.rate() success?

Success in most cases is self explanatory. But for the iOS `SKStoreReviewController` case:

| ---                                                                                                                                     | success | !success |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| `{preferInApp:true}` and the SKStoreReviewController successfully opens                                                                 | **✓**   | ---      |
| `{preferInApp:true, openAppStoreIfInAppFails:true}` and the SKStoreReviewController fails to open, but opens the App Store App          | **✓**   | ---      |
| `{preferInApp:true, openAppStoreIfInAppFails:false}` and the SKStoreReviewController fails to open, and does not open the App Store App | ---     | **✓**    |

#### This used to work, now I'm getting an error message with react-native-rate v1.2.0

I moved the podspec file outside of the `ios` directory. If you use pods before this version, you may have set paths to `ios/RNRate.podspec`. You may need to change that back.

#### preferInApp works in iOS development, but not via TestFlight!

True. According to Apple's documentation, the `SKStoreReviewController` should work as expected while in development and production modes, but not one that is distributed via TestFlight.

#### Future Plans

I plan to add default support for Windows, but haven't personally built any windows app for a few years now. So will do it when it's actually relevant.
