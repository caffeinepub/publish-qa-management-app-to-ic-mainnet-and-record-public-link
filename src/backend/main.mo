import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Include authorization mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Website Testing Data Types
  type TestCase = {
    id : Nat;
    description : Text;
    steps : Text;
  };

  type Bug = {
    id : Nat;
    description : Text;
    severity : Severity;
  };

  type CornerCase = {
    id : Nat;
    description : Text;
    scenario : Text;
  };

  type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  type Website = {
    id : Nat;
    owner : Principal;
    url : Text;
    title : Text;
    testCases : [TestCase];
    bugs : [Bug];
    cornerCases : [CornerCase];
  };

  var nextWebsiteId = 1;
  var nextTestCaseId = 1;
  var nextBugId = 1;
  var nextCornerCaseId = 1;

  let websites = Map.empty<Nat, Website>();

  // Generate baseline data
  public shared ({ caller }) func generateWebsiteTestingData(url : Text, title : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate website testing data");
    };

    let websiteId = nextWebsiteId;
    nextWebsiteId += 1;

    let testCases = generateTestCases(url);
    let bugs = generateBugs(url);
    let cornerCases = generateCornerCases(url);

    let website : Website = {
      id = websiteId;
      owner = caller;
      url;
      title;
      testCases;
      bugs;
      cornerCases;
    };

    websites.add(websiteId, website);
    websiteId;
  };

  func generateTestCases(url : Text) : [TestCase] {
    [
      {
        id = nextTestCaseId;
        description = "Verify homepage loads successfully for " # url;
        steps = "1. Navigate to " # url # " 2. Check page elements render";
      },
      {
        id = nextTestCaseId + 1;
        description = "Test navigation to About page";
        steps = "Click on About menu item and verify content";
      },
    ];
  };

  func generateBugs(url : Text) : [Bug] {
    [
      {
        id = nextBugId;
        description = "Potential layout issue on mobile devices";
        severity = #medium;
      },
      {
        id = nextBugId + 1;
        description = "Broken image resource detected";
        severity = #low;
      },
    ];
  };

  func generateCornerCases(url : Text) : [CornerCase] {
    [
      {
        id = nextCornerCaseId;
        description = "Load site with no internet connection";
        scenario = "Simulate offline access and observe behavior";
      },
      {
        id = nextCornerCaseId + 1;
        description = "Test with unsupported browser version";
        scenario = "Use legacy browser and check compatibility";
      },
    ];
  };

  // Query all websites for current user
  public query ({ caller }) func getWebsitesByUser() : async [Website] {
    websites.values().toArray().filter(
      func(website) {
        website.owner == caller;
      }
    );
  };

  // Query specific website by ID
  public query ({ caller }) func getWebsite(websiteId : Nat) : async ?Website {
    switch (websites.get(websiteId)) {
      case (null) { null };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only access your own websites");
        };
        ?website;
      };
    };
  };

  // Add new test case
  public shared ({ caller }) func addTestCase(websiteId : Nat, description : Text, steps : Text) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let testCase = {
          id = nextTestCaseId;
          description;
          steps;
        };
        nextTestCaseId += 1;

        let updatedTestCases = website.testCases.concat([testCase]);
        let updatedWebsite = { website with testCases = updatedTestCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Add new bug
  public shared ({ caller }) func addBug(websiteId : Nat, description : Text, severity : Severity) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let bug = {
          id = nextBugId;
          description;
          severity;
        };
        nextBugId += 1;

        let updatedBugs = website.bugs.concat([bug]);
        let updatedWebsite = { website with bugs = updatedBugs };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Add new corner case
  public shared ({ caller }) func addCornerCase(websiteId : Nat, description : Text, scenario : Text) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let cornerCase = {
          id = nextCornerCaseId;
          description;
          scenario;
        };
        nextCornerCaseId += 1;

        let updatedCornerCases = website.cornerCases.concat([cornerCase]);
        let updatedWebsite = { website with cornerCases = updatedCornerCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Update test case
  public shared ({ caller }) func updateTestCase(websiteId : Nat, testCaseId : Nat, description : Text, steps : Text) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedTestCases = website.testCases.map(
          func(testCase) {
            if (testCase.id == testCaseId) {
              { testCase with description; steps };
            } else {
              testCase;
            };
          }
        );
        let updatedWebsite = { website with testCases = updatedTestCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Update bug
  public shared ({ caller }) func updateBug(websiteId : Nat, bugId : Nat, description : Text, severity : Severity) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedBugs = website.bugs.map(
          func(bug) {
            if (bug.id == bugId) {
              { bug with description; severity };
            } else {
              bug;
            };
          }
        );
        let updatedWebsite = { website with bugs = updatedBugs };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Update corner case
  public shared ({ caller }) func updateCornerCase(websiteId : Nat, cornerCaseId : Nat, description : Text, scenario : Text) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedCornerCases = website.cornerCases.map(
          func(cornerCase) {
            if (cornerCase.id == cornerCaseId) {
              { cornerCase with description; scenario };
            } else {
              cornerCase;
            };
          }
        );
        let updatedWebsite = { website with cornerCases = updatedCornerCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Delete test case
  public shared ({ caller }) func deleteTestCase(websiteId : Nat, testCaseId : Nat) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedTestCases = website.testCases.filter(
          func(testCase) {
            testCase.id != testCaseId;
          }
        );
        let updatedWebsite = { website with testCases = updatedTestCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Delete bug
  public shared ({ caller }) func deleteBug(websiteId : Nat, bugId : Nat) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedBugs = website.bugs.filter(
          func(bug) {
            bug.id != bugId;
          }
        );
        let updatedWebsite = { website with bugs = updatedBugs };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };

  // Delete corner case
  public shared ({ caller }) func deleteCornerCase(websiteId : Nat, cornerCaseId : Nat) : async () {
    switch (websites.get(websiteId)) {
      case (null) {
        Runtime.trap("Website not found");
      };
      case (?website) {
        if (website.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own websites");
        };

        let updatedCornerCases = website.cornerCases.filter(
          func(cornerCase) {
            cornerCase.id != cornerCaseId;
          }
        );
        let updatedWebsite = { website with cornerCases = updatedCornerCases };
        websites.add(websiteId, updatedWebsite);
      };
    };
  };
};
