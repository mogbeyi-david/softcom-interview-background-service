const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subscriptionSchema = new Schema({});
module.exports = mongoose.model("Subscription", subscriptionSchema);
