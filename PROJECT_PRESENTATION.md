# Project Presentation: Telecom Connect Billing System

## 1. Project Overview
**Telecom Connect** is a full-stack MySQL-driven telecom management solution designed for real-time monitoring, usage simulation, and automated billing. It features a dual-portal interface for both Admins and Customers, ensuring a premium user experience with modern aesthetics.

## 2. Key Features
### A. Customer Portal
- **Dashboard Overview:** Real-time visualization of data, voice, and SMS balances.
- **Simulation Suite:** Interactive tools to simulate calls, SMS, and data usage with instant balance updates.
- **Service Plans:** Browse and subscribe to various prepaid/postpaid hybrid plans.
- **Usage History:** Forensic logs of all activities with cost breakdown.
- **Billing & Payments:** Secure payment simulation and invoice management.

### B. Admin Portal
- **Performance Analytics:** Live stats for revenue, active users, and plan performance.
- **Customer Management:** Comprehensive control over user accounts (Activate/Block).
- **Plan Management:** Dynamic creation and deletion of service offerings.
- **Invoice Management:** Centralized view of all generated and pending invoices.

## 3. Technology Stack
- **Frontend:** React.js, Vite, Vanilla CSS (Premium Glassmorphism), Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL (3rd Normal Form Architecture).
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).

## 4. Advanced Concepts
- **3NF Database Schema:** Highly optimized tables (City, Customer, Plans, Balances, CDRs, Invoices, Payments) for zero redundancy.
- **Database Triggers:** Automated balance deduction upon usage (CDR insertion).
- **Scheduled Billing:** Logic for generating monthly invoices for postpaid customers.
- **API Interceptors:** Centralized auth handling for all frontend-backend communication.

## 5. Recent Optimizations
- **Redirection Logic:** Implemented smart `ProtectedRoute` that allows Admins to view customer pages without loops.
- **Case-Insensitivity:** Robust role-checking (Admin/admin) across the entire stack.
- **API Refactoring:** Replaced hardcoded localhost URLs with dynamic environmental variables for cloud deployment.

---
**Developed by:** Haseeb Ahmad
**Portfolio:** Telecom Connect Professional Billing Solution
