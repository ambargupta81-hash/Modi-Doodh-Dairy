import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/store/use-store";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowLeft, Phone, Mail, User, Lock, KeyRound, Send, MailCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [, setLocation] = useLocation();
  const { setUser } = useStore();
  const { toast } = useToast();

  // Login fields
  const [loginForm, setLoginForm] = useState({ phone: "", email: "", otp: "" });

  // Register fields
  const [regForm, setRegForm] = useState({ name: "", phone: "", email: "", password: "", otp: "" });

  const switchMode = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setStep("form");
    setSentTo("");
    setLoginForm({ phone: "", email: "", otp: "" });
    setRegForm({ name: "", phone: "", email: "", password: "", otp: "" });
  };

  // ─── LOGIN FLOW ───────────────────────────────────────────────────
  const handleSendLoginOtp = async () => {
    if (!loginForm.phone || loginForm.phone.length < 10) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!loginForm.email || !loginForm.email.includes("@")) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginForm.phone, email: loginForm.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }
      setSentTo(data.message || `OTP sent to your email`);
      setStep("otp");
      toast({ title: "OTP Sent!", description: data.message });
    } catch {
      toast({ title: "Error", description: "Failed to send OTP. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtp = async () => {
    if (!loginForm.otp || loginForm.otp.length !== 6) {
      toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginForm.phone, otp: loginForm.otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Login Failed", description: data.error, variant: "destructive" });
        return;
      }
      setUser(data.user, data.token);
      toast({ title: "Welcome Back!", description: `Hello ${data.user.name}! You are now logged in.` });
      setLocation("/");
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── REGISTER FLOW ───────────────────────────────────────────────
  const handleSendRegisterOtp = async () => {
    if (!regForm.name) {
      toast({ title: "Please enter your full name", variant: "destructive" });
      return;
    }
    if (!regForm.phone || regForm.phone.length < 10) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!regForm.email || !regForm.email.includes("@")) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    if (!regForm.password || regForm.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: regForm.phone, email: regForm.email, name: regForm.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }
      setSentTo(data.message || `OTP sent to ${regForm.email}`);
      setStep("otp");
      toast({ title: "OTP Sent!", description: data.message });
    } catch {
      toast({ title: "Error", description: "Failed to send OTP. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegisterOtp = async () => {
    if (!regForm.otp || regForm.otp.length !== 6) {
      toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regForm }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Registration Failed", description: data.error, variant: "destructive" });
        return;
      }
      setUser(data.user, data.token);
      toast({ title: "Account Created!", description: `Welcome, ${data.user.name}! You are now logged in.` });
      setLocation("/");
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 shadow-xl shadow-black/5 bg-card overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-amber-400 to-primary" />

            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                {step === "otp"
                  ? <MailCheck className="w-6 h-6 text-primary" />
                  : <ShieldCheck className="w-6 h-6 text-primary" />}
              </div>
              <CardTitle className="font-display text-2xl">
                {step === "otp" ? "Check Your Email" : isRegister ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {step === "otp"
                  ? sentTo
                  : isRegister
                    ? "Join Modi Doodh Dairy for fresh deliveries"
                    : "Login to access your orders and fast checkout"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">

                {/* ─── LOGIN FORM ─── */}
                {!isRegister && step === "form" && (
                  <motion.div key="login-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                        </Label>
                        <Input
                          id="login-phone"
                          type="tel"
                          placeholder="Enter your 10-digit phone number"
                          className="bg-muted/30 h-12 focus-visible:ring-primary/20"
                          value={loginForm.phone}
                          onChange={e => setLoginForm({ ...loginForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" /> Registered Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your registered email"
                          className="bg-muted/30 h-12 focus-visible:ring-primary/20"
                          value={loginForm.email}
                          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">OTP will be sent to this email to verify your identity</p>
                      </div>
                      <Button
                        className="w-full h-12 text-base font-semibold shadow-md"
                        onClick={handleSendLoginOtp}
                        disabled={isLoading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isLoading ? "Sending OTP..." : "Send OTP to Email"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ─── LOGIN OTP ─── */}
                {!isRegister && step === "otp" && (
                  <motion.div key="login-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="space-y-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                        <MailCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">OTP Sent Successfully</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Please open your email and enter the 6-digit OTP below. It expires in 10 minutes.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-otp" className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-muted-foreground" /> One-Time Password (OTP)
                        </Label>
                        <Input
                          id="login-otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter 6-digit OTP"
                          className="bg-muted/30 h-14 text-center text-2xl font-mono tracking-[0.5em] focus-visible:ring-primary/20"
                          maxLength={6}
                          value={loginForm.otp}
                          onChange={e => setLoginForm({ ...loginForm, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                        />
                      </div>
                      <Button
                        className="w-full h-12 text-base font-semibold shadow-md"
                        onClick={handleVerifyLoginOtp}
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full h-10 text-sm text-muted-foreground"
                        onClick={() => { setStep("form"); setLoginForm({ ...loginForm, otp: "" }); setSentTo(""); }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Change Details
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ─── REGISTER FORM ─── */}
                {isRegister && step === "form" && (
                  <motion.div key="reg-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" /> Full Name
                        </Label>
                        <Input
                          id="reg-name"
                          placeholder="e.g. Ramesh Kumar"
                          className="bg-muted/30 h-11 focus-visible:ring-primary/20"
                          value={regForm.name}
                          onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                        </Label>
                        <Input
                          id="reg-phone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          className="bg-muted/30 h-11 focus-visible:ring-primary/20"
                          value={regForm.phone}
                          onChange={e => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                        </Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-muted/30 h-11 focus-visible:ring-primary/20"
                          value={regForm.email}
                          onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Verification OTP will be sent to this email</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-muted-foreground" /> Password
                        </Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Minimum 6 characters"
                          className="bg-muted/30 h-11 focus-visible:ring-primary/20"
                          value={regForm.password}
                          onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                        />
                      </div>
                      <Button
                        className="w-full h-12 text-base font-semibold shadow-md"
                        onClick={handleSendRegisterOtp}
                        disabled={isLoading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isLoading ? "Sending OTP..." : "Send OTP to Email"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ─── REGISTER OTP ─── */}
                {isRegister && step === "otp" && (
                  <motion.div key="reg-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="space-y-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                        <MailCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">OTP Sent to Your Email</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Check your inbox at <span className="font-medium text-foreground">{regForm.email}</span> and enter the 6-digit OTP below.</p>
                        </div>
                      </div>
                      <div className="bg-muted/40 rounded-xl p-4 text-sm space-y-1.5">
                        <p className="font-semibold text-foreground mb-2">Registration Summary</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-3.5 h-3.5" /> <span className="font-medium text-foreground">{regForm.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" /> <span className="font-medium text-foreground">{regForm.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" /> <span className="font-medium text-foreground">{regForm.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-otp" className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-muted-foreground" /> One-Time Password (OTP)
                        </Label>
                        <Input
                          id="reg-otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter 6-digit OTP"
                          className="bg-muted/30 h-14 text-center text-2xl font-mono tracking-[0.5em] focus-visible:ring-primary/20"
                          maxLength={6}
                          value={regForm.otp}
                          onChange={e => setRegForm({ ...regForm, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                        />
                        <p className="text-xs text-muted-foreground text-center">OTP expires in 10 minutes</p>
                      </div>
                      <Button
                        className="w-full h-12 text-base font-semibold shadow-md"
                        onClick={handleVerifyRegisterOtp}
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Verify & Create Account"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full h-10 text-sm text-muted-foreground"
                        onClick={() => { setStep("form"); setRegForm({ ...regForm, otp: "" }); setSentTo(""); }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Edit Details
                      </Button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border/50 pt-5">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  className="ml-1 text-primary font-semibold hover:underline"
                  onClick={() => switchMode(!isRegister)}
                >
                  {isRegister ? "Login here" : "Register now"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
