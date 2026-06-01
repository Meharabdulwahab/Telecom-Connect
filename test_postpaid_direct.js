const pool = require('./backend/config/db');
const { purchasePlan } = require('./backend/controllers/paymentController');

const mockRes = {
    status: function (s) { this.statusCode = s; return this; },
    json: function (data) {
        console.log('RESPONSE:', JSON.stringify(data, null, 2));
        this.data = data;
        return this;
    }
};

const mockReq = {
    user: { id: 1 },
    body: {
        planId: 1, // Ensure this plan exists
        paymentMethod: 'Postpaid',
        amount: 800,
        paymentDetails: {}
    }
};

const runTest = async () => {
    console.log('--- STARTING POSTPAID TEST ---');
    try {
        await purchasePlan(mockReq, mockRes);
        console.log('--- TEST FINISHED ---');
    } catch (err) {
        console.error('TEST ERROR:', err);
    } finally {
        process.exit(0);
    }
};

runTest();
