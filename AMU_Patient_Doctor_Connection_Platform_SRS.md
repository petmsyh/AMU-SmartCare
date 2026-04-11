# Software Requirements Specification (SRS) for Arba Minch University (AMU) Patient-Doctor Connection Platform

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document details the functional and

non-functional requirements for the Arba Minch University (AMU) Patient-Doctor

Connection Platform. The platform aims to bridge the gap between AMU medical

doctors and the Arba Minch community, facilitating improved healthcare access and

medical education support. This document serves as a foundational guide for the

development team, ensuring a clear understanding of the system’s objectives,

features, and constraints.

### 1.2 Scope


The AMU Patient-Doctor Connection Platform will provide a comprehensive digital

ecosystem for patient-doctor interactions, medical student support, and a robust

payment system for consultations. Key features include doctor profiles, a patient

rating system, an AI assistant for patients, an AI academic dashboard for medical

students, and a secure payment system for doctor consultations. This document also

outlines the requirements for a mock payment system to facilitate development and

testing.

### 1.3 Definitions, Acronyms, and Abbreviations


AMU: Arba Minch University


SRS: Software Requirements Specification


AI: Artificial Intelligence


UI: User Interface


API: Application Programming Interface


FR: Functional Requirement


NFR: Non-Functional Requirement


Chapa, Telebirr, CBE Birr: Ethiopian digital payment gateways

## 2. Overall Description

### 2.1 Product Perspective


The AMU Patient-Doctor Connection Platform is a standalone application designed to

operate as a central hub for medical services and education within the Arba Minch

community. It will interact with external payment gateways (Chapa, Telebirr, CBE Birr)

for real transactions, but will also feature an internal mock payment system for

development and testing purposes.

### 2.2 Product Functions


The platform will offer the following primary functions:


Doctor Profiles: Detailed profiles for AMU medical doctors.


Rating System: Patients can rate and review doctors.


AI Assistant for Patients: An AI-powered assistant to help patients with queries.


AI Academic Dashboard for Medical Students: An AI-driven tool to support

medical students’ learning.


Payment System: Secure processing of consultation fees.


Mock Payment System: A simulated environment for testing payment flows.

### 2.3 User Characteristics


Patients: Members of the Arba Minch community seeking medical consultations.

They will use the platform to find doctors, book appointments, engage with the

AI assistant, and make payments.


Doctors: AMU medical professionals providing consultations. They will manage

their profiles, view appointments, conduct consultations, and manage their

earnings.


Medical Students: AMU students utilizing the AI academic dashboard for

educational purposes.


Administrators: Platform staff responsible for system configuration, user

management, and monitoring.

### 2.4 Operating Environment


The platform will be accessible via web browsers (React TypeScript frontend) and

mobile devices (Flutter mobile app). The backend will be built with Node.js Express,

utilizing PostgreSQL as the database. The system will be deployed on cloud

infrastructure, ensuring scalability and availability.

### 2.5 General Constraints


Technology Stack: Node.js Express (backend), React TypeScript with Redux

(frontend), PostgreSQL (database), Flutter (mobile app).


Payment Gateways: Integration with Ethiopian digital payment gateways

(Chapa, Telebirr, CBE Birr).


Security: Adherence to healthcare data privacy and security standards.


Scalability: The platform must be able to handle a growing number of users and

transactions.

## 3. Specific Requirements

### 3.1 Functional Requirements


3.1.1 Doctor Profile Management


FR_DOC.1: The system shall allow doctors to create and update their

professional profiles, including specialization, experience, availability, and

consultation fees.


FR_DOC.2: The system shall display doctor profiles to patients, including their

qualifications, availability, and patient ratings.


3.1.2 Patient Rating System


FR_RAT.1: The system shall allow patients to rate and provide feedback on

doctors after a consultation.


FR_RAT.2: The system shall display aggregated ratings and reviews on doctor

profiles.


3.1.3 AI Assistant for Patients


FR_AIP.1: The system shall provide an AI-powered assistant to answer patient

queries related to general health information and platform usage.


FR_AIP.2: The AI assistant shall be accessible through a chat interface within the

patient application.


3.1.4 AI Academic Dashboard for Medical Students


FR_AIS.1: The system shall provide an AI-powered academic dashboard for

medical students, offering resources, study aids, and performance analytics.


FR_AIS.2: The dashboard shall be accessible only to authenticated medical

students.


3.1.5 Consultation Management


FR_CON.1: The system shall allow patients to book consultations with available

doctors.


FR_CON.2: The system shall provide a mechanism for doctors to accept or

decline consultation requests.


FR_CON.3: The system shall facilitate secure communication between patients

and doctors during consultations.


3.1.6 Payment System


FR_PAY.1: The system shall allow patients to make upfront payments for

consultations using integrated Ethiopian digital gateways (Chapa, Telebirr, CBE

Birr).


FR_PAY.2: The system shall hold consultation funds in escrow until the

consultation is confirmed complete by both patient and doctor, or an auto
completion timer triggers.


FR_PAY.3: The system shall release funds from escrow to the doctor’s platform

wallet upon successful consultation completion, deducting a pre-defined

platform commission.


FR_PAY.4: The system shall allow doctors to withdraw earnings from their

platform wallet to their linked bank or mobile money accounts.


FR_PAY.5: The system shall support a tiered pricing model for consultations

(General Practitioners, Specialists, Super-Specialists), allowing doctors to set fees

within platform-defined ranges.


FR_PAY.6: The system shall process refunds to patients if a doctor fails to deliver

service or a dispute is resolved in the patient’s favor.


FR_PAY.7: The system shall maintain a detailed transaction history for all

payments, escrow operations, fund releases, refunds, and withdrawals.


3.1.7 Mock Payment System for Development and Testing


3.1.7.1 Purpose of Mock Payment System


The mock payment system is a simulated payment environment to be used exclusively

during the development and testing phases of the platform. It replicates the full

behavior of the real payment flow (pre-payment, escrow, fund release, refund, wallet

crediting, commission deduction) without connecting to any real financial gateway or

moving actual money. This allows developers and testers to verify all payment-related

features work correctly before the real payment integration (Chapa, Telebirr, CBE Birr)

is activated.


3.1.7.2 Functional Requirements for Mock Payment


FR_MOCK.1 Mock Payment Toggle: The system shall include an environment
level configuration flag (e.g., `PAYMENT_MODE=mock` or `PAYMENT_MODE=live` ) that

switches the payment system between mock mode and live mode. This flag shall

be set in the application’s environment configuration file and shall not require

code changes to switch between modes.


FR_MOCK.2 Simulated Payment Initiation: In mock mode, when a patient

initiates a consultation payment, the system shall display a mock payment


interface that simulates the payment gateway UI. This interface shall allow the

tester to choose one of the following simulated outcomes:

Payment Success: The payment is processed successfully and funds are

moved to escrow.


Payment Failure: The payment fails and the patient is notified with an

appropriate error message.


Payment Timeout: The payment request times out and the system handles

it gracefully.


FR_MOCK.3 Simulated Escrow Behavior: In mock mode, the system shall

simulate the escrow mechanism. Upon a simulated successful payment, the

funds (represented as mock currency amounts in the database) shall be marked

as “held in escrow” and associated with the specific consultation transaction.


FR_MOCK.4 Simulated Service Completion and Fund Release: In mock mode,

when both the patient and doctor confirm consultation completion (or the auto
completion timer triggers), the system shall simulate the release of escrowed

funds to the doctor’s wallet, deducting the configured platform commission

percentage. All amounts shall be stored as mock values in the database.


FR_MOCK.5 Simulated Refund: In mock mode, the system shall simulate the

refund process. When a refund condition is met (e.g., doctor did not respond,

dispute resolved in patient’s favor), the mock escrowed funds shall be returned

to the patient’s mock wallet balance.


FR_MOCK.6 Mock Doctor Wallet: In mock mode, doctors shall have a mock

wallet that displays simulated earnings. Doctors shall be able to simulate a

withdrawal request, and the system shall process it as a mock transaction (no

real bank or mobile money transfer occurs). The mock withdrawal shall update

the wallet balance in the database as if the transfer succeeded.


FR_MOCK.7 Mock Transaction History: In mock mode, all simulated

transactions (payments, escrow holds, releases, refunds, withdrawals) shall be

recorded in the database with a clear label indicating they are mock transactions

(e.g., a field `transaction_type = 'mock'` ). This ensures the transaction history

feature is fully testable.


FR_MOCK.8 Mock Payment Test Dashboard (Admin): Administrators shall have

access to a mock payment test dashboard where they can:

View all mock transactions in the system


Manually trigger mock payment outcomes (success, failure, timeout) for

specific transactions to test edge cases


Reset mock wallet balances for testing purposes


View a summary of all mock escrow states


FR_MOCK.9 No Real Money Movement: The system shall enforce that in mock

mode, absolutely no API calls are made to real payment gateways (Chapa,

Telebirr, CBE Birr). All payment logic shall be handled internally by the mock

payment service module.


3.1.7.3 Transition from Mock to Live Payment


The transition from mock payment to live payment shall follow these steps:


Step 1 - API Credentials Setup: The development team shall register with Chapa

(which supports Telebirr, CBE Birr, M-Pesa, and local cards) and obtain live API keys

and webhook URLs.


Step 2 - Environment Configuration: The `PAYMENT_MODE` environment variable shall

be changed from “mock” to “live” in the production environment configuration. No

other code changes shall be required if the payment service is properly abstracted.


Step 3 - Payment Service Abstraction: The backend shall implement a payment

service interface/abstraction layer with two implementations: `MockPaymentService`

and `LivePaymentService` . The correct implementation shall be injected based on the

`PAYMENT_MODE` flag. This is a required architectural constraint.


Step 4 - Webhook Integration: The live payment service shall implement webhook

handlers to receive real-time payment status updates from Chapa (e.g., payment

confirmed, payment failed). These webhooks shall trigger the same escrow release

and wallet crediting logic used in mock mode.


Step 5 - Testing in Staging: Before going live, the real payment integration shall be

tested in Chapa’s sandbox/test environment using test credentials and test card

numbers, without moving real money.


Step 6 - Go Live: After successful staging tests, the production environment shall be

switched to live payment mode.


3.1.7.4 Database Considerations for Mock Payment


The following fields/columns shall be added to the `transactions` table to support

mock payment:


`transaction_mode` : ENUM (‘mock’, ‘live’) — indicates whether the transaction

was processed in mock or live mode


`mock_outcome` : VARCHAR(50) — stores the simulated outcome in mock mode

(e.g., ‘success’, ‘failure’, ‘timeout’)


`is_real_money` : BOOLEAN — always `FALSE` in mock mode, `TRUE` in live mode


These fields ensure that mock and live transactions can coexist in the database during

the transition period and can be filtered separately for reporting.


3.1.7.5 Non-Functional Requirements for Mock Payment


NFR_MOCK.1: The mock payment system shall mirror the exact same API

request and response structure as the live payment integration, so that switching

to live mode requires no changes to the frontend or mobile app.


NFR_MOCK.2: The mock payment system shall be available in all non
production environments (development, testing, staging) and shall be disabled

and inaccessible in the production environment when live payment is active.


NFR_MOCK.3: The mock payment dashboard shall be accessible only to users

with the ‘admin’ role.

### 3.2 Non-Functional Requirements


3.2.1 Performance


NFR_PERF.1: The system shall respond to user requests within 3 seconds under

normal load.


NFR_PERF.2: The system shall support at least 100 concurrent users without

degradation in performance.


3.2.2 Security


NFR_SEC.1: The system shall protect all sensitive patient and doctor data in

transit and at rest using industry-standard encryption protocols.


NFR_SEC.2: The system shall implement robust authentication and

authorization mechanisms for all user roles.


NFR_SEC.3: The system shall be protected against common web vulnerabilities

(e.g., SQL injection, XSS).


3.2.3 Usability


NFR_USAB.1: The user interface shall be intuitive and easy to navigate for all

user types.


NFR_USAB.2: The system shall provide clear and concise feedback to users for

all actions.


3.2.4 Reliability


NFR_RELI.1: The system shall have an uptime of 99.9%.


NFR_RELI.2: The system shall implement data backup and recovery mechanisms

to prevent data loss.


3.2.5 Maintainability


NFR_MAINT.1: The codebase shall be well-documented and follow established

coding standards.


NFR_MAINT.2: The system architecture shall be modular to facilitate future

enhancements and bug fixes.


3.2.6 Scalability


NFR_SCAL.1: The system shall be able to scale horizontally to accommodate an

increasing number of users and data.

## 4. References


No external references were used in the creation of this document. All information was

provided by the user. This document was generated by Manus AI based on user

requirements.


