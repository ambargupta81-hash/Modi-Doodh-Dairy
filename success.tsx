import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Success() {
  const storedOrder = localStorage.getItem("lastOrderNumber");
  const orderNumber = storedOrder || ("MDD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-secondary/5 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl shadow-secondary/10 max-w-lg w-full text-center border border-secondary/20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">Thank you for choosing Modi Doodh Dairy.</p>

        <div className="bg-muted/50 rounded-xl p-4 mb-8 inline-block min-w-[200px]">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Order Number</p>
          <p className="text-xl font-mono font-bold text-foreground">{orderNumber}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-8 text-balance">
          We have sent the order details and delivery information to your email and phone number.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-6">View Orders</Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto h-12 px-6 shadow-md hover-elevate active-elevate-2">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
