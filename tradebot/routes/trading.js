const express = require('express');

let router = express.Router();

// get orders
router.get('/:accountId/orders', (req, res) => {
});

// cancel order
router.delete('/:accountId/orders', (req, res) => {
});

// place order
router.put('/:accountId/orders', (req, res) => {
});

// update an order
router.put('/:accountId/orders/:orderId', (res, res) => {
});

module.exports = router;
