import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useStore } from "@/store/use-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Ban, RefreshCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: Array<{ productName: string; quantity: number; unit: string; totalPrice: number }>;
  createdAt: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  paymentMethod: string;
  cancellationReason?: string;
}

export default function Orders() {
  const { user } = useStore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.reverse());
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (response.ok) {
        toast({ title: "Order Cancelled", description: "Your order has been cancelled successfully. We have been notified." });
        fetchOrders();
      } else {
        const data = await response.json();
        toast({ title: "Cannot Cancel", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to cancel order", variant: "destructive" });
    }
    setCancelOrderId(null);
    setCancelReason("");
  };

  const handleReturn = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/return`, { method: "POST" });
      if (response.ok) {
        toast({ title: "Return Requested", description: "Your return request has been submitted. We will contact you soon." });
        fetchOrders();
      }
    } catch {
      toast({ title: "Error", description: "Failed to request return", variant: "destructive" });
    }
    setReturnOrderId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'return_requested': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return 'Order Submitted';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'return_requested': return 'Return Requested';
      default: return status;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="py-20 text-center max-w-md mx-auto px-4">
          <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-muted-foreground mb-6">Login to see your orders.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Your orders will appear here once you place one.</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map(order => {
            const isCancelled = order.status === 'cancelled' || order.status === 'return_requested';
            return (
              <Card key={order.id} className="border-border/60 shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-foreground text-sm">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {format(new Date(order.createdAt), 'PPP p')}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                    <p className="font-bold text-lg text-primary">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Items Ordered</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.productName} <span className="text-muted-foreground">({item.quantity}{item.unit})</span></span>
                          <span className="font-medium">₹{item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">Delivery to:</span> {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    <span className="font-medium">Payment:</span> {order.paymentMethod === 'upi' ? 'UPI / Online' : 'Cash on Delivery'}
                  </p>

                  {order.status === 'cancelled' && order.cancellationReason && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Cancellation Reason</p>
                      <p className="text-sm text-red-600 dark:text-red-300">{order.cancellationReason}</p>
                    </div>
                  )}


                  <div className="flex gap-3 justify-end border-t border-border/50 pt-4">
                    {['submitted', 'confirmed'].includes(order.status) && (
                      <Button
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-9 text-sm"
                        onClick={() => { setCancelReason(""); setCancelOrderId(order.id); }}
                      >
                        <Ban className="w-4 h-4 mr-2" /> Cancel Order
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        className="h-9 text-sm"
                        onClick={() => setReturnOrderId(order.id)}
                      >
                        <RefreshCcw className="w-4 h-4 mr-2" /> Request Return
                      </Button>
                    )}
                    {order.status === 'return_requested' && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-500" /> Return request submitted. We'll contact you.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cancel Order Dialog with Reason */}
      <AlertDialog open={!!cancelOrderId} onOpenChange={(open) => { if (!open) { setCancelOrderId(null); setCancelReason(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1 py-2">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Reason for Cancellation <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="e.g. Changed my mind, Ordered by mistake, Delivery time too long..."
              className="resize-none min-h-[80px]"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelReason("")}>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelOrderId && handleCancel(cancelOrderId)}
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!returnOrderId} onOpenChange={() => setReturnOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Return?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to request a return for this order? Our team will contact you within 24 hours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => returnOrderId && handleReturn(returnOrderId)}>
              Yes, Request Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
