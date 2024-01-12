import {
  CodingSystem,
  PerformingOrganization,
  SpecimenCollectionType,
  Test
} from 'radx-mars-lib'

// Define our test.  The test information may be gathered from the NIH
// PowerBI dashboard.  For us, this test information represents the
// Abbott BinaxNow COVID test.
export default class BinaxNowCovidTest extends Test {
  constructor () {
    super('94558-4',
      'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
      PerformingOrganization.OtcProctor,
      SpecimenCollectionType.AnteriorNaresSwab,
      CodingSystem.LOINC_271
    )
  }
}
