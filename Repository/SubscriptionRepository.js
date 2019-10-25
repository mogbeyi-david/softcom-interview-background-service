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
        return await this.subscription.find({question}).populate("user").lean();
    }

}

module.exports = new SubscriptionRepository(Subscription);
