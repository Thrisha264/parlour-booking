import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Clock, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Service } from "../backend.d";
import { useGetAllServices } from "../hooks/useQueries";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const price = Number(service.price) / 100;
  const duration = Number(service.duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`services.item.${index + 1}`}
    >
      <Card className="group h-full border-border hover:border-gold/40 transition-all duration-300 hover:shadow-gold overflow-hidden bg-card">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Top decoration */}
          <div className="w-10 h-0.5 gold-gradient rounded-full mb-4 group-hover:w-16 transition-all duration-500" />

          <div className="flex-1 space-y-3">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-plum transition-colors">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
              {service.description}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="text-xs font-body bg-secondary text-secondary-foreground"
              >
                <Clock className="w-3 h-3 mr-1" />
                {duration} min
              </Badge>
              <span className="text-lg font-semibold text-plum font-display">
                ${price.toFixed(2)}
              </span>
            </div>
            <Link
              to="/book"
              search={{ serviceId: service.id.toString() }}
              data-ocid={`services.book.button.${index + 1}`}
            >
              <Button
                size="sm"
                className="bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum text-xs"
              >
                Book
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ServiceSkeleton() {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-0.5 w-10 shimmer" />
        <Skeleton className="h-5 w-3/4 shimmer" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full shimmer" />
          <Skeleton className="h-3 w-5/6 shimmer" />
          <Skeleton className="h-3 w-4/6 shimmer" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 shimmer rounded-full" />
            <Skeleton className="h-5 w-14 shimmer" />
          </div>
          <Skeleton className="h-8 w-16 shimmer rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

const TESTIMONIALS = [
  {
    name: "Sophia M.",
    rating: 5,
    text: "Absolutely divine experience. The Rose Glow facial left my skin radiant for weeks!",
    service: "Rose Glow Facial",
  },
  {
    name: "Isabella R.",
    rating: 5,
    text: "The hot stone massage was beyond luxurious. The team is incredibly skilled and attentive.",
    service: "Hot Stone Massage",
  },
  {
    name: "Charlotte B.",
    rating: 5,
    text: "My bridal party loved the nail artistry service. Truly elevated our special day.",
    service: "Bridal Nail Artistry",
  },
];

export default function HomePage() {
  const { data: services, isLoading, isError } = useGetAllServices();

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/parlour-hero.dim_1200x500.jpg"
            alt="Glamour Parlour interior"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-0.5 gold-gradient rounded-full" />
                <span className="text-gold text-sm font-body tracking-widest uppercase">
                  Premium Beauty Studio
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6"
            >
              Look Good,
              <br />
              <span className="text-gold italic">Feel Great</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 font-body text-lg leading-relaxed mb-8"
            >
              Indulge in our curated collection of luxury beauty treatments.
              From rejuvenating facials to blissful massage therapies — every
              visit is an experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/book" search={{}} data-ocid="hero.book_now.button">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white shadow-gold font-body text-base px-8 py-3 h-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </Link>
              <a href="#services" data-ocid="hero.services.button">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-body text-base px-8 py-3 h-auto"
                >
                  View Services
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="bg-plum py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5,000+", label: "Happy Clients" },
              { value: "15+", label: "Expert Therapists" },
              { value: "30+", label: "Luxury Services" },
              { value: "8 yrs", label: "Excellence" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="font-display text-3xl font-bold text-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 font-body">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section id="services" className="py-20 texture-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-0.5 gold-gradient rounded-full" />
              <span className="text-gold text-xs font-body tracking-widest uppercase">
                Our Offerings
              </span>
              <div className="w-12 h-0.5 gold-gradient rounded-full" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Luxury Services
            </h2>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Each treatment is tailored to your needs, delivered with precision
              and care by our expert team.
            </p>
          </motion.div>

          {/* Grid */}
          {isError ? (
            <div
              className="text-center py-12 text-muted-foreground font-body"
              data-ocid="services.error_state"
            >
              Unable to load services. Please try again later.
            </div>
          ) : isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="services.loading_state"
            >
              {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((key) => (
                <ServiceSkeleton key={key} />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard
                  key={service.id.toString()}
                  service={service}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 space-y-4"
              data-ocid="services.empty_state"
            >
              <Sparkles className="w-10 h-10 text-gold mx-auto" />
              <p className="text-muted-foreground font-body">
                Services are being prepared. Check back soon!
              </p>
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/book"
              search={{}}
              data-ocid="services.book_appointment.button"
            >
              <Button
                size="lg"
                className="bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum font-body px-10"
              >
                Book an Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-0.5 gold-gradient rounded-full" />
              <span className="text-gold text-xs font-body tracking-widest uppercase">
                Client Love
              </span>
              <div className="w-12 h-0.5 gold-gradient rounded-full" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              What They Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6 space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: t.rating },
                        (_, j) => `star-${j}`,
                      ).map((key) => (
                        <Star
                          key={key}
                          className="w-4 h-4 text-gold fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-foreground font-body text-sm leading-relaxed italic">
                      "{t.text}"
                    </p>
                    <div className="pt-2 border-t border-border">
                      <p className="font-display font-semibold text-plum text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {t.service}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-20 plum-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-48 h-48 rounded-full border-2 border-white" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Ready to Transform?
            </h2>
            <p className="text-primary-foreground/80 font-body text-lg max-w-md mx-auto">
              Book your appointment today and let us take care of the rest.
            </p>
            <Link to="/book" search={{}} data-ocid="cta.book.button">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-white shadow-gold font-body text-base px-10 py-3 h-auto mt-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Reserve Your Slot
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
