import {
  MarsClient,
  Patient,
  TestKit,
  ExtendedAddress,
  TestResultAbnormalFlagsCode
} from 'radx-mars-lib'

// Instantiate the required arguments
import { AimsHubProvider } from 'aims-mars-lib'
import { ReportStreamHubProvider } from 'reportstream-mars-lib'

import AbbottLabInfo from './AbbottLabInfo'
import BinaxNowCovidTest from './BinaxNowCovidTest'
import BinaxNowCovidTestResult from './BinaxNowCovidTestResult'
import BinaxNowCovidDetectedTestResultCodes from './BinaxNowCovidTestResultCodes'
import DebugHubProvider from './DebugHubProvider'

// ###############
// ONE TIME SETUP.
// ###############

// Instantiate an AimsHubProvider.  The values passed to AimsHubProvider may
// include all of the information provided to you by AIMS or it may include
// simply the bucket path if the AWS information required for AIMS submission
// is available in the default AWS environment variables.  For more information
// on this configuration, see the AimsHubProvider documentation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const aimsHubProvider = new AimsHubProvider(
  'RADx',
  { bucketPath: 'YOUR-AIMS-PROVIDED-BUCKET-PATH-HERE/' },
  false)

// Instantiate the reportstream provider using the credentials
// provided by ReportStream.  In a real application, you should not embed
// credentials in the code but should, instead, pull them from some secure
// service, from environment variables, etc.  We've left in some values to
// provide you an example of what your configuration MAY look like.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reportStreamHubProvider = new ReportStreamHubProvider(
  {
    privatePemString: `
	YOUR REPORTSTREAM PROVIDED PEM HERE
`,
    algorithm: 'ES384',
    clientId: 'YOUR CLIENT ID',
    kid: 'YOUR KID',
    scope: 'YOUR SCOPE'
  },
  false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugHubProvider = new DebugHubProvider()

// Create a new MARSClient. This is the entryway into the library.
// A mars client handles HL7 generation and submission of the HL7
// message to the configured Hub on behalf of the configured lab.
const client = new MarsClient(reportStreamHubProvider, new AbbottLabInfo())

// Create a result submitter. The result submitter allows a configured
// client to submit results for more than one type of test to the
// MARS Hub.  Note, if you are running a multi-plex test you will still
// only have one result submitter, but the test submission will have
// multiple associated results.  The COVID result MUST be first.
const resultSubmitter = client.createResultSubmitter(new BinaxNowCovidTest())

// The above code handles the setup you’ll typically need to do once
// per app.  The app itself is generally only going to submit results
// for one type of test for one lab.
// The following code is code that would be implemented once per
// execution of a test.  It handles the creation and management of
// a test subject and test results.

// ###############
// PER TEST SETUP.
// ###############

// We need to know information about the lab, the test, and the test results.
// We have defined those pieces of information by extending classes defined
// in the radx-mars-lib base library package.  Those classes are located in the
// AbbotLabInfo, BinaxNowCovidTest, and collectively for test results the
// BinaxNowCovidTestResult and BinaxNowCovidTestResultCode files which share the
// name with their included class.

// Gather information about your patient.  Do note our patient address
// has a zip code of all zeroes.  This is specific to how Meadows Design
// was onboarded and will likely not work for your test and production
// credentials granted to you by your preferred MARS Hub.  When
// implementing your application, make sure you send a valid zip code.
// Also note, age is required.  Whether you discern that from the patient's
// birthdate or ask them specifically is up to you.
// One final note.  This API, while capable of making information optional, can
// assume no liability on whether or not your implementation gathered the
// information.  The RADx program requires you to ask certain information of
// your test users.  If the information is required to be asked, the API will
// require you submit it a value -- even if that value is null -- to serve as
// an attestation the patient was asked this information and opted not to
// provide it.
const patientAge: number = 28
const patient = new Patient(
  'YOUR_PATIENT_ID',
  patientAge,
  ExtendedAddress.MinExtendedAddress('00000'),
  null,
  null,
  null,
  null,
  null,
  null
)

// Gather information about our test kit.  Your information may be obtained
// via a barcode or some other means, but the test kit id is a unique
// identifier for the testkit provided by you and/or the testkit manufacturer.
// Hint: Your TestKit ID will likely not be 'Your Test Kit ID'.
const testKit = new TestKit('Your Test Kit ID', new Date(), new Date())

// Here you define the test result.  This is a combination of the test result
// definition as well as the test result of the individual.  You could, in
// your implementation and as we've done here, derive a class from the
// TestResult such that you do not need to provide the unchanging arguments of
// result id, test result description, etc. every time a user takes a test.
// We've defined test results for four permutations though we'll only use one of
// them.  They're to show as examples of how one might construct positive,
// negative, and invalid results.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const positiveTestResult = new BinaxNowCovidTestResult(
  new Date(),
  BinaxNowCovidDetectedTestResultCodes.Detected,
  TestResultAbnormalFlagsCode.Detected
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const negativeTestResult = new BinaxNowCovidTestResult(
  new Date(),
  BinaxNowCovidDetectedTestResultCodes.NotDetected,
  TestResultAbnormalFlagsCode.NotDetected
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const invalidTestResult1 = new BinaxNowCovidTestResult(
  new Date(),
  BinaxNowCovidDetectedTestResultCodes.Invalid,
  TestResultAbnormalFlagsCode.Detected
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const invalidTestResult2 = new BinaxNowCovidTestResult(
  new Date(),
  BinaxNowCovidDetectedTestResultCodes.Invalid,
  TestResultAbnormalFlagsCode.NotDetected
)

// Here you submit the result.  Remember, the result submitter is created from
// the mars client and submits results for a specific test to the hub
// (provided to the mars client) for a specific test (also provided to the
// mars client).
console.log('Submitting result')

void resultSubmitter.submitResult(
  patient,
  testKit,
  [negativeTestResult])

console.log('Submitted.')
