const mongoose = require('mongoose');

const { Schema, model } = mongoose

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true
    })

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connetion request to yourself!")
    }
    next();
})

const ConnectionRequestModel = new model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel