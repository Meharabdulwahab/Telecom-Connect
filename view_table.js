const pool = require('./backend/config/db');

async function viewTable(tableName, limit = 10) {
    try {
        // Basic SQL injection protection for demo purposes (only allow known tables)
        const [tables] = await pool.query('SHOW TABLES');
        const allowedTables = tables.map(row => Object.values(row)[0]);

        if (!allowedTables.includes(tableName)) {
            console.error(`Error: Table '${tableName}' not found.`);
            process.exit(1);
        }

        const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` LIMIT ?`, [limit]);
        if (rows.length === 0) {
            console.log(`\n[!] Table '${tableName}' is empty.\n`);
        } else {
            console.log(`\n--- DATA VIEW: ${tableName.toUpperCase()} ---`);
            console.table(rows);
            console.log(`--- END OF VIEW ---\n`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error fetching table data:', err.message);
        process.exit(1);
    }
}

const tableName = process.argv[2];
if (!tableName) {
    console.error('Usage: node view_table.js <table_name>');
    process.exit(1);
}

viewTable(tableName);
