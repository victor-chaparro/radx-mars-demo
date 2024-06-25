import {
  IsoHierarchicDesignator,
  type HierarchicDesignator,
  type MarsHubProvider
} from 'radx-mars-lib'

/**
 * This is a sample hub provider illustrating how you can extend the base class
 * to do simple debugging.
 */
export default class DebugHubProvider implements MarsHubProvider {
  get receivingApplicationIdentifier (): HierarchicDesignator {
    return new IsoHierarchicDesignator('AIMS.INTEGRATION.STG', '2.16.840.1.114222.4.3.15.2')
  }

  get receivingFacilityIdentifier (): HierarchicDesignator {
    return new IsoHierarchicDesignator('AIMS.PLATFORM', '2.16.840.1.114222.4.1.217446')
  }

  readonly isUsingProduction = false

  public async submitTest (hl7Message: any): Promise<boolean> {
    console.log(hl7Message)
    return true
  }
}
