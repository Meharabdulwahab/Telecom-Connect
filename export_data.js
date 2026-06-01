const pool = require('./backend/config/db');
const fs = require('fs');
const path = require('path');

async function exportData(target, limit = 50) {
    try {
        if (!target) {
            console.error('Usage: node export_data.js <table_name_or_query>');
            process.exit(1);
        }

        let sql = target.toLowerCase().includes('select') ? target : `SELECT * FROM \`${target}\` LIMIT ${limit}`;
        let fileNameBase = target.toLowerCase().includes('select') ? 'query_result' : target;

        console.log(`\n--- EXPORTING DATA ---`);
        console.log(`Query: ${sql}`);

        const [rows] = await pool.query(sql);

        if (rows.length === 0) {
            console.log('\n[!] No data found to export.\n');
            process.exit(0);
        }

        const headers = Object.keys(rows[0]);

        // 1. Generate Markdown Table
        let mdContent = `# Data Export: ${fileNameBase.toUpperCase()}\n\n`;
        mdContent += `| ${headers.join(' | ')} |\n`;
        mdContent += `| ${headers.map(() => '---').join(' | ')} |\n`;

        rows.forEach(row => {
            const values = headers.map(h => {
                const val = row[h];
                return val === null ? '*null*' : String(val).replace(/\|/g, '\\|');
            });
            mdContent += `| ${values.join(' | ')} |\n`;
        });

        const mdPath = path.join(__dirname, `${fileNameBase}_report.md`);
        fs.writeFileSync(mdPath, mdContent);

        // 2. Generate CSV
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            const values = headers.map(h => {
                let val = row[h];
                if (val === null) return '';
                val = String(val).replace(/"/g, '""');
                return `"${val}"`;
            });
            csvContent += values.join(',') + '\n';
        });

        const csvPath = path.join(__dirname, `${fileNameBase}_report.csv`);
        fs.writeFileSync(csvPath, csvContent);

        console.log(`\n[SUCCESS] Reports generated:`);
        console.log(`1. Markdown: ${mdPath} (Open and press Ctrl+Shift+V in VS Code)`);
        console.log(`2. CSV: ${csvPath} (Open in Excel)`);
        console.log(`--- DONE ---\n`);

        process.exit(0);
    } catch (err) {
        console.error('\n[!] Export Error:', err.message);
        process.exit(1);
    }
}

const arg = process.argv[2];
exportData(arg);
