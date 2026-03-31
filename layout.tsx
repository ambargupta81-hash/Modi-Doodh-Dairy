import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User as UserIcon, Home, Package, Gift, Phone, LogOut, HeadphonesIcon, Info } from "lucide-react";
import { useStore } from "@/store/use-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cart, isCartOpen, setCartOpen, removeFromCart, user, logout } = useStore();

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = cartSubtotal >= 700 || cartSubtotal === 0 ? 0 : 30;
  const referralDiscount = useStore(state => state.referralDiscount);
  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - referralDiscount);

  const NavLinks = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <Link href="/" onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
        <Home className="w-4 h-4" /> Home
      </Link>
      {user && (
        <Link href="/orders" onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/orders' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
          <Package className="w-4 h-4" /> My Orders
        </Link>
      )}
      <Link href={user ? "/profile" : "/login"} onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/profile' || location === '/login' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
        <UserIcon className="w-4 h-4" /> {user ? "Profile" : "Login"}
      </Link>
      {user && (
        <Link href="/profile" onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/profile' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
          <Gift className="w-4 h-4" /> Refer & Earn
        </Link>
      )}
      <Link href="/support" onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/support' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
        <HeadphonesIcon className="w-4 h-4" /> Support
      </Link>
      <Link href="/about" onClick={onNavClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary ${location === '/about' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
        <Info className="w-4 h-4" /> About Us
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-primary/20 group-hover:shadow-md transition-all">
                <img src={`${import.meta.env.BASE_URL}images/logo.jpeg`} alt="Modi Doodh Dairy" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors">Modi Doodh</span>
                <span className="text-xs font-medium tracking-widest text-primary uppercase">DAIRY</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavLinks />
            </nav>

            {/* Mobile Menu Toggle & Cart */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] flex flex-col">
          <SheetHeader className="pb-6 border-b border-border text-left">
            <SheetTitle className="font-display text-2xl text-primary">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-6 flex-1">
            <NavLinks onNavClick={() => setIsMobileMenuOpen(false)} />
          </div>
          {user && (
            <div className="pb-6">
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                <img src={`${import.meta.env.BASE_URL}images/logo.jpeg`} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">Modi Doodh Dairy</span>
            </div>
            <p className="text-muted-foreground text-sm text-balance">
              Providing farm-fresh dairy products with purity and tradition directly to your home.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/profile" className="hover:text-primary transition-colors">My Account</Link>
              <Link href="/orders" className="hover:text-primary transition-colors">Order History</Link>
              <Link href="/support" className="hover:text-primary transition-colors">Customer Support</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="mailto:f4710301@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">@</div>
                f4710301@gmail.com
              </a>
              <a href="mailto:sahusobhit51@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">@</div>
                sahusobhit51@gmail.com
              </a>
              <a href="tel:+919575364720" className="flex items-center gap-2 hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Phone className="w-4 h-4" />
                </div>
                +91 9575364720
              </a>
              <p className="text-xs text-muted-foreground/80 mt-2">Available on WhatsApp</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Modi Doodh Dairy. All rights reserved.
        </div>
      </footer>

      {/* Floating Cart Button */}
      {location !== '/checkout' && location !== '/success' && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-xl shadow-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 active:translate-y-0 transition-all duration-300"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                {cart.length}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Cart
              </SheetTitle>
              {cart.length > 0 && <Badge variant="secondary">{cart.length} Items</Badge>}
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1 p-6 bg-background/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 opacity-60">
                <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" onClick={() => setCartOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-card p-3 rounded-xl border border-border shadow-sm">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-sm leading-tight text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.quantityValue} {item.quantityUnit}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-primary">₹{item.price}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {cart.length > 0 && (
            <div className="p-6 bg-card border-t border-border space-y-4">
              {/* Important Note */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-[11px] leading-tight text-amber-800 dark:text-amber-200">
                <span className="font-bold">⚠️ Important Note:</span> Delivery charges may vary according to your city and location. Delivery time may also vary. You will receive an email with delivery charges and expected delivery time. Contact us via the phone number provided in the email to track your order.
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span className={deliveryCharge === 0 ? "text-secondary font-medium" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-[10px] text-primary/80 text-right">Add ₹{700 - cartSubtotal} more for FREE delivery!</p>
                )}
                {referralDiscount > 0 && (
                  <div className="flex justify-between text-secondary font-medium">
                    <span>Referral Discount</span>
                    <span>-₹{referralDiscount}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>

              <SheetFooter>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full text-base font-semibold hover-elevate active-elevate-2 shadow-lg shadow-primary/20" size="lg" onClick={() => setCartOpen(false)}>
                    Proceed to Checkout
                  </Button>
                </Link>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
