const express = require('express');
const Auth = require("../middleware/auth");
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

router.post('/request/send/:status/:userId', Auth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ['ignored', 'interested']
        if (!allowedStatus.includes(status)) {
            return res.status(400).send(`${status} is not a valid status`)
        }
        const connectionRequest = ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnection) {
            return res.status(400).send(`Connection request is already present`)
        }
        const data = await connectionRequest.save();
        res.json({
            message: 'Connection request sent successfully',
            data
        })
    } catch (error) {
        res.status(400).send(error.message)
    }

})


module.exports = router