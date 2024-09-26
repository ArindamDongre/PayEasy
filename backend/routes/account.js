import { Router } from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware.js';
import { Account } from '../db.js';

const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching balance" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Validate that the transfer amount is greater than zero
        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Sender account not found"
            });
        }

        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Recipient account not found"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        // Abort the transaction and return error
        await session.abortTransaction();
        console.error("Transfer error:", error);
        res.status(500).json({ message: "Transfer failed" });
    } finally {
        session.endSession(); // End session in any case (commit or abort)
    }
});

export default router;
