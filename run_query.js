const pool = require('./backend/config/db');

async function runQuery(sql) {
    try {
        if (!sql) {
            console.error('Usage: node run_query.js "SELECT * FROM table"');
            process.exit(1);
        }

        console.log(`\n--- EXECUTING QUERY ---`);
        console.log(sql);
        console.log(`------------------------`);

        const [rows] = await pool.query(sql);

        if (Array.isArray(rows)) {
            if (rows.length === 0) {
                console.log('\n[!] Query returned 0 rows.\n');
            } else {
                console.table(rows);
            }
        } else {
            // For UPDATE, DELETE, INSERT
            console.log('\nResult:', rows);
        }

        console.log(`--- SUCCESS ---\n`);
        process.exit(0);
    } catch (err) {
        console.error('\n[!] SQL Error:', err.message);
        process.exit(1);
    }
}

const query = process.argv[2];
runQuery(query);
