import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateBooking,
  useGetAllServices,
  useGetAvailableTimeSlots,
} from "../hooks/useQueries";

type FormData = {
  customerName: string;
  phone: string;
  email: string;
  serviceId: string;
  date: string;
  timeSlot: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.customerName.trim()) errors.customerName = "Name is required";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(data.phone.trim()))
    errors.phone = "Enter a valid phone number";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Enter a valid email";
  if (!data.serviceId) errors.serviceId = "Please select a service";
  if (!data.date) errors.date = "Please pick a date";
  else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today)
      errors.date = "Date must be today or in the future";
  }
  if (!data.timeSlot) errors.timeSlot = "Please select a time slot";
  return errors;
}

function getTodayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function BookingPage() {
  const { data: services, isLoading: servicesLoading } = useGetAllServices();
  const createBooking = useCreateBooking();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    phone: "",
    email: "",
    serviceId: "",
    date: "",
    timeSlot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmedBookingId, setConfirmedBookingId] = useState<bigint | null>(
    null,
  );

  const serviceIdBigint = form.serviceId ? BigInt(form.serviceId) : null;

  const {
    data: availableSlots,
    isLoading: slotsLoading,
    isFetching: slotsFetching,
  } = useGetAvailableTimeSlots(serviceIdBigint, form.date);

  // Clear time slot when service or date changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset on serviceId/date change
  useEffect(() => {
    setForm((prev) => ({ ...prev, timeSlot: "" }));
  }, [form.serviceId, form.date]);

  const selectedService = services?.find(
    (s) => s.id.toString() === form.serviceId,
  );

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const bookingId = await createBooking.mutateAsync({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceId: BigInt(form.serviceId),
        date: form.date,
        timeSlot: form.timeSlot,
      });
      setConfirmedBookingId(bookingId);
      toast.success("Booking confirmed! See you soon.");
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  }

  // ── Success State ───────────────────────────────────────
  if (confirmedBookingId !== null) {
    return (
      <main className="min-h-screen texture-bg flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
          data-ocid="booking.success_state"
        >
          <Card className="border-border shadow-xl overflow-hidden">
            <div className="h-2 gold-gradient" />
            <CardContent className="p-10 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-10 h-10 text-plum" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground font-body">
                  We look forward to seeing you.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-5 text-left space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-semibold text-plum font-display">
                    #{confirmedBookingId.toString()}
                  </span>
                </div>
                {selectedService && (
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">
                      {selectedService.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {new Date(`${form.date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">
                    {form.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">
                    {form.customerName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="flex-1"
                  data-ocid="booking.success.home.button"
                >
                  <Button
                    variant="outline"
                    className="w-full border-border font-body"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  className="flex-1 bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum font-body"
                  onClick={() => {
                    setConfirmedBookingId(null);
                    setForm({
                      customerName: "",
                      phone: "",
                      email: "",
                      serviceId: "",
                      date: "",
                      timeSlot: "",
                    });
                  }}
                  data-ocid="booking.success.new_booking.button"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Book Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  // ── Booking Form ────────────────────────────────────────
  return (
    <main className="min-h-screen texture-bg py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body transition-colors mb-6"
            data-ocid="booking.back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-0.5 gold-gradient rounded-full" />
            <span className="text-gold text-xs font-body tracking-widest uppercase">
              Reserve Your Spot
            </span>
            <div className="w-10 h-0.5 gold-gradient rounded-full" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground font-body mt-3">
            Fill in the details below and we'll confirm your appointment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border shadow-lg overflow-hidden">
            <div className="h-1.5 gold-gradient" />
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-gold" />
                    Personal Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="customerName"
                        className="text-sm font-body font-medium"
                      >
                        Full Name <span className="text-rose">*</span>
                      </Label>
                      <Input
                        id="customerName"
                        type="text"
                        placeholder="Sophia Anderson"
                        value={form.customerName}
                        onChange={(e) =>
                          handleChange("customerName", e.target.value)
                        }
                        className={`font-body ${errors.customerName ? "border-destructive" : ""}`}
                        data-ocid="booking.name.input"
                        autoComplete="name"
                      />
                      {errors.customerName && (
                        <p
                          className="text-xs text-destructive font-body"
                          data-ocid="booking.name.error_state"
                        >
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-body font-medium"
                      >
                        <Phone className="w-3 h-3 inline mr-1" />
                        Phone <span className="text-rose">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={`font-body ${errors.phone ? "border-destructive" : ""}`}
                        data-ocid="booking.phone.input"
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p
                          className="text-xs text-destructive font-body"
                          data-ocid="booking.phone.error_state"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-sm font-body font-medium"
                    >
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email <span className="text-rose">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sophia@example.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`font-body ${errors.email ? "border-destructive" : ""}`}
                      data-ocid="booking.email.input"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p
                        className="text-xs text-destructive font-body"
                        data-ocid="booking.email.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Service & Scheduling */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Service & Schedule
                  </h3>

                  {/* Service Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-body font-medium">
                      Service <span className="text-rose">*</span>
                    </Label>
                    {servicesLoading ? (
                      <Skeleton className="h-10 w-full shimmer" />
                    ) : (
                      <Select
                        value={form.serviceId}
                        onValueChange={(v) => handleChange("serviceId", v)}
                      >
                        <SelectTrigger
                          className={`font-body ${errors.serviceId ? "border-destructive" : ""}`}
                          data-ocid="booking.service.select"
                        >
                          <SelectValue placeholder="Choose a service…" />
                        </SelectTrigger>
                        <SelectContent>
                          {services?.map((s) => (
                            <SelectItem
                              key={s.id.toString()}
                              value={s.id.toString()}
                              className="font-body"
                            >
                              <div className="flex items-center gap-3">
                                <span>{s.name}</span>
                                <span className="text-muted-foreground text-xs">
                                  {Number(s.duration)} min · $
                                  {(Number(s.price) / 100).toFixed(0)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.serviceId && (
                      <p
                        className="text-xs text-destructive font-body"
                        data-ocid="booking.service.error_state"
                      >
                        {errors.serviceId}
                      </p>
                    )}
                    {/* Selected service summary */}
                    {selectedService && (
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="font-body text-xs"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {Number(selectedService.duration)} min
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="font-body text-xs"
                        >
                          ${(Number(selectedService.price) / 100).toFixed(2)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="date"
                      className="text-sm font-body font-medium"
                    >
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Preferred Date <span className="text-rose">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={getTodayString()}
                      value={form.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className={`font-body ${errors.date ? "border-destructive" : ""}`}
                      data-ocid="booking.date.input"
                    />
                    {errors.date && (
                      <p
                        className="text-xs text-destructive font-body"
                        data-ocid="booking.date.error_state"
                      >
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Slot */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-body font-medium">
                      Time Slot <span className="text-rose">*</span>
                    </Label>
                    {!form.serviceId || !form.date ? (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-muted/40">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-body">
                          Select a service and date first
                        </span>
                      </div>
                    ) : slotsLoading || slotsFetching ? (
                      <div
                        className="flex items-center gap-2 h-10 px-3"
                        data-ocid="booking.slots.loading_state"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-body">
                          Loading available slots…
                        </span>
                      </div>
                    ) : availableSlots && availableSlots.length > 0 ? (
                      <Select
                        value={form.timeSlot}
                        onValueChange={(v) => handleChange("timeSlot", v)}
                      >
                        <SelectTrigger
                          className={`font-body ${errors.timeSlot ? "border-destructive" : ""}`}
                          data-ocid="booking.timeslot.select"
                        >
                          <SelectValue placeholder="Choose a time…" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map((slot) => (
                            <SelectItem
                              key={slot}
                              value={slot}
                              className="font-body"
                            >
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div
                        className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-muted/40"
                        data-ocid="booking.slots.empty_state"
                      >
                        <span className="text-sm text-muted-foreground font-body">
                          No slots available for this date. Try another date.
                        </span>
                      </div>
                    )}
                    {errors.timeSlot && (
                      <p
                        className="text-xs text-destructive font-body"
                        data-ocid="booking.timeslot.error_state"
                      >
                        {errors.timeSlot}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={createBooking.isPending}
                  className="w-full bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum font-body text-base h-12"
                  data-ocid="booking.submit.button"
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                {createBooking.isError && (
                  <p
                    className="text-center text-sm text-destructive font-body"
                    data-ocid="booking.form.error_state"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
