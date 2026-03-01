import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Discipline = {
    #Rifle;
    #Pistol;
  };

  type Score = {
    shooterName : Text;
    discipline : Discipline;
    distance : Nat;
    scoreValue : Nat;
    date : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let scores = Map.empty<Text, Score>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // --- Access Control Management ---

  // Allows an admin to elevate any authenticated principal to admin role.
  // assignRole already includes an admin-only guard internally.
  public shared ({ caller }) func addAdminByPrincipal(adminPrincipal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add admins");
    };
    AccessControl.assignRole(accessControlState, caller, adminPrincipal, #admin);
  };

  // Allows an admin to grant the admin role to any principal.
  // assignRole already includes an admin-only guard internally.
  public shared ({ caller }) func grantAdminRole(target : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can grant the admin role");
    };
    AccessControl.assignRole(accessControlState, caller, target, #admin);
  };

  // --- User Profile Functions (required by frontend) ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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

  // --- Score Functions ---

  public shared ({ caller }) func addScore(
    id : Text,
    shooterName : Text,
    discipline : Discipline,
    distance : Nat,
    scoreValue : Nat,
    date : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add scores");
    };

    let score : Score = {
      shooterName;
      discipline;
      distance;
      scoreValue;
      date;
    };

    scores.add(id, score);
  };

  public query func getScores() : async [Score] {
    scores.values().toArray();
  };

  public shared ({ caller }) func deleteScore(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete scores");
    };

    switch (scores.get(id)) {
      case (null) {
        Runtime.trap("Score does not exist");
      };
      case (?_) {
        scores.remove(id);
      };
    };
  };
};
