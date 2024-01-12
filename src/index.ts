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

// Note, we considered making a global production/stage setup, but there's
// a large set of configuration that would be thrust on the user at this
// point.  We may come back and revisit it at some point.  For now, we're going
// to allow the user to establish sending/separating production and stage for
// anything that is NOT a hub provider.

// ONE TIME SETUP.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const aimsHubProvider = new AimsHubProvider(
  'RADx',
  // TODO: Default bucketPath or allow for a prefix to be provided.
  { bucketPath: 'YOUR-AIMS-PROVIDED-BUCKET-PATH-HERE' },
  false)

// Instantiate the reportstream provider using the credentials
// provided by ReportStream.  In a real application, you should not embed
// credentials in the code but should, instead, pull them from some secure
// service, from environment variables, etc.  We've left in some values to
// provide you an example of what your configuration MAY look like.
const reportStreamHubProvider = new ReportStreamHubProvider(
  {
    privatePemString: `YOUR-PRIVATE-PEM-HERE`,
    algorithm: 'ES384',
    clientId: 'meadowsdesign',
    kid: 'meadowsdesign.default',
    scope: 'meadowsdesign.*.reporting'
  },
  false)

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

// PER TEST SETUP.
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
const testKit = new TestKit('Your Test Kit ID', new Date(), new Date())

// Here you define the test result.  This is a combination of the test result
// definition as well as the test result of the individual.  You could, in
// your implementation and as we've done here, derive a class from the
// TestResult such that you do not need to provide the unchanging arguments of
// result id, test result description, etc. every time a user takes a test.
const testResult = new BinaxNowCovidTestResult(
  new Date(),
  BinaxNowCovidDetectedTestResultCodes.Detected,
  TestResultAbnormalFlagsCode.Detected
)

// Here you submit the result.  Remember, the result submitter is created from
// the mars client and submits results for a specific test to the hub
// (provided to the mars client) for a specific test (also provided to the
// mars client).
void resultSubmitter.submitResult(
  patient,
  testKit,
  testResult)

/* eslint-disable max-len */

/*
    // This is a sample provider, illustrating how you can extend the
    // MarsHubProvider base class to add new providers to the system.
    class FakeHubProvider implements MarsHubProvider {
      get receivingApplicationIdentifier (): HierarchicDesignator {
        return new IsoHierarchicDesignator('AIMS.INTEGRATION.STG', '2.16.840.1.114222.4.3.15.2')
      }

      get receivingFacilityIdentifier (): HierarchicDesignator {
        return new IsoHierarchicDesignator('AIMS.PLATFORM', '2.16.840.1.114222.4.1.217446')
      }

      readonly isUsingProduction = false

      public submitTest (hl7Message: any): void {
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class BinaxCovidDetectedTestResultCodes {
      static readonly Detected = new TestResultCode('260373001', 'Detected')
      static readonly NotDetected = new TestResultCode('260415000', 'Not Detected')
    }
    const builder: HL7MessageBuilder = new HL7MessageBuilder(
      new FakeHubProvider(),
      new MarsLabInfo(
        new IsoHierarchicDesignator('AbbottInformatics', '2.16.840.1.113883.3.8589.4.1.22'),
        new CliaHierarchicDesignator('AbbottInformatics', '00Z0000002'),
        new RequiredAddress('1 fake street', '', 'Nowhere', 'LA', '00000')
      ),
      new Test(
        '94558-4',
        'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
        PerformingOrganization.OtcProctor,
        SpecimenCollectionType.AnteriorNaresSwab,
        CodingSystem.LOINC_271
      ),
      new TestKit('Test Kit ID', new Date()), //, new Date()),
      new Patient('id', 28, ExtendedAddress.MinExtendedAddress('00000'), null, null, null, null, null, null),
      [new TestResult(
        '94558-4',
        'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
        '10811877011337_DIT',
        new Date(),
        BinaxCovidDetectedTestResultCodes.Detected,
        TestAbnormalFlagsCode.Detected, // TODO: Move this so the user doens't have to supply it.  How?
        CodingSystem.LOINC_271
      )]
    )

    console.log(builder.buildMessage())
    */
