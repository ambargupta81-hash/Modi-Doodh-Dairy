import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Phone, Mail, MessageCircle, Clock, HeadphonesIcon,
  Send, MapPin, CheckCircle2, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Delivery time varies by city and location. After you place an order, we will send you an email with estimated delivery time and charges. Typically it is 1–3 days for nearby areas."
  },
  {
    q: "Can I cancel my order?",
    a: "Yes! You can cancel your order from the 'My Orders' page as long as the status is 'Submitted' or 'Confirmed'. Once processing has started, cancellation is not possible."
  },
  {
    q: "How do I track my order?",
    a: "After placing an order, you will receive an email with our contact number. You can call or WhatsApp us to get a live update on your order delivery."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI payments (PhonePe, GPay, Paytm, etc.) via our QR code, and Cash on Delivery (COD) for all orders."
  },
  {
    q: "How does Refer & Earn work?",
    a: "Share your unique referral code with friends. When they apply your code during checkout, you earn ₹1 in your wallet balance. You can use this balance as a discount on your future orders."
  },
  {
    q: "How do I return a product?",
    a: "If you received a damaged or incorrect product, go to 'My Orders', find your delivered order, and click 'Request Return'. Our team will contact you within 24 hours."
  },
];

export default function Support() {
  const { toast } = useToast();
  const [support, setSupport] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!support.name || !support.phone || !support.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(support),
      });
      if (res.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll respond within 24 hours. You can also call or WhatsApp us directly.",
        });
        setSupport({ name: "", phone: "", message: "" });
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Failed to send",
        description: "Please call or WhatsApp us directly at +91 9575364720.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary/5 border-b border-primary/10 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-3">Customer Support</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We're here for you — reach out via WhatsApp, call, or email. We respond fast!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Contact Cards */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Contact Us Directly</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* WhatsApp */}
            <Card className="border-border/60 shadow-sm hover:border-green-400/60 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">WhatsApp</p>
                  <p className="text-sm text-muted-foreground mb-3">Reply within minutes</p>
                  <a
                    href="https://wa.me/919575364720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat Now
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-border/60 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Call Us</p>
                  <p className="text-sm text-muted-foreground mb-2">Mon–Sat, 8 AM – 8 PM</p>
                  <a href="tel:+919575364720" className="text-primary font-bold text-base hover:underline block">
                    +91 9575364720
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Email 1 */}
            <Card className="border-border/60 shadow-sm hover:border-blue-400/60 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Email — Owner</p>
                  <p className="text-sm text-muted-foreground mb-2">We reply within 24 hrs</p>
                  <a href="mailto:f4710301@gmail.com" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline break-all">
                    f4710301@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Email 2 */}
            <Card className="border-border/60 shadow-sm hover:border-blue-400/60 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Email — Support</p>
                  <p className="text-sm text-muted-foreground mb-2">We reply within 24 hrs</p>
                  <a href="mailto:sahusobhit51@gmail.com" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline break-all">
                    sahusobhit51@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hours + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Support Hours</p>
                  <p className="text-sm text-muted-foreground">Mon – Sat: <span className="text-foreground font-medium">8:00 AM – 8:00 PM</span></p>
                  <p className="text-sm text-muted-foreground">Sunday: <span className="text-foreground font-medium">9:00 AM – 2:00 PM</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">UPI Payment ID</p>
                  <p className="text-sm text-foreground font-mono font-semibold">9575364720@naviaxis</p>
                  <p className="text-xs text-muted-foreground mt-1">Use for UPI transfers / payments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Form + FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Send Us a Message</h2>
            <Card className="border-border/60 shadow-md">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">Your Name *</label>
                      <Input
                        placeholder="e.g. Ramesh Kumar"
                        className="bg-muted/30"
                        value={support.name}
                        onChange={e => setSupport({ ...support, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                      <Input
                        placeholder="e.g. 9876543210"
                        type="tel"
                        className="bg-muted/30"
                        value={support.phone}
                        onChange={e => setSupport({ ...support, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Your Message *</label>
                    <Textarea
                      placeholder="Describe your issue, order query, or feedback..."
                      className="resize-none min-h-[150px] bg-muted/30"
                      value={support.message}
                      onChange={e => setSupport({ ...support, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md" disabled={sending}>
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Or WhatsApp us at{" "}
                    <a href="https://wa.me/919575364720" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                      +91 9575364720
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <Card
                  key={i}
                  className={`border-border/60 shadow-sm cursor-pointer transition-all hover:border-primary/40 ${openFaq === i ? 'border-primary/40' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-sm text-foreground leading-snug">{faq.q}</p>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-muted-foreground mt-3 leading-relaxed overflow-hidden"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
