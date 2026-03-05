import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    duration : Nat;
    price : Nat;
  };

  type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    email : Text;
    serviceId : Nat;
    date : Text;
    timeSlot : Text;
    status : BookingStatus;
    createdAt : Int;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type UserProfile = {
    name : Text;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Nat.compare(booking1.id, booking2.id);
    };
  };

  module Service {
    public func compare(service1 : Service, service2 : Service) : Order.Order {
      Nat.compare(service1.id, service2.id);
    };
  };

  var nextServiceId = 1;
  var nextBookingId = 1;

  let services = Map.empty<Nat, Service>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public shared ({ caller }) func seedServices() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can seed services");
    };

    if (services.isEmpty()) {
      addServiceInternal("Haircut", "Professional hairstyling", 30, 2500);
      addServiceInternal("Facial", "Rejuvenating skin treatment", 60, 4000);
      addServiceInternal("Manicure", "Nail grooming and polish", 45, 2000);
      addServiceInternal("Pedicure", "Foot care and polish", 50, 3000);
      addServiceInternal("Waxing", "Hair removal service", 40, 3500);
    };
  };

  func addServiceInternal(name : Text, description : Text, duration : Nat, price : Nat) {
    let service : Service = {
      id = nextServiceId;
      name;
      description;
      duration;
      price;
    };
    services.add(nextServiceId, service);
    nextServiceId += 1;
  };

  public shared ({ caller }) func addService(name : Text, description : Text, duration : Nat, price : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add services");
    };
    addServiceInternal(name, description, duration, price);
  };

  public shared ({ caller }) func updateService(id : Nat, name : Text, description : Text, duration : Nat, price : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update services");
    };

    let service : Service = {
      id;
      name;
      description;
      duration;
      price;
    };

    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?_) {
        services.add(id, service);
      };
    };
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete services");
    };

    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };

    services.remove(id);
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray().sort();
  };

  public query ({ caller }) func getService(id : Nat) : async Service {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  public shared ({ caller }) func createBooking(customerName : Text, phone : Text, email : Text, serviceId : Nat, date : Text, timeSlot : Text) : async Nat {
    if (customerName == "" or phone == "" or email == "") {
      Runtime.trap("Invalid input: customer name, phone, and email are required");
    };

    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Invalid service ID") };
      case (?_) {
        let booking : Booking = {
          id = nextBookingId;
          customerName;
          phone;
          email;
          serviceId;
          date;
          timeSlot;
          status = #pending;
          createdAt = Time.now();
        };
        bookings.add(nextBookingId, booking);
        nextBookingId += 1;
        booking.id;
      };
    };
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          customerName = booking.customerName;
          phone = booking.phone;
          email = booking.email;
          serviceId = booking.serviceId;
          date = booking.date;
          timeSlot = booking.timeSlot;
          status;
          createdAt = booking.createdAt;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view bookings");
    };
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func getBooking(id : Nat) : async Booking {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view booking details");
    };
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public query ({ caller }) func getAvailableTimeSlots(serviceId : Nat, date : Text) : async [Text] {
    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Invalid service ID") };
      case (?_) {
        let allTimeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

        let bookingsForServiceAndDate = bookings.values().toArray().filter(
          func(booking) {
            booking.serviceId == serviceId and booking.date == date
          }
        );

        let bookedSlots = bookingsForServiceAndDate.map(
          func(booking) { booking.timeSlot }
        );

        let availableSlots = allTimeSlots.filter(
          func(slot) {
            not bookedSlots.values().any(
              func(bookedSlot) { bookedSlot == slot }
            );
          }
        );

        availableSlots;
      };
    };
  };
};
