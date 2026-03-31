import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import referralRouter from "./referral";
import supportRouter from "./support";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/orders", ordersRouter);
router.use("/reviews", reviewsRouter);
router.use("/referral", referralRouter);
router.use("/support", supportRouter);

export default router;
