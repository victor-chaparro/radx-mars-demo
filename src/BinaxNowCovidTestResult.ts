import {
  CodingSystem,
  TestResult,
  type TestResultAbnormalFlagsCode,
  type TestResultCode
} from 'radx-mars-lib'

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
      testResultAbnormalFlagsCode, // TODO: Move this so the user doens't have to supply it.  How?
      CodingSystem.LOINC_271
    )
  }
}
