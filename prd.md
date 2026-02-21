# Product Requirements Document (PRD)
# Vendor Management System

**Version:** 1.0  
**Date:** February 10, 2026  
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Overview
The Vendor Management System is a desktop web application designed to streamline vendor onboarding, document management, and approval workflows. The system enables companies (vendors) to register through a portal, submit required business documents, and receive approval from administrators after verification.

### 1.2 Goals & Objectives
- Automate vendor registration and approval process
- Centralize vendor document management
- Provide transparent status tracking for vendors
- Enable efficient document verification for administrators
- Generate approval certificates upon final approval
- Notify stakeholders via email at key milestones

### 1.3 Target Users
- **Vendors/Companies**: Businesses seeking approval to become authorized vendors
- **System Administrator**: Single admin user responsible for approving vendors and verifying documents

---

## 2. User Roles & Permissions

### 2.1 Administrator
**Capabilities:**
- Approve or reject vendor registration requests
- View all vendor profiles and submitted documents
- Verify or reject individual documents with comments
- Provide feedback to vendors
- Issue final approval or rejection
- Generate approval certificates
- Access to complete system dashboard

**Limitations:**
- Single admin account only (no multiple admin support in v1.0)

### 2.2 Vendor
**Capabilities:**
- Register company account through portal
- Login after admin approval
- Submit required business documents
- View document verification status
- Receive feedback from admin
- View approval status and certificate
- Update profile information (limited)

**Limitations:**
- Cannot access system until registration approved
- Cannot modify documents after submission (must resubmit)
- Read-only access to own data

---

## 3. Core Features & Requirements

### 3.1 Vendor Registration & Onboarding

#### 3.1.1 Vendor Registration Portal
**Requirements:**
- Public registration form accessible without login
- Required fields:
  - Company Name (required)
  - Contact Person Name (required)
  - Email Address (required, unique)
  - Password (required, min 8 characters)
  - Phone Number (required)
  - Business Address (optional)
  - Company Type/Category (optional)
  - Tax ID/Registration Number (optional)
  
**Validation:**
- Email format validation
- Password strength requirements
- Duplicate email detection
- Phone number format validation

**Post-Registration:**
- Status: PENDING
- Vendor receives confirmation email
- Admin receives notification of new registration
- Vendor cannot login until approved

#### 3.1.2 Admin Registration Approval
**Requirements:**
- Admin dashboard shows pending registrations
- Admin can view vendor details
- Approve or Reject actions available
- Optional comments field for rejection
- Status updates:
  - Approve → APPROVED_LOGIN
  - Reject → REJECTED

**Notifications:**
- Email to vendor on approval (with login credentials reminder)
- Email to vendor on rejection (with reason if provided)

---

### 3.2 Authentication & Authorization

#### 3.2.1 Login System
**Requirements:**
- Separate login interface for Admin and Vendor
- Email + Password authentication
- Session management
- "Remember Me" functionality
- Password reset capability
- Logout functionality

**Security:**
- Password hashing (bcrypt/argon2)
- JWT or session-based authentication
- HTTPS required
- Rate limiting on login attempts
- Account lockout after failed attempts

#### 3.2.2 Role-Based Access Control
**Requirements:**
- Route protection based on user role
- Admin cannot access vendor portal
- Vendor cannot access admin dashboard
- Redirect to appropriate dashboard on login

---

### 3.3 Document Management

#### 3.3.1 Document Types
The system supports the following document categories:

**Business Registration Documents:**
- Certificate of Incorporation
- Business Registration Certificate
- Articles of Association
- Memorandum of Association

**Tax Documents:**
- Tax Identification Number (TIN)
- VAT Registration Certificate
- Tax Compliance Certificate
- Latest Tax Returns

**Banking Documents:**
- Bank Account Details
- Cancelled Cheque
- Bank Letter/Reference

**Certificates & Licenses:**
- Trade License
- Professional Licenses
- Industry-Specific Certifications
- Quality Certifications (ISO, etc.)

**Insurance Documents:**
- General Liability Insurance
- Professional Indemnity Insurance
- Workers Compensation Insurance

**Custom Documents:**
- Admin can add custom document types
- Vendors can upload additional documents as requested

#### 3.3.2 Document Upload (Vendor)
**Requirements:**
- Multi-file upload interface
- Drag-and-drop support
- File type restrictions: PDF, JPG, PNG, DOCX
- File size limit: 10MB per file
- Preview uploaded documents
- Delete/replace documents before submission
- Bulk upload capability

**Validation:**
- File format validation
- File size validation
- Virus/malware scanning (recommended)
- Duplicate detection

**Document Metadata:**
- Document Type (dropdown selection)
- Upload timestamp
- File name
- File size
- Uploader ID

#### 3.3.3 Document Submission Workflow
**Requirements:**
- Checklist of required documents
- Progress indicator (X of Y documents uploaded)
- Submit all documents at once
- Confirmation dialog before submission
- Status change: APPROVED_LOGIN → DOCUMENTS_SUBMITTED
- Cannot modify after submission

**Notifications:**
- Email to admin when documents submitted
- Email confirmation to vendor

#### 3.3.4 Document Verification (Admin)
**Requirements:**
- View all submitted documents by vendor
- Download individual documents
- View document in browser (for PDFs/images)
- Verify or Reject each document individually
- Add comments/feedback for each document
- Status options:
  - VERIFIED
  - REJECTED (must provide reason)

**Bulk Actions:**
- Verify all documents at once
- Request revisions for multiple documents

**Comments/Feedback:**
- Required for rejection
- Optional for verification
- Character limit: 500 characters
- Visible to vendor

---

### 3.4 Vendor Status Management

#### 3.4.1 Status Flow
```
PENDING 
  ↓ (Admin approves registration)
APPROVED_LOGIN 
  ↓ (Vendor submits documents)
DOCUMENTS_SUBMITTED 
  ↓ (Admin starts review)
UNDER_REVIEW 
  ↓ (Admin decision)
APPROVED or REJECTED
```

#### 3.4.2 Status Definitions
- **PENDING**: Initial registration, awaiting admin approval to login
- **APPROVED_LOGIN**: Can login and access portal, must submit documents
- **DOCUMENTS_SUBMITTED**: All required documents uploaded, awaiting admin review
- **UNDER_REVIEW**: Admin is actively reviewing documents
- **APPROVED**: Final approval granted, vendor is fully onboarded
- **REJECTED**: Application rejected (can be at any stage)

#### 3.4.3 Status Actions
**Admin Actions:**
- Approve Registration (PENDING → APPROVED_LOGIN)
- Reject Registration (PENDING → REJECTED)
- Start Review (DOCUMENTS_SUBMITTED → UNDER_REVIEW)
- Final Approval (UNDER_REVIEW → APPROVED)
- Final Rejection (UNDER_REVIEW → REJECTED)
- Request Revisions (UNDER_REVIEW → APPROVED_LOGIN)

**Vendor Actions:**
- Submit Documents (APPROVED_LOGIN → DOCUMENTS_SUBMITTED)
- Resubmit Documents (if requested)

---

### 3.5 Final Approval Process

#### 3.5.1 Approval Workflow
**Requirements:**
- Admin reviews all verified documents
- Final approval button/action
- Optional approval comments
- Status change to APPROVED
- Approval date recorded

**Post-Approval Actions:**
1. Update vendor status to APPROVED
2. Generate approval certificate (PDF)
3. Send approval email to vendor with certificate attached
4. Display approval status in vendor dashboard
5. Make certificate downloadable from vendor portal

#### 3.5.2 Approval Certificate
**Requirements:**
- PDF generation using jsPDF
- Certificate includes:
  - Company Name
  - Registration Number (system-generated)
  - Approval Date
  - Certificate Number (unique)
  - Admin signature/stamp placeholder
  - QR code for verification (optional)
  - Validity period (if applicable)

**Design:**
- Professional letterhead
- Company logo placeholder
- Official seal/watermark
- Print-friendly format

#### 3.5.3 Rejection with Feedback
**Requirements:**
- Admin can reject at any stage
- Rejection reason required (text field)
- Vendor receives rejection email with reason
- Vendor can view rejection reason in portal
- Option to allow reapplication (configurable)

---

### 3.6 Email Notifications

#### 3.6.1 Email Triggers
**To Vendor:**
- Registration confirmation (immediate)
- Registration approved (can now login)
- Registration rejected (with reason)
- Documents received confirmation
- Document verification completed
- Revision requested (with details)
- Final approval (with certificate)
- Final rejection (with reason)

**To Admin:**
- New vendor registration
- Documents submitted for review
- Vendor resubmitted documents

#### 3.6.2 Email Content Requirements
- Professional email template
- Clear subject lines
- Action buttons/links where applicable
- Contact information
- Unsubscribe option (optional)

---

## 4. User Interface Requirements

### 4.1 Vendor Portal

#### 4.1.1 Registration Page
- Clean, professional design
- Form validation with error messages
- Progress indicator (if multi-step)
- Terms & conditions checkbox
- Privacy policy link

#### 4.1.2 Vendor Dashboard
**Components:**
- Welcome message with company name
- Status banner (current status)
- Progress tracker (visual timeline)
- Quick actions:
  - Upload documents (if status allows)
  - View documents
  - Download certificate (if approved)
- Recent activity feed
- Profile summary

#### 4.1.3 Document Upload Page
- Document type selector
- Upload area (drag-drop)
- Uploaded documents list with:
  - Document name
  - Type
  - Size
  - Upload date
  - Verification status
  - Admin comments (if any)
- Submit button (disabled until all required docs uploaded)

#### 4.1.4 Profile Page
- View company information
- Edit limited fields
- Change password
- View approval certificate (if approved)

### 4.2 Admin Dashboard

#### 4.2.1 Main Dashboard
**Components:**
- Statistics cards:
  - Pending registrations
  - Documents under review
  - Approved vendors
  - Rejected applications
- Recent activity list
- Pending actions list

#### 4.2.2 Vendor Management Page
**Features:**
- Searchable vendor list
- Filters:
  - Status
  - Date range
  - Company name
- Sort by: Date, Status, Company name
- Action buttons per vendor:
  - View details
  - Review documents
  - Approve/Reject

#### 4.2.3 Vendor Detail Page
**Sections:**
- Vendor information
- Status timeline
- Documents section:
  - List of all documents
  - Preview/Download
  - Verify/Reject buttons
  - Comments field
- Action buttons:
  - Approve registration
  - Reject registration
  - Final approval
  - Request revisions
- Activity log

#### 4.2.4 Document Review Interface
- Full-screen document viewer
- Side panel for comments
- Quick verify/reject buttons
- Navigate between documents
- Download option

---

## 5. Technical Requirements

### 5.1 Technology Stack
- **Frontend Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage (for documents)
- **Authentication**: Supabase Auth + Custom JWT
- **PDF Generation**: jsPDF
- **Email Service**: Supabase / SendGrid / Resend
- **Notifications**: React Hot Toast

### 5.2 Database Schema

#### Tables:
1. **User** - Authentication and role management
2. **Admin** - Admin profile information
3. **Vendor** - Vendor/company information
4. **DocumentType** - Predefined document categories
5. **Document** - Uploaded documents
6. **DocumentVerification** - Admin verification records
7. **VendorApproval** - Approval history/audit trail

#### Key Relationships:
- User → Admin (1:1)
- User → Vendor (1:1)
- Vendor → Documents (1:Many)
- Document → DocumentVerification (1:1)
- Admin → DocumentVerifications (1:Many)
- Vendor → VendorApprovals (1:Many)

### 5.3 File Storage
**Requirements:**
- Supabase Storage buckets
- Organized by vendor ID
- Secure URLs with expiration
- Access control (vendor can only access own files)
- Backup strategy

**Bucket Structure:**
```
/vendor-documents
  /{vendorId}
    /{documentId}-{filename}
```

### 5.4 Security Requirements
- **Authentication**: JWT tokens with expiration
- **Authorization**: Row-level security in Supabase
- **Password Policy**: Min 8 chars, 1 uppercase, 1 number, 1 special
- **File Upload**: Antivirus scanning, type validation
- **Data Encryption**: At rest and in transit (SSL)
- **Rate Limiting**: API endpoints protected
- **SQL Injection**: Parameterized queries via Prisma
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based

### 5.5 Performance Requirements
- Page load time: < 2 seconds
- Document upload: Support up to 50MB total
- Concurrent users: Support 100+ simultaneous users
- Database queries: < 100ms average
- API response time: < 500ms

---

## 6. User Workflows

### 6.1 Vendor Registration & Approval Flow
```
1. Vendor visits registration page
2. Fills out registration form
3. Submits registration
4. Status: PENDING
5. Receives confirmation email
6. Admin receives notification
7. Admin reviews registration in dashboard
8. Admin approves/rejects
9. If approved:
   - Status → APPROVED_LOGIN
   - Vendor receives approval email
   - Vendor can now login
10. If rejected:
    - Status → REJECTED
    - Vendor receives rejection email with reason
```

### 6.2 Document Submission Flow
```
1. Vendor logs in
2. Navigates to Documents page
3. Views required document checklist
4. Uploads documents one by one or in bulk
5. Assigns document type to each file
6. Reviews uploaded documents
7. Clicks "Submit All Documents"
8. Confirms submission
9. Status → DOCUMENTS_SUBMITTED
10. Receives confirmation email
11. Admin receives notification
```

### 6.3 Document Verification Flow
```
1. Admin logs in
2. Views "Documents Under Review" section
3. Clicks on vendor to review
4. Views vendor details and document list
5. Status → UNDER_REVIEW (automatic)
6. Opens each document
7. For each document:
   - Views/downloads document
   - Verifies or rejects
   - Adds comments if needed
8. After all documents reviewed:
   - All verified → Enable "Final Approval"
   - Some rejected → Enable "Request Revisions"
```

### 6.4 Final Approval Flow
```
1. Admin clicks "Final Approval"
2. Adds optional comments
3. Confirms approval
4. System:
   - Status → APPROVED
   - Generates certificate PDF
   - Sends approval email with certificate
   - Records approval date
5. Vendor receives email
6. Vendor logs in
7. Views approved status
8. Downloads certificate
```

### 6.5 Revision Request Flow
```
1. Admin requests revisions
2. Status → APPROVED_LOGIN
3. Vendor receives email with:
   - List of rejected documents
   - Admin comments for each
4. Vendor logs in
5. Views rejected documents with comments
6. Re-uploads corrected documents
7. Submits again
8. Status → DOCUMENTS_SUBMITTED
9. Process repeats from verification flow
```

---

## 7. Data Models

### 7.1 User
```typescript
{
  id: string
  email: string
  password: string (hashed)
  role: 'ADMIN' | 'VENDOR'
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 7.2 Vendor
```typescript
{
  id: string
  userId: string
  companyName: string
  contactPerson: string
  phone: string
  address: string | null
  status: VendorStatus
  registrationDate: DateTime
  approvalDate: DateTime | null
  rejectionReason: string | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 7.3 Document
```typescript
{
  id: string
  vendorId: string
  documentTypeId: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: DateTime
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
}
```

### 7.4 DocumentVerification
```typescript
{
  id: string
  documentId: string
  adminId: string
  status: DocumentStatus
  comments: string | null
  verifiedAt: DateTime
}
```

---

## 8. API Endpoints

### 8.1 Authentication
- `POST /api/auth/register` - Vendor registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

### 8.2 Vendor (Protected)
- `GET /api/vendor/profile` - Get vendor profile
- `PUT /api/vendor/profile` - Update vendor profile
- `GET /api/vendor/documents` - Get vendor's documents
- `POST /api/vendor/documents/upload` - Upload document
- `DELETE /api/vendor/documents/:id` - Delete document
- `POST /api/vendor/documents/submit` - Submit all documents
- `GET /api/vendor/certificate` - Download approval certificate

### 8.3 Admin (Protected)
- `GET /api/admin/vendors` - List all vendors
- `GET /api/admin/vendors/:id` - Get vendor details
- `PUT /api/admin/vendors/:id/approve-registration` - Approve registration
- `PUT /api/admin/vendors/:id/reject-registration` - Reject registration
- `GET /api/admin/vendors/:id/documents` - Get vendor documents
- `PUT /api/admin/documents/:id/verify` - Verify document
- `PUT /api/admin/documents/:id/reject` - Reject document
- `PUT /api/admin/vendors/:id/final-approve` - Final approval
- `PUT /api/admin/vendors/:id/request-revisions` - Request revisions
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### 8.4 Documents
- `GET /api/documents/types` - List document types
- `POST /api/documents/types` - Create document type (Admin only)
- `GET /api/documents/:id/download` - Download document

---

## 9. Non-Functional Requirements

### 9.1 Usability
- Intuitive navigation
- Responsive design (desktop-first, mobile-friendly)
- Accessible (WCAG 2.1 Level AA)
- Consistent UI/UX across all pages
- Loading states and error messages
- Tooltips and help text

### 9.2 Reliability
- 99.9% uptime
- Automated backups (daily)
- Data redundancy
- Error logging and monitoring
- Graceful error handling

### 9.3 Scalability
- Support 10,000+ vendors
- Handle 100+ concurrent uploads
- Database indexing for performance
- CDN for static assets
- Horizontal scaling capability

### 9.4 Maintainability
- Clean code architecture
- Comprehensive documentation
- TypeScript for type safety
- Automated testing (unit, integration)
- Version control (Git)
- Code review process

### 9.5 Compliance
- GDPR compliance (data privacy)
- Data retention policies
- Audit trail for all actions
- Right to erasure (delete account)
- Data export capability

---

## 10. Future Enhancements (V2.0+)

### 10.1 Phase 2 Features
- Multiple admin users with role-based permissions
- Bulk vendor operations
- Advanced reporting and analytics
- Vendor categories/tiers
- Contract management
- Performance ratings
- Vendor self-service document updates
- API for third-party integrations

### 10.2 Phase 3 Features
- Mobile apps (iOS/Android)
- Real-time notifications (WebSockets)
- AI-powered document verification
- OCR for automatic data extraction
- Multi-language support
- White-label capabilities
- Advanced workflow automation
- Blockchain for certificate verification

---

## 11. Success Metrics

### 11.1 KPIs
- Registration completion rate: > 80%
- Average time to approval: < 3 days
- Document verification accuracy: > 95%
- User satisfaction score: > 4.5/5
- System uptime: > 99.9%
- Average page load time: < 2s

### 11.2 Business Metrics
- Number of registered vendors
- Number of approved vendors
- Documents processed per month
- Time saved vs. manual process
- Admin productivity increase

---

## 12. Risks & Mitigation

### 12.1 Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data breach | High | Low | Implement strong security, encryption, regular audits |
| Database failure | High | Low | Automated backups, redundancy, disaster recovery plan |
| Supabase service outage | Medium | Low | Monitor service status, have migration plan |
| File upload vulnerabilities | High | Medium | Virus scanning, type validation, size limits |

### 12.2 Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low vendor adoption | High | Medium | User training, support documentation, demos |
| Admin bottleneck | Medium | High | Streamline approval process, automation |
| Regulatory changes | Medium | Low | Stay informed, flexible architecture |

---

## 13. Project Timeline

### Phase 1: Foundation (Weeks 1-2)
- Database schema design
- Authentication system
- Basic UI/UX design
- Project setup

### Phase 2: Core Features (Weeks 3-5)
- Vendor registration & approval
- Document upload system
- Admin dashboard
- Document verification

### Phase 3: Advanced Features (Weeks 6-7)
- Email notifications
- Certificate generation
- Status management
- Testing

### Phase 4: Polish & Launch (Week 8)
- Bug fixes
- Performance optimization
- Documentation
- Deployment

---

## 14. Appendix

### 14.1 Glossary
- **Vendor**: A company/business seeking approval
- **Admin**: System administrator who manages approvals
- **Document Verification**: Process of reviewing submitted documents
- **Final Approval**: Last step granting vendor full approved status
- **Status**: Current state of vendor application

### 14.2 Document Types Reference
See Section 3.3.1 for complete list

### 14.3 Contact Information
- Project Manager: [Name]
- Technical Lead: [Name]
- Product Owner: [Name]

---

**Document End**