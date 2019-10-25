const mongoose = require('mongoose');
const Subscription = require("../models/Subscription");


class SubscriptionRepository {

    /**
     *
     * @param subscription
     */
    constructor(subscription) {
        this.subscription = subscription;
    }

    async getAllForQuestion(question) {
        // return await this.subscription.find({question}).populate("question").lean();
        return await this.subscription.aggregate([
            {
                $match: {
                    question: mongoose.Types.ObjectId(question)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user"
                }
            },
            {
                $project: {
                    "user.email": true,
                    "_id": false
                }
            }
        ]);
    }

}

module.exports = new SubscriptionRepository(Subscription);
