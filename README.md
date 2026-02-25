# Edupay

Payroll & Fee Management System
Developed for the University of Agriculture Faisalabad

***

## Overview

EduPay is a full-stack payroll and fee management system built to automate administrative workflows at the University of Agriculture Faisalabad.

The system handles:

- Bulk payroll generation from structured Excel files
- Automated payslip creation and distribution
- Student fee tracking and verification
- Class formation based on verified fee status
- Role-based access control for institutional workflows

***

## Core Modules

### Payroll Management

The payroll system is designed to handle structured bulk payslip generation while keeping employee records separate from monthly salary data.

#### Workflow

1. HR uploads a structured Excel file.
2. Data is parsed and stored in the database.
3. A background job is created using Redis + BullMQ.
4. Payslips are generated in bulk.
5. HR downloads a ZIP archive containing all generated payslips.

#### Key Design Decisions
- Employee master data is stored separately from monthly payslip data.
- Payslip records are mapped using CNIC for accuracy.
- If payroll data for the same month is re-uploaded:
    - The latest upload becomes active.
    - Historical records remain immutable once the month closes.

#### Employee Master Data Includes

- Name
- Pin Code
- Designation
- BPS
- Nature Of Appointment
- CNIC
- Date Of Birth
- Date Of Joining
- Date of Retirement

#### Payslip Data Includes

- Employee CNIC (used for mapping)
- Basic Pay
- Allowances (fields must include "Allowance" prefix)
- Deductions (fields must include "Deduction" prefix)
This ensures dynamic payroll structures without modifying schema per salary revision.

***

### Fee Management

The fee management module tracks student payments and generates class formations based on verified payment status.

#### WorkFlow

1. Class student data is uploaded via Excel (AG number + Name).
2. Data is processed and stored.
3. Fee payment is marked.
4. Accounts department verifies payment.
5. Class formation is generated based on verified paid students.
This process ensures controlled validation before class structuring.

***

### User Roles & Permissions

The system uses strict role-based authorization.

#### Admin

- Create users
- Edit roles
- Delete users
- Manage system-level access

#### HR

- Upload payroll Excel files
- Trigger payslip generation
- Download bulk payslips

#### Employees

- Log in securely
- Download their individual payslips

#### Accounts

- Manage fee records
- Verify payments
- Generate class formations

***

### Techonology Stack

#### Frontend

- JavaScript
- React
- TailwindCSS

#### Backend

- Node.js
- Express.js

#### Database

- PostgreSQL

#### Background Job Processing

- Redis 
- BullMQ

#### Excel Parsing

- xlsx

#### Authentication

- Passport.js (Local Strategy)

#### Deployment

- Self-managed Virtual Machine (Linux-based production server)

***

### Architecture

- EduPay follows a modular REST-based architecture:
- React frontend (client application)
- Express REST API backend
- PostgreSQL for persistent storage
- Redis for job queues and caching
- BullMQ for asynchronous payslip generation

This separation ensures:
- Scalable background processing
- Clean API boundaries
- Controlled access enforcement
- Safe concurrent payroll operations

***

### Security

- Role-based authorization
- Username & password authentication
- Controlled access per module
- Immutable historical payroll records
- Overwrite protection for same-month payroll uploads
- Server-hosted deployment (no shared hosting)

*** 

### Installation  

```bash
# Clone repository
git clone https://github.com/AbdulRehman164/Edupay

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables (Backend)

```code
PORT=
PGUSER=
PGDATABASE=
PGPASSWORD=
PGHOST=
PGPORT=
PDF_ASSET_BASE_URL=
REDIS_URL=
CLIENT_URL=
SESSION_SECRET=
```

### Run Development Server

Backend:
```bash
npm run dev
```

Frontend:
```bash
npm run dev
```

***

### Production Notes

- Hosted on a dedicated virtual machine
- Background jobs isolated via Redis queue
- Designed for institutional branch-level deployment
