const pool = require('./backend/config/db');
const fs = require('fs');
const path = require('path');

async function runFixes() {
    try {
        const sqlFile = process.argv[2] || 'backend/fix_payment_schema_final.sql';
        const fullPath = path.isAbsolute(sqlFile) ? sqlFile : path.join(__dirname, sqlFile);

        if (!fs.existsSync(fullPath)) {
            console.error(`Error: SQL file not found at ${fullPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(fullPath, 'utf8');
        const commands = sql.split(';').filter(cmd => cmd.trim());

        console.log('Applying refined schema fixes...');
        for (let cmd of commands) {
            const trimmedCmd = cmd.trim();
            if (trimmedCmd) {
                console.log(`Executing: ${trimmedCmd.substring(0, 100)}...`);
                try {
                    await pool.query(trimmedCmd);
                    console.log('Success.');
                } catch (err) {
                    if (err.code === 'ER_DUP_FIELDNAME') {
                        console.log('Column already exists, skipping.');
                    } else if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                        console.log('Table already exists, skipping.');
                    } else if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                        console.log('Cannot drop field (likely already gone), skipping.');
                    } else {
                        console.error(`Error executing command: ${err.message}`);
                    }
                }
            }
        }
        console.log('Schema refinement process finished!');
        process.exit(0);
    } catch (err) {
        console.error('Fatal error during schema fixes:', err);
        process.exit(1);
    }
}

runFixes();
