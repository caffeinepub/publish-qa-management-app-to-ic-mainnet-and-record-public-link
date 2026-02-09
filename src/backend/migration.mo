import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type Website = {
    id : Nat;
    owner : Principal.Principal;
    url : Text;
    title : Text;
    testCases : [TestCase];
    bugs : [Bug];
    cornerCases : [CornerCase];
  };

  public type TestCase = {
    id : Nat;
    description : Text;
    steps : Text;
  };

  public type Bug = {
    id : Nat;
    description : Text;
    severity : Severity;
  };

  public type CornerCase = {
    id : Nat;
    description : Text;
    scenario : Text;
  };

  public type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  type OldActor = {
    nextWebsiteId : Nat;
    websites : Map.Map<Nat, Website>;
    nextTestCaseId : Nat;
    nextBugId : Nat;
    nextCornerCaseId : Nat;
  };

  type NewActor = {
    nextWebsiteId : Nat;
    websites : Map.Map<Nat, Website>;
    nextTestCaseId : Nat;
    nextBugId : Nat;
    nextCornerCaseId : Nat;
  };

  func getMaxTestCaseId(websites : Map.Map<Nat, Website>) : Nat {
    var maxId = 0;
    for ((_, website) in websites.entries()) {
      for (testCase in website.testCases.values()) {
        if (testCase.id > maxId) { maxId := testCase.id };
      };
    };
    maxId;
  };

  func getMaxBugId(websites : Map.Map<Nat, Website>) : Nat {
    var maxId = 0;
    for ((_, website) in websites.entries()) {
      for (bug in website.bugs.values()) {
        if (bug.id > maxId) { maxId := bug.id };
      };
    };
    maxId;
  };

  func getMaxCornerCaseId(websites : Map.Map<Nat, Website>) : Nat {
    var maxId = 0;
    for ((_, website) in websites.entries()) {
      for (cornerCase in website.cornerCases.values()) {
        if (cornerCase.id > maxId) { maxId := cornerCase.id };
      };
    };
    maxId;
  };

  public func run(old : OldActor) : NewActor {
    let maxTestCaseId = getMaxTestCaseId(old.websites);
    let maxBugId = getMaxBugId(old.websites);
    let maxCornerCaseId = getMaxCornerCaseId(old.websites);

    {
      old with
      nextTestCaseId = maxTestCaseId + 1;
      nextBugId = maxBugId + 1;
      nextCornerCaseId = maxCornerCaseId + 1;
    };
  };
};
