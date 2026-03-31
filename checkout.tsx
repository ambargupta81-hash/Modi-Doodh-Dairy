import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/store/use-store";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, ArrowRight, Wallet, Banknote, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { cart, user, clearCart, referralDiscount } = useStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "Madhya Pradesh",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0 && step === 1) {
      setLocation("/");
    }
  }, [cart, location, setLocation, step]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = cartSubtotal >= 700 || cartSubtotal === 0 ? 0 : 30;
  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - referralDiscount);

  const handleNextStep = () => {
    if (step === 1) {
      if (!address.name || !address.phone || !address.address || !address.city) {
        toast({ title: "Missing Fields", description: "Please fill all required address fields", variant: "destructive" });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'upi') setStep(3);
      else setStep(4);
    } else if (step === 3) {
      setStep(4); // from QR to confirm
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantityValue,
        unit: item.quantityUnit,
        price: item.price / (item.quantityValue / 1000),
        totalPrice: item.price,
      }));

      const response = await fetch(`${import.meta.env.BASE_URL}api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          customerName: address.name,
          customerPhone: address.phone,
          customerEmail: address.email || "",
          deliveryAddress: address.address,
          deliveryState: address.state,
          deliveryCity: address.city,
          items,
          paymentMethod,
          subtotal: cartSubtotal,
          deliveryCharge,
          totalAmount: cartTotal,
          referralDiscount,
        }),
      });

      if (!response.ok) {
        throw new Error("Order failed");
      }

      const order = await response.json();
      localStorage.setItem("lastOrderNumber", order.orderNumber);
      clearCart();
      setLocation("/success");
    } catch (err) {
      toast({ title: "Order Error", description: "There was an issue placing your order. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Checkout</h1>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>1. Address</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className={step >= 2 ? "text-primary" : ""}>2. Payment</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className={step >= 4 ? "text-primary" : ""}>3. Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle>Delivery Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input value={address.name} onChange={e=>setAddress({...address, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input value={address.phone} onChange={e=>setAddress({...address, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Address (House No, Street, Landmark) *</Label>
                        <Input value={address.address} onChange={e=>setAddress({...address, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>State *</Label>
                          <Input value={address.state} onChange={e=>setAddress({...address, state: e.target.value})} />
                        </div>
                      </div>
                      <Button className="w-full mt-4 h-12 text-base shadow-md hover-elevate active-elevate-2" onClick={handleNextStep}>
                        Continue to Payment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle>Select Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${paymentMethod === 'upi' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <QrCode className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Scan & Pay (UPI)</h3>
                            <p className="text-sm text-muted-foreground">Pay securely via PhonePe, GPay, Paytm etc.</p>
                          </div>
                          {paymentMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                        </div>
                      </div>

                      <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${paymentMethod === 'cod' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <Banknote className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Cash on Delivery</h3>
                            <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                          </div>
                          {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>Back</Button>
                        <Button className="flex-1 h-12 shadow-md hover-elevate active-elevate-2" onClick={handleNextStep}>
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && paymentMethod === 'upi' && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="border-primary/20 shadow-md bg-card overflow-hidden text-center">
                    <div className="bg-primary/10 py-4 border-b border-primary/10">
                      <h3 className="font-display font-semibold text-xl text-primary">UPI Payment</h3>
                    </div>
                    <CardContent className="p-6 md:p-8 flex flex-col items-center">
                      <p className="text-lg text-foreground font-medium mb-2">Scan QR code to pay <span className="font-bold text-primary text-2xl ml-1">₹{cartTotal}</span></p>
                      <p className="text-sm text-muted-foreground mb-6">UPI ID: <span className="font-mono font-semibold text-foreground bg-muted px-2 py-1 rounded">9575364720@naviaxis</span></p>
                      
                      <div className="w-64 h-64 bg-white p-4 rounded-2xl shadow-inner border border-border/50 mb-8 mx-auto relative group">
                        <img src={`${import.meta.env.BASE_URL}images/upi_qr.jpeg`} alt="UPI QR Code" className="w-full h-full object-contain" />
                      </div>

                      <div className="flex gap-3 w-full">
                        <Button variant="outline" className="w-1/3 h-12" onClick={() => setStep(2)}>Back</Button>
                        <Button className="w-2/3 h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md hover-elevate active-elevate-2 text-base font-semibold" onClick={handleNextStep}>
                          Yes, I have paid
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="border-border/50 shadow-sm border-t-4 border-t-primary">
                    <CardHeader>
                      <CardTitle>Confirm Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Required Important Note Box */}
                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 sm:p-5 shadow-sm">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">⚠️ Important Note</h4>
                            <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-200/80">
                              Delivery charges may vary according to your city and location. It may also take variable time to deliver your order. Please be aware and don't be irritated. An email will be sent to you regarding delivery charges and delivery time. You can contact and track your order by messaging or calling the phone number provided in the email.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-sm">
                        <h4 className="font-semibold mb-2">Deliver To:</h4>
                        <p className="text-muted-foreground">{address.name} ({address.phone})</p>
                        <p className="text-muted-foreground">{address.address}, {address.city}, {address.state}</p>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" className="w-1/3 h-14" disabled={isLoading} onClick={() => setStep(paymentMethod === 'upi' ? 3 : 2)}>Back</Button>
                        <Button 
                          className="w-2/3 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover-elevate active-elevate-2" 
                          disabled={isLoading} 
                          onClick={handlePlaceOrder}
                        >
                          {isLoading ? "Processing..." : `Confirm Order (₹${cartTotal})`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-sm sticky top-24 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg flex items-center justify-between">
                  Order Summary
                  <Badge variant="secondary" className="font-normal">{cart.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.quantityValue} {item.quantityUnit}</span>
                      </div>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-secondary font-medium" : ""}>
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {referralDiscount > 0 && (
                    <div className="flex justify-between text-secondary font-medium">
                      <span>Referral Discount</span>
                      <span>-₹{referralDiscount}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
