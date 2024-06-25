import {
  CodingSystem,
  TestResult,
  type TestResultAbnormalFlagsCode,
  type TestResultCode
} from 'radx-mars-lib'

/**
 * This class extends TestResult and serves to simply the construction of a
 * test result by hiding the passing of the immutable parameters to the base
 * TestResult class.  This is simply a design decision and is unnecessary in
 * any implementation -- you may simply construct a TestResult.
 */
export default class BinaxNowCovidTestResult extends TestResult {
  constructor (
    determinationDate: Date,
    testResultCode: TestResultCode,
    testResultAbnormalFlagsCode: TestResultAbnormalFlagsCode
  ) {
    super(
      '94558-4',
      'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
      '10811877011337_DIT',
      determinationDate,
      testResultCode,
      testResultAbnormalFlagsCode,
      CodingSystem.LOINC_271
    )
  }
}
