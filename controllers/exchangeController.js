// backend/controllers/exchangeController.js

const Exchange = require('../models/exchange');

const sendExchangeRequest = async (req, res) => {
    try {
    
      const { ownerId, requestedById, offeredProductId, requestedProductId } = req.body;

      const newRequest = new Exchange({
        owner: ownerId,
        requestedBy: requestedById,
        requestedProduct: requestedProductId,  
        offeredProduct: offeredProductId,
        requestStatus: "Pending",
      });

      await newRequest.save();

      res.status(201).json({ success: true, message: "Exchange request sent successfully", request: newRequest });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send exchange request", error: error.message });
    }
};


// Get all received exchange requests for owner
const getReceivedRequests = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const requests = await Exchange.find({ owner: ownerId })
      .populate('owner', 'name email')
      .populate('requestedBy', 'name email')
      .populate('requestedProduct')
      .populate('offeredProduct');

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch received exchange requests", error: error.message });
  }
};

// Get all sent exchange requests by user
const getSentRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    const requests = await Exchange.find({ requestedBy: userId })
      .populate('owner', 'name email')
      .populate('requestedProduct')
      .populate('offeredProduct');

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch sent exchange requests", error: error.message });
  }
};

// Accept or decline a request
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: "Accepted" or "Declined"

    if (!['Accepted', 'Declined'].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const request = await Exchange.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Exchange request not found" });
    }

    request.requestStatus = action;
    await request.save();

    res.status(200).json({ success: true, message: `Exchange request ${action.toLowerCase()}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update request status", error: error.message });
  }
};

// Update swapStatus (Pending ➔ Shipped ➔ Returned)
const updateSwapStatus = async (req, res) => {
  try {
    const { requestId, newStatus } = req.body; // newStatus: "Shipped" or "Returned"

    if (!['Shipped', 'Returned'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: "Invalid swap status" });
    }

    const request = await Exchange.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Exchange request not found" });
    }

    request.swapStatus = newStatus;
    await request.save();

    res.status(200).json({ success: true, message: "Swap status updated", request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update swap status", error: error.message });
  }
};

module.exports = {
  sendExchangeRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  updateSwapStatus
};
