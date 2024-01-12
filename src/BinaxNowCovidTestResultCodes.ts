// Define the test results as pulled from the NIH PowerBI dashboard.

import { TestResultCode } from 'radx-mars-lib'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
/**
 * This class is a helper class specific to the Abbott BinaxNow Covid test.
 * You can implement something similar for you test.  Make sure, when doing so,
 * you adjust the codes that correspond to the codes presented in the PowerBI
 * dashboard under the OBX[1]-5 section.
 */
export default class BinaxNowCovidDetectedTestResultCodes {
  static readonly Detected = new TestResultCode('260373001', 'Detected')
  static readonly NotDetected = new TestResultCode('260415000', 'Not Detected')
  static readonly Invalid = new TestResultCode('455371000124106', 'Invalid Result')
  static readonly Unsatistactory = new TestResultCode('125154007', 'Specimen unsatisfactory for evaluation')
}
