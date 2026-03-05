import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  Loader2,
  LogIn,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import type { Booking } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllBookings,
  useGetAllServices,
  useIsCallerAdmin,
  useSeedServices,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const STATUS_CONFIG = {
  [BookingStatus.pending]: {
    label: "Pending",
    variant: "secondary" as const,
    icon: AlertCircle,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground font-body">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingRow({
  booking,
  serviceName,
  index,
}: {
  booking: Booking;
  serviceName: string;
  index: number;
}) {
  const updateStatus = useUpdateBookingStatus();
  const config = STATUS_CONFIG[booking.status];
  const StatusIcon = config.icon;

  async function handleStatusChange(newStatus: string) {
    const statusMap: Record<string, BookingStatus> = {
      pending: BookingStatus.pending,
      confirmed: BookingStatus.confirmed,
      cancelled: BookingStatus.cancelled,
    };
    const status = statusMap[newStatus];
    if (!status) return;

    try {
      await updateStatus.mutateAsync({ bookingId: booking.id, status });
      toast.success(`Booking updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <tr
      className="border-b border-border hover:bg-muted/30 transition-colors"
      data-ocid={`admin.booking.row.${index + 1}`}
    >
      <td className="px-4 py-3 text-sm font-body">
        <div className="font-medium text-foreground">
          {booking.customerName}
        </div>
        <div className="text-xs text-muted-foreground">{booking.email}</div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground font-body hidden sm:table-cell">
        {booking.phone}
      </td>
      <td className="px-4 py-3 text-sm text-foreground font-body hidden md:table-cell">
        {serviceName}
      </td>
      <td className="px-4 py-3 text-sm font-body hidden lg:table-cell">
        <div className="text-foreground">{booking.date}</div>
        <div className="text-xs text-muted-foreground">{booking.timeSlot}</div>
      </td>
      <td className="px-4 py-3">
        <Badge className={`text-xs font-body border ${config.className}`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Select
          value={booking.status}
          onValueChange={handleStatusChange}
          disabled={updateStatus.isPending}
        >
          <SelectTrigger
            className="w-32 h-8 text-xs font-body"
            data-ocid={`admin.booking.status.select.${index + 1}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending" className="text-xs font-body">
              Pending
            </SelectItem>
            <SelectItem value="confirmed" className="text-xs font-body">
              Confirmed
            </SelectItem>
            <SelectItem value="cancelled" className="text-xs font-body">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </td>
    </tr>
  );
}

function AccessDenied() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  return (
    <main className="min-h-screen texture-bg flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card
          className="border-border shadow-lg overflow-hidden text-center"
          data-ocid="admin.access_denied.card"
        >
          <div className="h-2 bg-destructive" />
          <CardContent className="p-10 space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Access Denied
              </h2>
              <p className="text-muted-foreground font-body text-sm">
                {isAuthenticated
                  ? "You don't have admin privileges to view this page."
                  : "Please log in to access the admin dashboard."}
              </p>
            </div>
            {!isAuthenticated && (
              <Button
                onClick={() => {
                  try {
                    login();
                  } catch {
                    // ignore
                  }
                }}
                disabled={isLoggingIn}
                className="bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum font-body w-full"
                data-ocid="admin.login.button"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoggingIn ? "Logging in…" : "Login"}
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => {
                  queryClient.clear();
                }}
                className="border-border font-body w-full"
                data-ocid="admin.refresh.button"
              >
                Refresh Access
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: services } = useGetAllServices();
  const seedServices = useSeedServices();
  const [seeded, setSeeded] = useState(false);
  // Seed services on first admin load
  // biome-ignore lint/correctness/useExhaustiveDependencies: mutateAsync is stable
  useEffect(() => {
    if (isAdmin && !seeded) {
      setSeeded(true);
      seedServices.mutateAsync().catch(() => {
        // Silently ignore seed errors
      });
    }
  }, [isAdmin, seeded]);

  // Loading state
  if (adminLoading) {
    return (
      <main
        className="min-h-screen texture-bg py-10 px-4"
        data-ocid="admin.loading_state"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64 shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["stat1", "stat2", "stat3"].map((key) => (
              <Skeleton key={key} className="h-24 shimmer" />
            ))}
          </div>
          <Skeleton className="h-64 shimmer" />
        </div>
      </main>
    );
  }

  // Access control
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Build service map
  const serviceMap = new Map(
    services?.map((s) => [s.id.toString(), s.name]) ?? [],
  );

  const totalBookings = bookings?.length ?? 0;
  const pendingCount =
    bookings?.filter((b) => b.status === BookingStatus.pending).length ?? 0;
  const confirmedCount =
    bookings?.filter((b) => b.status === BookingStatus.confirmed).length ?? 0;

  async function handleSeed() {
    try {
      await seedServices.mutateAsync();
      toast.success("Services seeded successfully!");
    } catch {
      toast.error("Failed to seed services");
    }
  }

  return (
    <main className="min-h-screen texture-bg py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-0.5 gold-gradient rounded-full" />
              <span className="text-gold text-xs font-body tracking-widest uppercase">
                Management
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <Button
            onClick={handleSeed}
            disabled={seedServices.isPending}
            variant="outline"
            size="sm"
            className="border-border font-body gap-2"
            data-ocid="admin.seed.button"
          >
            {seedServices.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            Seed Services
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="admin.stats.section"
        >
          <StatCard
            label="Total Bookings"
            value={totalBookings}
            icon={Calendar}
            color="bg-plum/10 text-plum"
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={Clock}
            color="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Confirmed"
            value={confirmedCount}
            icon={Users}
            color="bg-emerald-100 text-emerald-700"
          />
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border shadow-md overflow-hidden">
            <div className="h-1 gold-gradient" />
            <CardHeader className="px-6 py-4 border-b border-border">
              <CardTitle className="font-display text-xl text-foreground">
                All Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bookingsLoading ? (
                <div
                  className="p-6 space-y-3"
                  data-ocid="admin.bookings.loading_state"
                >
                  {["row1", "row2", "row3", "row4"].map((key) => (
                    <Skeleton key={key} className="h-12 shimmer" />
                  ))}
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full" data-ocid="admin.bookings.table">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider hidden sm:table-cell">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider hidden md:table-cell">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider hidden lg:table-cell">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                          Update
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, i) => (
                        <BookingRow
                          key={booking.id.toString()}
                          booking={booking}
                          serviceName={
                            serviceMap.get(booking.serviceId.toString()) ??
                            "Unknown Service"
                          }
                          index={i}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-16 space-y-3 text-center"
                  data-ocid="admin.bookings.empty_state"
                >
                  <Sparkles className="w-10 h-10 text-gold" />
                  <p className="font-display text-lg text-foreground">
                    No bookings yet
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    Bookings will appear here once clients start reserving
                    appointments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
