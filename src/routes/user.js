const express = require('express');
const Auth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const router = express.Router();

const SAFE_USER_DATA = "firstName lastName photoUrl skills";

router.get("/user/requests/received", Auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", "firstName lastName photoUrl gender")

        res.status(200).json({
            message: "List of request received",
            data: connectionRequest
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/user/connection", Auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [{
                toUserId: loggedInUser._id,
                status: 'accepted'
            }, {
                fromUserId: loggedInUser._id,
                status: 'accepted'
            }]
        }).populate("fromUserId", SAFE_USER_DATA).populate("toUserId", SAFE_USER_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
        })

        res.status(200).json({
            message: "List fetched successfully",
            data
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/user/feed', Auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId")

        const blockedUser = new Set();
        connectionRequest.forEach((document) => {
            blockedUser.add(document.fromUserId.toString());
            blockedUser.add(document.toUserId.toString())
        });
        const feedData = await User.find({
            $and: [
                { _id: { $nin: Array.from(blockedUser) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(SAFE_USER_DATA).skip(skip).limit(limit)

        res.status(200).send(feedData)


    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = router;