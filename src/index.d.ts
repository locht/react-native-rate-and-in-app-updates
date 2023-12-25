import type {
  StartUpdateOptions,
  NeedsUpdateResponse,
  CheckOptions,
  AndroidIntentResultListener,
  AndroidStatusEventListener,
} from './types';
export * from './types';

export {
  AndroidUpdateType as IAUUpdateKind,
  AndroidAvailabilityStatus as IAUAvailabilityStatus,
  AndroidInstallStatus as IAUInstallStatus,
  AndroidOther as IAUOther,
} from './types'; // Android only

declare module 'react-native-rate' {
  export interface IConfig {
    AppleAppID?: string;
    GooglePackageName?: string;
    AmazonPackageName?: string;
    OtherAndroidURL?: string;
    preferredAndroidMarket?: AndroidMarket;
    preferInApp?: boolean;
    openAppStoreIfInAppFails?: boolean;
    inAppDelay?: number;
    fallbackPlatformURL?: string;
  }

  export enum AndroidMarket {
    Google,
    Amazon,
    Other,
  }

  export default class Rate {
    static rate(
      config: IConfig,
      callback?: (success: boolean, error: string) => void
    ): void;
  }
}
declare class SpInAppUpdates {
  constructor(isDebug: boolean);

  public checkNeedsUpdate(
    checkOptions?: CheckOptions
  ): Promise<NeedsUpdateResponse>;

  public startUpdate(updateOptions: StartUpdateOptions): Promise<void>;

  public installUpdate(): void;

  public addStatusUpdateListener(callback: AndroidStatusEventListener): void;
  public removeStatusUpdateListener(callback: AndroidStatusEventListener): void;

  public addIntentSelectionListener(
    callback: AndroidIntentResultListener
  ): void;

  public removeIntentSelectionListener(
    callback: AndroidIntentResultListener
  ): void;
}
export default SpInAppUpdates;
