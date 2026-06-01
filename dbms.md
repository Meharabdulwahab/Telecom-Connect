# Telecom Billing System - DBMS Documentation

This document outlines the database architecture, concepts, validation rules, and logic implementation for the Telecom Billing System. The project utilizes **MySQL** with a strong focus on Data Integrity, ACID properties, and Enterprise-grade Scalability.

## 1. Database Concepts Applied

### 1.1 Normalization (3NF)
The database follows the **Third Normal Form (3NF)** to ensure data integrity and reduce redundancy:
- **Customers** table stores only user profile info.
- **ServicePlans** are separated from Customers to allow dynamic plan updates without affecting user records.
- **CustomerBalances** is a separate entity tracking real-time usage, linked via Foreign Key.
- **Invoices** and **PaymentTransactions** are separated to handle multiple payment attempts for a single invoice.

### 1.2 ACID Properties & Transactions
The core billing logic uses **Transactions (START TRANSACTION / COMMIT / ROLLBACK)** to ensure consistency.
- **Example**: In `sp_ProcessUsage`, we calculate the cost and deduct the balance in a single atomic transaction. If any step fails (e.g., negative balance check), the entire operation rolls back to prevent data corruption.
- **Row Locking (`FOR UPDATE`)**: We use row-level locking when reading `CustomerBalances` to prevent race conditions (double spending) during simultaneous calls.

### 1.3 Stored Procedures
Business logic is pushed to the database layer for performance and security:
- **`sp_ProcessUsage`**: Handles complex "Pay As You Go" vs "Bundle" logic, calculates costs, and updates balances.
- **`sp_PurchasePlan`**: Automates invoice generation, quota allocation, and transaction logging in one call.

### 1.4 Triggers
- **`trg_UpdateUsageAfterCDR`**: (Optimized) Automatically deducts exact decimal minutes/data from `CustomerBalances` immediately after a Call Data Record (CDR) is inserted. This ensures the balance is always in sync with usage logs.

---

## 2. Database Schema (Tables)

### Core Entity Tables
| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **Customers** | User profiles and authentication | `customer_id` (PK), `email` (Unique), `status` (ENUM), `plan_id` (FK) |
| **ServicePlans** | Defined quotas and pricing | `plan_id` (PK), `validity_days`, `overage_rate` |
| **CustomerBalances** | **Real-time** resource tracking | `customer_id` (FK), `remaining_on_net_mins` (Decimal), `remaining_data_mb` |

### Billing & Logs Tables
| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **CallDataRecords** | Logs of every call/SMS/data session | `cdr_id` (PK), `call_type`, `cost_billed`, `duration_seconds` |
| **Invoices** | Generated bills (Monthly/Subscription) | `invoice_id` (PK), `total_amount_due`, `payment_status` (ENUM) |
| **PaymentTransactions** | Financial audit trail | `transaction_id` (PK), `invoice_id` (FK), `payment_metadata` (JSON) |

---

## 3. Validation Rules & Constraints

We enforce strict rules at the database level:

### 3.1 Data Types & Precision
- **Decimal Precision**: `DECIMAL(10, 4)` is used for minutes and data MBs (e.g., `10.5000`) to support exact billing (Per Second Billing).
- **JSON**: Used for `payment_metadata` to store flexible, masked payment details (Card ending in 1234, etc.).

### 3.2 Integrity Constraints (Foreign Keys)
- `ON DELETE CASCADE`: Used for `Invoices` -> `PaymentTransactions`. If an invoice is deleted (rare), its transactions are cleaned up.
- **NOT NULL**: Critical fields like `email`, `password_hash`, and `amount` cannot be null.

### 3.3 ENUM Constraints
We use ENUMs to restrict values to valid states only:
- **Customer Status**: `'Active'`, `'Blocked'`
- **Billing Type**: `'Prepaid'`, `'Postpaid'`
- **Invoice Status**: `'Paid'`, `'Pending'`, `'Overdue'`
- **Usage Type**: `'Voice'`, `'SMS'`, `'Data'`

---

## 4. Query Types Implemented

### 4.1 Complex Joins
Used in Admin Dashboard to aggregare data:
```sql
SELECT c.first_name, p.plan_name, b.remaining_data_mb
FROM Customers c
JOIN ServicePlans p ON c.plan_id = p.plan_id
JOIN CustomerBalances b ON c.customer_id = b.customer_id;
```

### 4.2 Aggregations & Analytics
Used for Revenue Reporting:
```sql
SELECT 
    SUM(CASE WHEN payment_status = 'Paid' THEN total_amount_due ELSE 0 END) as collected_revenue,
    SUM(CASE WHEN payment_status = 'Pending' THEN total_amount_due ELSE 0 END) as pending_revenue
FROM Invoices;
```

### 4.3 Atomic Updates
Used for exact balance deduction:
```sql
UPDATE CustomerBalances 
SET remaining_data_mb = GREATEST(0, remaining_data_mb - (NEW.data_consumed_kb / 1024.0))
WHERE customer_id = NEW.customer_id;
```
*Note usage of `GREATEST(0, ...)` to prevent negative values.*

---

## 5. Database Project Files

We have organized the database logic deeply into modular SQL files:

### Core Structure (`/database` folder)
*   **`schema.sql`**: Defines the main skeleton (Tables, Foreign Keys, Indexes).
*   **`seed.sql`**: Contains dummy testing data (Users, Plans).

### Advanced Logic (`/backend` folder)
*   **`setup_payments.sql`**: Adds `PaymentTransactions` table and the `sp_PurchasePlan` stored procedure for automated invoicing.
*   **`fix_usage_logic.sql`**: Contains the critical `sp_ProcessUsage` procedure (The "Logic Brain" for real-time deductions).
*   **`update_billing_precision.sql`**: Implementation of Decimal Precision (4 decimal places) and Triggers for exact billing.
*   **`update_billing_type.sql`**: Logic for Postpaid/Prepaid switching.

### Automation
*   **`setup-db.js`**: Node.js script that orchestrates the entire database reset and setup process in one click.
