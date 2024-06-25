import {
  CliaHierarchicDesignator,
  IsoHierarchicDesignator,
  MarsLabInfo
} from 'radx-mars-lib'

/**
 * Setup our lab information.  Lab information is specific to the sender and
 * is provided by a governing authority.  It identifies the ISO and CLIA
 * designation of the Lab authorized to collect and report test results.
 */
export default class AbbottLabInfo extends MarsLabInfo {
  constructor () {
    super(
      new IsoHierarchicDesignator(
        'AbbottInformatics',
        '2.16.840.1.113883.3.8589.4.1.22'
      ),
      new CliaHierarchicDesignator(
        'AbbottInformatics',
        '00Z0000002'
      )
    )
  }
}
