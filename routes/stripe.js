'use strict';
const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET);

router.post('/', (req, res, next) => {
    const creditCardNumber = req.body.creditCardNumber;
    const creditCardExpMonth = parseInt(req.body.creditCardExpMonth, 10);
    const creditCardExpYear = parseInt(req.body.creditCardExpYear, 10);
    const creditCardCvc = req.body.creditCardCvc;
    const currency = req.body.currency;
    const amount = req.body.amount;

    stripe.tokens.create({
    card: {
        "number": creditCardNumber,
        "exp_month": creditCardExpMonth,
        "exp_year": creditCardExpYear,
        "cvc": creditCardCvc
    }
    }, (err, user) => {
        if (err) {
            res.send(err)
        }
        stripe.charges.create({
            amount: amount * 100, // cents
            currency: currency,
            source: user.id,
            description: "New credit!"
            }, (err, charge) => {
                if (err) {
                    res.send(err);
                    return;
                }
                res.send(charge)
        });
    });
});

module.exports = router;
