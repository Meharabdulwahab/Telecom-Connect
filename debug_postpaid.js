const pool = require('./backend/config/db');
const { purchasePlan } = require('./backend/controllers/paymentController');

async function debugPostpaid() {
    const req = {
        user: { id: 1 },
        body: {
            planId: 1, // Ensure this ID exists in your DB
            paymentMethod: 'Postpaid',
            amount: 50.00
        }
    };
    const res = {
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            console.log('Response Code:', this.statusCode || 200);
            console.log('Response Data:', JSON.stringify(data, null, 2));
        }
    };

    try {
        console.log('Starting debug simulation...');
        await purchasePlan(req, res);
    } catch (err) {
        console.error('CRASH DURING EXECUTION:', err);
    } finally {
        process.exit(0);
    }
}

debugPostpaid();
