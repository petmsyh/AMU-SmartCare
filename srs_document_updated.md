# Software Requirements Specification (SRS) for Arba Minch University Patient- Doctor Connection Platform

## 1. Introduction

### 1.1 Purpose

The purpose of this Software Requirements Specification (SRS) document is to outline

the functional and non-functional requirements for the Arba Minch University (AMU)

Patient-Doctor Connection Platform. This platform aims to facilitate communication

and service delivery between medical doctors at AMU and the local community,

provide medical advice, enable doctor profile management, incorporate a rating

system, and integrate AI assistants for both patient inquiries and medical student

academic support. Additionally, the platform will include a Flutter mobile application

to extend accessibility.

### 1.2 Scope


The AMU Patient-Doctor Connection Platform will encompass the following key areas:


Patient-Doctor Connection: A robust web and mobile platform designed to

connect community members with medical doctors affiliated with Arba Minch

University.


Doctor Profiles: A comprehensive system allowing doctors to create, manage,

and showcase their professional profiles, including their specialized skills,

academic certifications, and professional qualifications.


Rating System: An integrated feedback mechanism enabling users to rate and

provide reviews for doctors based on the quality of services received.


AI Assistant for Patients: An artificial intelligence-powered chatbot developed

to offer general information and preliminary advice on various medical


conditions and diseases, always accompanied by disclaimers regarding

professional medical consultation.


AI Assistant for Medical Students: A specialized AI dashboard, meticulously

trained using Arba Minch University’s official medical course materials, designed

to provide academic assistance and support to medical students.


Technology Stack: The platform will be built using a modern and scalable

technology stack, including Node.js with Express.js for the backend, React with

TypeScript and Redux for the web frontend, PostgreSQL as the primary database,

and Flutter for the cross-platform mobile application.

### 1.3 Definitions, Acronyms, and Abbreviations






|Term|Defni ition|
|---|---|
|AMU|Arba Minch University|
|SRS|Software Requirements Specifcation|
|AI|Artifcial Intelligence|
|UI|User Interface|
|UX|User Experience|
|API|Application Programming Interface|
|Node.js<br>Express|A backend web application framework built on Node.js, designed for<br>building robust and scalable server-side applications.|
|React<br>TypeScript|A JavaScript library for building user interfaces, enhanced with TypeScript<br>for improved type safety and developer experience.|
|Redux|A predictable state container for JavaScript applications, facilitating<br>centralized state management.|
|PostgreSQL|An advanced open-source relational database management system known<br>for its reliability, feature robustness, and performance.|
|Flutter|An open-source UI software development kit by Google for building natively<br>compiled applications for mobile, web, and desktop from a single codebase.|


### 1.4 References


[1] Arba Minch University School of Medicine. Available at:

[https://www.amu.edu.et/en/academics/main-menu-schools/school-of-medicine](https://www.amu.edu.et/en/academics/main-menu-schools/school-of-medicine)


[[2] Chapa Payment Gateway. Available at: https://chapa.co/](https://chapa.co/)


[3] Ethiopian Telemedicine Guidelines (referencing general digital health

[initiatives). Available at: https://www.moh.gov.et/sites/default/fles/2024-](https://www.moh.gov.et/sites/default/files/2024-12/REQUEST%20OF%20EXPRESSION%20OF%20INTEREST%20.pdf)

[12/REQUEST%20OF%20EXPRESSION%20OF%20INTEREST%20.pdf](https://www.moh.gov.et/sites/default/files/2024-12/REQUEST%20OF%20EXPRESSION%20OF%20INTEREST%20.pdf)

## 2. Overall Description

### 2.1 Product Perspective


The AMU Patient-Doctor Connection Platform is envisioned as a comprehensive,

standalone application accessible through both web browsers and mobile devices. It

will be designed to integrate seamlessly with relevant existing AMU infrastructure,

particularly for accessing and managing medical course materials essential for the

student AI assistant. The overarching goal of this platform is to significantly enhance

healthcare accessibility for the Arba Minch community and to enrich the academic

learning experience for medical students at Arba Minch University.

### 2.2 User Characteristics


The platform is designed to cater to three primary user groups, each with distinct

needs and technical proficiencies:


Community Members/Patients: This group comprises individuals from the Arba

Minch community seeking medical advice, information, or direct connection with

healthcare professionals. Their technical proficiency may vary, necessitating an

intuitive and user-friendly interface.


Medical Doctors (AMU): These are professional healthcare providers affiliated

with Arba Minch University who will utilize the platform to offer medical services,

manage their professional profiles, and interact with patients. They are expected

to possess a comfortable level of familiarity with digital platforms.


Medical Students (AMU): This group consists of students enrolled in medical

programs at Arba Minch University who will leverage the platform’s specialized AI


assistant for academic support. These users are generally expected to be tech
savvy and proficient in utilizing digital learning tools.

### 2.3 General Constraints


Several critical constraints will govern the development and operation of the platform:


Security: All sensitive patient and doctor data must be rigorously secured,

adhering to the highest standards of data protection and complying with all

relevant privacy regulations and ethical guidelines.


Performance: The platform must exhibit high responsiveness and efficiently

manage a substantial number of concurrent users without experiencing any

significant degradation in performance.


Scalability: The system architecture must be inherently scalable, capable of

accommodating future growth in user base, data volume, and the introduction of

new features and functionalities.


Maintainability: The codebase must be meticulously documented, follow

established best practices, and be structured in a manner that facilitates easy

maintenance, updates, and future enhancements.


Technology Stack Adherence: Strict adherence to the specified technology

stack is mandatory, including Node.js with Express.js for the backend, React with

TypeScript and Redux for the web frontend, PostgreSQL for the database, and

Flutter for the mobile application development.

## 3. Specific Requirements

### 3.1 Functional Requirements


3.1.1 User Management


FR1.1.1 User Registration and Login: The system shall enable secure

registration and login functionalities for all user types (patients, doctors, and

students). A verification process will be implemented to authenticate doctors and

students as legitimate AMU personnel.


FR1.1.2 Profile Management: Doctors shall have comprehensive capabilities to

create, view, update, and delete their professional profiles. This includes

personal information, specialized medical fields (e.g., Internal Medicine, Surgery,

Pediatrics), academic and professional certifications, availability schedules,

consultation hours, and the ability to upload a profile picture. Patients and

students will have access to manage their basic profile information.


3.1.2 Patient-Doctor Connection


FR1.2.1 Doctor Search and Filtering: Patients shall be provided with robust

search and filtering options to locate doctors based on criteria such as specialty,

name, and availability. Patients will also be able to view detailed doctor profiles.


FR1.2.2 Appointment Scheduling (Optional for initial phase): The platform

may include functionality for patients to request appointments with doctors, and

for doctors to manage these requests by accepting, declining, or rescheduling

them.


FR1.2.3 Communication: Secure communication channels, such as in-platform

chat or messaging, shall be provided to facilitate interaction between patients

and doctors.


3.1.3 Rating System


FR1.3.1 Doctor Rating: Patients shall be able to submit ratings and provide

feedback for doctors following a consultation. These ratings will be prominently

displayed on the respective doctor’s profile.


FR1.3.2 Rating Review: Doctors shall have the ability to view their received

ratings and patient reviews.


3.1.4 AI Assistant for Patients


FR1.4.1 Disease Information: Patients shall be able to engage with an AI

assistant to obtain general information and advice concerning various diseases.

The AI assistant will always include clear disclaimers stating that its advice is not

a substitute for professional medical consultation.


3.1.5 AI Assistant Dashboard for Medical Students


FR1.5.1 Academic Support: Medical students shall have access to a dedicated AI

assistant dashboard. This AI assistant will be specifically trained on AMU medical

course materials, including subjects such as Anatomy, Physiology, Internal

Medicine, and Surgery, to provide targeted academic assistance.


FR1.5.2 Content Management (Admin): Administrators shall be equipped with

functionalities to upload, update, and manage AMU course materials used for

training the student AI assistant.


3.1.6 Payment Handling and Doctor Compensation


3.1.6.1 Payment Timing and Escrow Mechanism


FR1.6.1.1 Pre-payment with Escrow: Patients shall be required to make an

upfront payment for doctor consultations. These funds will be securely held in an

escrow system by the platform until the consultation service is confirmed as

completed by both the patient and the doctor [2].


FR1.6.1.2 Service Completion Confirmation: The platform shall provide

mechanisms for both patients and doctors to confirm the completion of a

consultation. In the absence of explicit confirmation, an automated timer (e.g.,

24 hours post-consultation) shall trigger fund release, provided no dispute is

raised.


FR1.6.1.3 Dispute Resolution: The platform shall include a process for resolving

disputes related to service delivery or payment, allowing for manual review and

intervention by administrators.


FR1.6.1.4 Refund Policy: In cases where a doctor fails to provide the service

within a specified timeframe or a dispute is resolved in favor of the patient, the

escrowed funds shall be automatically refunded to the patient.


3.1.6.2 Pricing Decision Process


FR1.6.2.1 Tiered Pricing Model: The platform shall implement a tiered pricing

model for doctor consultations, categorizing doctors based on their specialty and

experience (e.g., General Practitioners, Specialists, Super-Specialists). Each tier

will have a defined fee range.


FR1.6.2.2 Doctor-Defined Pricing (within limits): Doctors shall have the

flexibility to set their specific consultation fees within the predefined range of


their respective tier, allowing for market-based adjustments.


FR1.6.2.3 University Subsidies (Optional): The platform shall support the

integration of potential subsidies from Arba Minch University to reduce

consultation costs for community members, particularly for public health

initiatives.


FR1.6.2.4 AI Assistant for Students: Access to the AI Assistant Dashboard for

medical students shall be provided free of charge, authenticated via AMU student

credentials, as it serves as an academic support tool.


3.1.6.3 Payment and Compensation Management


FR1.6.3.1 Payment Gateway Integration: The platform shall integrate with

major Ethiopian digital payment gateways (e.g., Chapa, Telebirr, CBE Birr) to

facilitate patient payments for doctor consultations [2].


FR1.6.3.2 Secure Transaction Processing: The system shall ensure secure

processing of all financial transactions, including encryption and fraud

prevention measures.


FR1.6.3.3 Doctor Wallet Management: Doctors shall have a digital wallet within

the platform to view their earnings and initiate withdrawals to their linked bank

accounts or mobile money accounts.


FR1.6.3.4 Commission Management: The platform shall allow administrators to

configure and apply a commission rate on doctor consultation fees.


FR1.6.3.5 Transaction History: Both patients and doctors shall be able to view

their transaction history within the platform.


3.1.7 Administrative Features


FR1.7.1 User Management: Administrators shall have comprehensive tools to

manage user accounts, including the ability to add, edit, and delete accounts for

patients, doctors, and students.


FR1.7.2 Content Moderation: Administrators shall be able to moderate doctor

profiles and review/manage user-submitted ratings and reviews.


## 4. System Architecture

### 4.1 High-Level Architecture

The system will adopt a client-server architecture, ensuring a clear separation of

concerns between the frontend (web and mobile applications), the backend services,

and the database. This layered approach promotes scalability, maintainability, and

flexibility.




















### 4.2 Technology Stack

Backend: Node.js with Express.js framework.


Frontend (Web): React with TypeScript, utilizing Redux for state management.


Frontend (Mobile): Flutter for cross-platform mobile development.


Database: PostgreSQL, serving as the primary relational database.


AI Services: The specific AI services (e.g., OpenAI, custom machine learning

models) will be determined during the design phase based on functional

requirements and performance needs.

## 5. Data Model (Preliminary)

### 5.1 User Table


|Field|Data Type|Description|
|---|---|---|
|`user_id`|UUID|Unique identifer for each user.|
|`username`|VARCHAR(255)|User’s chosen username (must be unique).|
|`email`|VARCHAR(255)|User’s email address (must be unique).|
|`password`|VARCHAR(255)|Hashed password for secure authentication.|
|`role`|ENUM|Defnes the user’s role:‘patient’, ‘doctor’, ‘student’, or‘admin’.|
|`created_at`|TIMESTAMP|Timestamp indicating when the user account was created.|
|`updated_at`|TIMESTAMP|Timestamp of the last update to the user’s profle.|


### 5.2 Doctor Profile Table








|Field|Data Type|Description|
|---|---|---|
|`doctor_id`|UUID|Foreign key referencing`user_id`  where the user’s role<br>is‘doctor’.|
|`full_name`|VARCHAR(255)|The doctor’s complete name.|
|`specialty`|VARCHAR(255)|The doctor’s primary medical specialty (e.g., Internal<br>Medicine, Surgery).|
|`certifications`|TEXT|A JSON array storing details of the doctor’s<br>certifcations and qualifcations.|
|`bio`|TEXT|A brief biographical description of the doctor.|
|`contact_info`|VARCHAR(255)|Doctor’s contact information, such as phone number or<br>clinic address.|
|`profile_picture`|VARCHAR(255)|URL to the doctor’s profle picture.|
|`average_rating`|DECIMAL(2,1)|The calculated average rating received from patients<br>(e.g.,4.5).|
|`total_ratings`|INTEGER|The total count of ratings submitted by patients.|


### 5.3 Rating Table







|Field|Data Type|Description|
|---|---|---|
|`rating_id`|UUID|Unique identifer for each rating entry.|
|`patient_id`|UUID|Foreign key referencing`user_id` for the patient who submitted<br>the rating.|
|`doctor_id`|UUID|Foreign key referencing`user_id` for the doctor being rated.|
|`rating`|INTEGER|The rating given by the patient, typically on a scale of1 to5<br>stars.|
|`comment`|TEXT|An optional textual comment provided by the patient with the<br>rating.|
|`created_at`|TIMESTAMP|Timestamp indicating when the rating was created.|

### 5.4 AI Course Material Table








|Field|Data Type|Description|
|---|---|---|
|`material_id`|UUID|Unique identifer for each course material entry.|
|`title`|VARCHAR(255)|The title or name of the course material.|
|`content`|TEXT|The full textual content of the course material.|
|`uploaded_by`|UUID|Foreign key referencing`user_id`  for the administrator<br>who uploaded the material.|
|`uploaded_at`|TIMESTAMP|Timestamp indicating when the course material was<br>uploaded.|
|`last_updated`|TIMESTAMP|Timestamp of the last modifcation to the course material.|


## 6. Future Enhancements (Out of Scope for Initial Release)

While not part of the initial release, the following features are identified as potential

future enhancements:


Video/Audio Consultation: Integration of real-time video and audio

communication capabilities between patients and doctors.


Prescription Management: A system for doctors to issue and manage electronic

prescriptions.


Integration with AMU Hospital Systems: Deeper integration with existing Arba

Minch University Hospital systems for streamlined patient records and

appointments.


Advanced Analytics for Admins: Comprehensive dashboards and reporting

tools for administrators to gain insights into platform usage and performance.


Multi-language Support: Implementation of support for multiple languages to

cater to a broader user base.

## 7. Appendices

### 7.1 AMU Medical School Departments (from research notes)


Based on research into the Arba Minch University School of Medicine, the following

departments are identified as relevant for doctor specializations and student AI

assistant training materials:


Internal Medicine


Surgery (including General, Plastic, Orthopedic, Pediatric sub-specialties)


Dermatology


Gynecology and Obstetrics


Pediatrics


Anatomy & Biomedical Science


Biochemistry


Physiology


Pathology


Ophthalmology


Radiology


Anesthesiology


This document will be iteratively updated as more detailed requirements emerge and

throughout the development lifecycle of the platform.


