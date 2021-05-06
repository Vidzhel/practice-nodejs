const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

TaskSchema.methods.toJson = function () {
    const container = this.toObject();
    if (typeof this.owner?.toJson === "function") {
        container.owner = this.owner.toJson();
    }

    return container;
};

module.exports = TaskSchema;
