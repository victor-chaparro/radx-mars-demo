import {
  MarsClient,
  MarsLabInfo,
  IsoHierarchicDesignator,
  CliaHierarchicDesignator,
  TestResult,
  RequiredAddress,
  PerformingOrganization,
  SpecimenCollectionType,
  Test,
  Patient,
  TestKit,
  TestResultCode
} from 'radx-mars-lib'
// Instantiate the required arguments
import { AimsHubProvider } from 'aims-mars-lib'
import CodingSystem from 'radx-mars-lib/dist/models/CodingSystem'
import TestAbnormalFlagsCode from 'radx-mars-lib/dist/models/TestResultAbnormalFlagsCode'
import ExtendedAddress from 'radx-mars-lib/dist/models/ExtendedAddress'

// Note, we considered making a global production/stage setup, but there's
// a large set of configuration that would be thrust on the user at this
// point.  We may come back and revisit it at some point.  For now, we're going
// to allow the user to establish sending/separating production and stage for
// anything that is NOT a hub provider.

// HELPERS WE CAN BURY IN AN APP
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class BinaxCovidDetectedTestResultCodes {
  static readonly Detected = new TestResultCode('260373001', 'Detected')
  static readonly NotDetected = new TestResultCode('260415000', 'Not Detected')
}

// ONE TIME SETUP.
const provider = new AimsHubProvider(
  'RADx',
  { bucketPath: 'aims-partners5/AIDAUMG6XAMHS73BBUGJF/SendTo' },
  false)

const abbotLabInfo = new MarsLabInfo(
  new IsoHierarchicDesignator('AbbottInformatics', '2.16.840.1.113883.3.8589.4.1.22'),
  new CliaHierarchicDesignator('AbbottInformatics', '00Z0000002'),
  new RequiredAddress('1 fake street', '', 'Nowhere', 'LA', '00000')
)

const binaxCovidTest = new Test(
  '94558-4',
  'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
  PerformingOrganization.OtcProctor,
  SpecimenCollectionType.AnteriorNaresSwab,
  CodingSystem.LOINC_271
)

// Then create a new MARSClient
const client = new MarsClient(provider, abbotLabInfo)
const resultSubmitter = client.createResultSubmitter(binaxCovidTest)

// PER TEST SETUP.

const patient = new Patient('id', 28, ExtendedAddress.MinExtendedAddress('00000'), null, null, null, null, null, null)
const testKit = new TestKit('Test Kit ID', new Date(), new Date())
const testResult = new TestResult(
  '94558-4',
  'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
  '10811877011337_DIT',
  new Date(),
  BinaxCovidDetectedTestResultCodes.Detected,
  TestAbnormalFlagsCode.Detected, // TODO: Move this so the user doens't have to supply it.  How?
  CodingSystem.LOINC_271
)
resultSubmitter.submitResult(
  patient,
  testKit,
  testResult)

/* eslint-disable max-len */

/*
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
