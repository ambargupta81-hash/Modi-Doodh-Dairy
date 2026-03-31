import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const NOTIFY_EMAILS = ["f4710301@gmail.com", "sahusobhit51@gmail.com"];
const FROM_EMAIL = "f4710301@gmail.com";
const APP_PASS = "wgwxqkdvyhikxivw";

function generateOrderNumber(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MDD-${now}-${rand}`;
}

async function sendOrderEmail(order: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: FROM_EMAIL,
        pass: APP_PASS,
      },
    });

    const itemsHtml = order.items.map((item: any) =>
      `<tr><td style="padding:8px;border:1px solid #eee">${item.productName}</td><td style="padding:8px;border:1px solid #eee">${item.quantity}${item.unit}</td><td style="padding:8px;border:1px solid #eee">₹${item.price}/kg</td><td style="padding:8px;border:1px solid #eee">₹${item.totalPrice.toFixed(2)}</td></tr>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <div style="background:#2d6a4f;color:white;padding:20px;text-align:center">
          <h1 style="margin:0">Modi Doodh Dairy</h1>
          <p style="margin:5px 0 0">New Order Notification</p>
        </div>
        <div style="padding:20px">
          <h2 style="color:#2d6a4f">Order Details</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:15px">
            <tr><td style="padding:8px;font-weight:bold">Order Number</td><td style="padding:8px">${order.orderNumber}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Date</td><td style="padding:8px">${new Date(order.createdAt).toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Customer Name</td><td style="padding:8px">${order.customerName}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${order.customerPhone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${order.customerEmail || "N/A"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Delivery Address</td><td style="padding:8px">${order.deliveryAddress}, ${order.deliveryCity}, ${order.deliveryState}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Payment Method</td><td style="padding:8px">${order.paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}</td></tr>
          </table>

          <h3 style="color:#2d6a4f">Items Ordered</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:15px">
            <thead>
              <tr style="background:#f0f8f0">
                <th style="padding:8px;border:1px solid #eee;text-align:left">Product</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Quantity</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Rate</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;text-align:right;font-weight:bold">Subtotal:</td><td style="padding:8px;text-align:right">₹${order.subtotal.toFixed(2)}</td></tr>
            ${order.referralDiscount > 0 ? `<tr><td style="padding:8px;text-align:right;color:green;font-weight:bold">Referral Discount:</td><td style="padding:8px;text-align:right;color:green">-₹${order.referralDiscount.toFixed(2)}</td></tr>` : ""}
            <tr><td style="padding:8px;text-align:right;font-weight:bold">Delivery Charge:</td><td style="padding:8px;text-align:right">${order.deliveryCharge === 0 ? "FREE" : "₹" + order.deliveryCharge.toFixed(2)}</td></tr>
            <tr style="font-size:1.1em"><td style="padding:8px;text-align:right;font-weight:bold;color:#2d6a4f">Total Amount:</td><td style="padding:8px;text-align:right;font-weight:bold;color:#2d6a4f">₹${order.totalAmount.toFixed(2)}</td></tr>
          </table>
        </div>
        <div style="background:#f0f8f0;padding:15px;text-align:center;color:#666;font-size:12px">
          <p>Modi Doodh Dairy | Contact: +919575364720 | f4710301@gmail.com</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Modi Doodh Dairy" <${FROM_EMAIL}>`,
      to: NOTIFY_EMAILS.join(", "),
      subject: `New Order ${order.orderNumber} - Modi Doodh Dairy`,
      html,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

async function sendCancellationEmail(order: any, reason: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: FROM_EMAIL,
        pass: APP_PASS,
      },
    });

    const itemsHtml = order.items.map((item: any) =>
      `<tr><td style="padding:8px;border:1px solid #eee">${item.productName}</td><td style="padding:8px;border:1px solid #eee">${item.quantity}${item.unit}</td><td style="padding:8px;border:1px solid #eee">₹${item.totalPrice.toFixed(2)}</td></tr>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <div style="background:#c0392b;color:white;padding:20px;text-align:center">
          <h1 style="margin:0">Modi Doodh Dairy</h1>
          <p style="margin:5px 0 0">⚠️ Order Cancellation Notification</p>
        </div>
        <div style="padding:20px">
          <h2 style="color:#c0392b">Order Cancelled</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:15px">
            <tr><td style="padding:8px;font-weight:bold">Order Number</td><td style="padding:8px">${order.orderNumber}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Cancelled At</td><td style="padding:8px">${new Date().toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Customer Name</td><td style="padding:8px">${order.customerName}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${order.customerPhone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${order.customerEmail || "N/A"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Total Amount</td><td style="padding:8px">₹${order.totalAmount.toFixed(2)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#c0392b">Cancellation Reason</td><td style="padding:8px;color:#c0392b;font-weight:bold">${reason || "No reason provided"}</td></tr>
          </table>

          <h3 style="color:#c0392b">Items in Cancelled Order</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:15px">
            <thead>
              <tr style="background:#fef0ef">
                <th style="padding:8px;border:1px solid #eee;text-align:left">Product</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Quantity</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
        <div style="background:#fef0ef;padding:15px;text-align:center;color:#666;font-size:12px">
          <p>Modi Doodh Dairy | Contact: +919575364720 | f4710301@gmail.com</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Modi Doodh Dairy" <${FROM_EMAIL}>`,
      to: NOTIFY_EMAILS.join(", "),
      subject: `❌ Order Cancelled: ${order.orderNumber} - Modi Doodh Dairy`,
      html,
    });
  } catch (err) {
    console.error("Cancellation email send error:", err);
  }
}

router.post("/", async (req, res) => {
  try {
    const {
      userId, customerName, customerPhone, customerEmail,
      deliveryAddress, deliveryState, deliveryCity,
      items, paymentMethod, subtotal, deliveryCharge, totalAmount, referralDiscount
    } = req.body;

    if (!customerName || !customerPhone || !deliveryAddress || !deliveryState || !deliveryCity || !items || !paymentMethod) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const orderNumber = generateOrderNumber();
    const [order] = await db.insert(ordersTable).values({
      orderNumber,
      userId: userId?.toString() || null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      deliveryAddress,
      deliveryState,
      deliveryCity,
      items,
      paymentMethod,
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge),
      totalAmount: Number(totalAmount),
      referralDiscount: Number(referralDiscount || 0),
      status: "submitted",
    }).returning();

    sendOrderEmail(order).catch(console.error);

    res.json({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Create order error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    let orders;
    if (userId) {
      orders = await db.select().from(ordersTable)
        .where(eq(ordersTable.userId, String(userId)))
        .orderBy(ordersTable.createdAt);
    } else {
      orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    }
    res.json(orders.map(o => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err, "Get orders error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const [order] = await db.select().from(ordersTable)
      .where(eq(ordersTable.id, parseInt(orderId)));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Get order error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:orderId/cancel", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const [order] = await db.select().from(ordersTable)
      .where(eq(ordersTable.id, parseInt(orderId)));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (!["submitted", "confirmed", "pending"].includes(order.status)) {
      res.status(400).json({ error: "Order cannot be cancelled at this stage" });
      return;
    }
    const [updated] = await db.update(ordersTable)
      .set({ status: "cancelled", cancellationReason: reason || null, updatedAt: new Date() })
      .where(eq(ordersTable.id, parseInt(orderId)))
      .returning();

    sendCancellationEmail(order, reason || "No reason provided").catch(console.error);

    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Cancel order error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:orderId/return", async (req, res) => {
  try {
    const { orderId } = req.params;
    const [updated] = await db.update(ordersTable)
      .set({ status: "return_requested", updatedAt: new Date() })
      .where(eq(ordersTable.id, parseInt(orderId)))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Return order error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
