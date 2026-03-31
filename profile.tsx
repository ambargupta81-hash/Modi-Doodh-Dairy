import { useState } from "react";
import { Layout } from "@/components/layout";
import { useStore } from "@/store/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Gift, User, LogOut, Mail, Phone, MapPin, Plus, Trash2, CheckCircle, IndianRupee, Share2, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function getSavedAddresses(): SavedAddress[] {
  try {
    return JSON.parse(localStorage.getItem("saved-addresses") || "[]");
  } catch {
    return [];
  }
}

function setSavedAddresses(addresses: SavedAddress[]) {
  localStorage.setItem("saved-addresses", JSON.stringify(addresses));
}

export default function Profile() {
  const { user, applyReferral, logout } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [promoCode, setPromoCode] = useState("");

  // Saved addresses state
  const [addresses, setAddresses] = useState<SavedAddress[]>(getSavedAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "", city: "", state: "", pincode: "" });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({
      title: "Referral Code Copied!",
      description: "Share this code with friends to earn ₹1 when they order.",
    });
  };

  const handleShareCode = () => {
    const message = `Use my referral code ${user.referralCode} on Modi Doodh Dairy to get ₹1 off your first order! Shop fresh dairy products at our store.`;
    if (navigator.share) {
      navigator.share({ title: "Modi Doodh Dairy Referral", text: message });
    } else {
      navigator.clipboard.writeText(message);
      toast({ title: "Message Copied!", description: "Share it with your friends." });
    }
  };

  const handleApplyPromo = async () => {
    if (promoCode.length < 4) {
      toast({ title: "Invalid Code", variant: "destructive", description: "Please enter a valid referral code." });
      return;
    }
    try {
      const response = await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: promoCode, userId: user?.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Invalid Code", variant: "destructive", description: data.error || "Invalid referral code." });
        return;
      }
      applyReferral(promoCode, data.discount);
      toast({ title: "Promo Code Applied!", description: data.message });
      setPromoCode("");
    } catch {
      toast({ title: "Error", variant: "destructive", description: "Failed to apply code. Try again." });
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
    toast({ title: "Logged out successfully" });
  };

  const handleSaveAddress = () => {
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.state) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const updated = [...addresses, { ...newAddress, id: Math.random().toString(36).substring(7) }];
    setAddresses(updated);
    setSavedAddresses(updated);
    setNewAddress({ label: "", address: "", city: "", state: "", pincode: "" });
    setShowAddForm(false);
    toast({ title: "Address Saved!" });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    setSavedAddresses(updated);
    toast({ title: "Address Removed" });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">My Account</h1>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-card border-border/60 shadow-sm text-center py-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border-4 border-background shadow-inner">
                <User className="w-10 h-10" />
              </div>
              <h2 className="font-display font-bold text-xl px-4">{user.name}</h2>
              <Badge variant="secondary" className="mt-2 mb-4">Active Member</Badge>
              <Separator className="mb-4" />
              <div className="space-y-3 px-6 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="font-medium text-foreground">{user.phone}</p>
                  </div>
                </div>
                {user.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium text-foreground break-all">{user.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Referral Balance</p>
                    <p className="font-bold text-secondary">₹{user.referralBalance ?? 0}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">Quick Actions</p>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setLocation("/orders")}>
                  <ShoppingBag className="w-4 h-4 mr-3 text-primary" /> My Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setLocation("/support")}>
                  <Phone className="w-4 h-4 mr-3 text-blue-500" /> Customer Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-8">

            {/* Refer & Earn Section */}
            <Card className="border-secondary/20 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Gift className="w-32 h-32 text-secondary" />
              </div>
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-secondary">Refer & Earn</CardTitle>
                    <CardDescription>Invite friends and earn ₹1 when they use your code.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 relative z-10 space-y-6">

                {/* How it works */}
                <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                  <p className="text-sm font-semibold text-foreground mb-3">How Refer & Earn Works</p>
                  <div className="space-y-3">
                    {[
                      { icon: Share2, step: "1", text: "Share your unique referral code with friends and family." },
                      { icon: ShoppingBag, step: "2", text: "Your friend enters your code when placing their order." },
                      { icon: IndianRupee, step: "3", text: "You earn ₹1 added to your referral balance instantly." },
                      { icon: CheckCircle, step: "4", text: "Apply your balance as a discount on your next order at checkout." },
                    ].map(({ icon: Icon, step, text }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{step}</div>
                        <div className="flex items-start gap-2">
                          <Icon className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Your Referral Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-muted/50 border border-border/60 rounded-xl px-4 py-3 font-mono font-bold text-lg tracking-wider text-center flex items-center justify-center">
                      {user.referralCode}
                    </div>
                    <Button onClick={handleCopyCode} variant="outline" className="h-auto w-14 shrink-0 rounded-xl shadow-sm">
                      <Copy className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleShareCode} className="h-auto w-14 shrink-0 rounded-xl shadow-sm hover-elevate">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Current Balance: <span className="font-bold text-secondary">₹{user.referralBalance ?? 0}</span>
                  </p>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <label className="text-sm font-semibold text-foreground mb-2 block">Have a friend's promo code?</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter referral code here" 
                      className="h-12 bg-card"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button onClick={handleApplyPromo} className="h-12 px-6 shadow-sm hover-elevate active-elevate-2">Apply</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Applying a valid code gives you ₹1 off your current order.</p>
                </div>
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Saved Addresses</CardTitle>
                      <CardDescription>Manage your delivery addresses</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="h-9"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">

                {/* Add Address Form */}
                {showAddForm && (
                  <div className="bg-muted/30 rounded-xl border border-border/60 p-4 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Add New Address</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Label (e.g. Home, Office) *</label>
                        <Input
                          placeholder="e.g. Home"
                          value={newAddress.label}
                          onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Address *</label>
                        <Input
                          placeholder="Street, Area, Landmark"
                          value={newAddress.address}
                          onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">City *</label>
                        <Input
                          placeholder="City"
                          value={newAddress.city}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">State *</label>
                        <Input
                          placeholder="State"
                          value={newAddress.state}
                          onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Pincode</label>
                        <Input
                          placeholder="Pincode"
                          value={newAddress.pincode}
                          onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button onClick={handleSaveAddress} size="sm" className="h-9">Save Address</Button>
                      <Button variant="ghost" size="sm" className="h-9" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !showAddForm ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No saved addresses yet.</p>
                    <p className="text-xs mt-1">Add an address for quick checkout.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="flex items-start justify-between gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">{addr.label}</Badge>
                            <p className="text-sm text-foreground">{addr.address}</p>
                            <p className="text-xs text-muted-foreground">{addr.city}, {addr.state}{addr.pincode ? ` - ${addr.pincode}` : ""}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}
