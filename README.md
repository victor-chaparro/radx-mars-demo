# Walkthrough of `radx-mars-demo`

## Overview
The `radx-mars-demo` is a TypeScript project demonstrating the use of the `radx-mars-lib` and its extensions for constructing and submitting HL7 messages to MARS Hubs. The demo includes setting up the necessary configurations, creating patient and test data, and demonstrating the submission process.  In this demo we construct an HL7 message submitting the result of an Abbott Labs' BinaxNow test to a MARS hub.

### Before We Begin
This demo relies on a set of three libraries briefly enumerated as follows:

* `radx-mars-lib` - A library containing a set of base classes, interfaces, models, and classes upon which additional libraries can and have been built.  This library contains all of the core classes responsible for constructing an HL7 ELR 2.5.1 with all content required by MARS Hubs as defined by the NIH and validated by the NIST HL7 ELR 2.5.1 validator.  The construction of the HL7 message is abstracted into a set of friendly model classes.  The delivery of the HL7 message is coorrdinated internally through a set of internal classes and an implementation of a `MarsHubProvider`.  
* `aims-mars-lib` - This library contains an implementation of a `MarsHubProvider` capable of delivering an HL7 message generated from within `radx-mars-lib` to the APHL AIMS MARS Hub.  You will leverage this library if you want to deliver your HL7 messages through AIMS.  This library requires the `radx-mars-lib` library as a dependency.
* `reportstream-mars-lib` - This library contains an implementation of a `MarsHubProvider` capable of delivering an HL7 message generated from within `radx-mars-lib` to the CDC Report Stream MARS Hub.  You will leverage this library if you want to deliver your HL7 messages through Report Stream.  This library requires the `radx-mars-lib` library as a dependency.

During the demo we will construct a `MarsClient`.  The `MarsClient` class is defined in `radx-mars-lib` and serves as the coordinator of all activity.  It is responsible for initating the construction of the HL7 message and constructing a `LabResultSubmitter` class used to submit HL7 messages specific to a particular test to a MARS Hub implemented as a `MarsHubProvider`.  This should become clearer as we walk through the construction of this demo.

**Important**: These packages are NOT currently hosted in NPM.  As such, the dependencies for this package are pulled from bitbucket as dependencies.  You may need to build each of the packages individually as the dist/ directories are not part of the git repository commits.

## Step-by-Step Implementation

### Setting Up Hub Providers
The demo begins by initializing two hub providers, `AimsHubProvider` from `aims-mars-lib` and `ReportStreamHubProvider` from `reportstream-mars-lib`. These are configured with necessary details for connecting to their respective MARS Hubs.  You will need to retrieve credentials for your chosen provider from the provider maintainer.  You will typically only use a single provider in your solution.  We have included in this demo a simple `DebugHubProvider` class you can use to view the message you would otherwise send to a MARS provider.

```typescript
const aimsHubProvider = new AimsHubProvider('RADx', { bucketPath: '...' }, false);
const reportStreamHubProvider = new ReportStreamHubProvider({ ...credentials... }, false);
```

### The MarsClient
The `MarsClient` class is the starting point for all implementations.  The `MarsClient` class orchestrates the generation of HL7 messages and their submission to a RADx MARS Hub.

### Initializing the MarsClient
In this demo, a `MarsClient` instance is created with the `ReportStreamHubProvider` (you can modify it to use the `AimsHubProvider` -- `MarsHubProvider`s are interchangeable) and an instance of `AbbottLabInfo`. `AbbottLabInfo` is an extension of the base `MarsLabInfo` class contained in `radx-mars-lib`.  You will want provide an instance of `MarsLabInfo` during construction of your `MarsClient` or extend `MarsLabInfo` as we have done here.

The generated `MarsClient` client is responsible for handling HL7 message generation and submission.

```typescript
const client = new MarsClient(reportStreamHubProvider, new AbbottLabInfo());
```

### Creating a Result Submitter
The demo sets up a result submitter (an instance of `LabResultSubmitter` using the `MarsClient`. A `LabResultSubmitter` is capable of sending results for a specific test type  (in this case, `BinaxNowCovidTest`, an extension of the `Test` class in `radx-mars-lib`) to facilitate the submission of test results.  

```typescript
const resultSubmitter = client.createResultSubmitter(new BinaxNowCovidTest());
```

### Gathering Patient Information
Patient data is then collected and a `Patient` object is created. This object captures essential information such as the patient's ID, age, and address.

```typescript
const patientAge = 28;
const patient = new Patient('YOUR_PATIENT_ID', patientAge, ExtendedAddress.MinExtendedAddress('00000'), ...);
```

A couple of things to note about the construction of a `Patient`.  There are a couple of required fields regarding the test subject you must capture prior to submission of a test.  The first is the patient age.  You can either get the patient age by acquiring the patient birthdate or by asking them for it directly.  The second piece of required information is the patient's zipcode.  You can see we've supplied both of them in the code from the demo above.

### Preparing the Test Kit and Test Result
We can now prepare information about the test kit and the test result. A `TestKit` instance and a `BinaxNowCovidTestResult` instance are created with necessary details like test kit ID, test dates, and result codes.  The `BinaxNowCovidTestResult` is an extension of the `TestResult` class defined in the `radx-mars-lib` library and simply serves as a way to construct a new `TestResult` without entering all of the information every time.  The creation of a class that extends `TestResult` is a design choice and is not required.

```typescript
const testKit = new TestKit('Test Kit ID', new Date(), new Date());
const testResult = new BinaxNowCovidTestResult(new Date(), BinaxNowCovidDetectedTestResultCodes.Detected, TestResultAbnormalFlagsCode.Detected);
```

### Submitting the Test Result
Finally, the test result is submitted using the result submitter. This step demonstrates how the assembled

data is sent to the MARS Hub, showcasing the end-to-end functionality of the `radx-mars-lib` and its extensions.

```typescript
resultSubmitter.submitResult(patient, testKit, testResult);
```

In this step, the `submitResult` method of the result submitter is called with the patient information, test kit details, and test result. This method manages the creation of the HL7 message and its submission to the specified MARS Hub.

---

This walkthrough covers the key steps implemented in the `radx-mars-demo` project. It demonstrates how the `radx-mars-lib` and its extensions can be utilized to construct HL7 messages and interact with different MARS Hubs. The demo provides a practical example of setting up necessary configurations, preparing patient and test data, and submitting this data as an HL7 message. 
