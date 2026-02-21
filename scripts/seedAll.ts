import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';
import Vendor from '../lib/db/models/Vendor';
import Document from '../lib/db/models/Document';
import DocumentType from '../lib/db/models/DocumentType';
import DocumentVerification from '../lib/db/models/DocumentVerification';
import Proposal from '../lib/db/models/Proposal';
import ProposalSubmission from '../lib/db/models/ProposalSubmission';
import ActivityLog from '../lib/db/models/ActivityLog';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';

// Test data
const testUsers = [
  {
    email: 'admin@vms.com',
    password: 'Admin@123',
    role: 'ADMIN' as const,
  },
  {
    email: 'vendor@vms.com',
    password: 'Admin@123',
    role: 'VENDOR' as const,
  },
  {
    email: 'testvendor1@vms.com',
    password: 'Admin@123',
    role: 'VENDOR' as const,
  },
  {
    email: 'testvendor2@vms.com',
    password: 'Admin@123',
    role: 'VENDOR' as const,
  },
];

const testVendors = [
  {
    email: 'vendor@vms.com',
    status: 'APPROVED' as const,
    companyName: 'Acme Corporation',
    contactPerson: 'John Doe',
    phone: '+1-555-0101',
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
    },
    companyType: 'LLC' as const,
    taxId: '12-3456789',
  },
  {
    email: 'testvendor1@vms.com',
    status: 'UNDER_REVIEW' as const,
    companyName: 'Tech Innovations LLC',
    contactPerson: 'Jane Smith',
    phone: '+1-555-0102',
    address: {
      street: '456 Technology Park',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105',
    },
    companyType: 'Corporation' as const,
    taxId: '98-7654321',
  },
  {
    email: 'testvendor2@vms.com',
    status: 'DOCUMENTS_SUBMITTED' as const,
    companyName: 'Global Solutions Inc',
    contactPerson: 'Bob Johnson',
    phone: '+1-555-0103',
    address: {
      street: '789 Enterprise Blvd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78701',
    },
    companyType: 'Partnership' as const,
    taxId: '45-6789123',
  },
];

const documentTypes = [
  { name: 'Certificate of Incorporation', category: 'BUSINESS_REGISTRATION', isRequired: true },
  { name: 'Business Registration', category: 'BUSINESS_REGISTRATION', isRequired: true },
  { name: 'Tax Compliance Certificate', category: 'TAX', isRequired: true },
  { name: 'TIN Certificate', category: 'TAX', isRequired: true },
  { name: 'Bank Account Details', category: 'BANKING', isRequired: true },
  { name: 'Trade License', category: 'CERTIFICATES_LICENCES', isRequired: true },
  { name: 'Professional License', category: 'CERTIFICATES_LICENCES', isRequired: false },
  { name: 'Insurance Certificate', category: 'INSURANCE', isRequired: true },
];

const testProposals = [
  {
    title: 'Office Supplies Procurement 2026',
    description: 'Annual procurement of office supplies for all departments including paper, pens, folders, and other consumables.',
    category: 'PROCUREMENT',
    budgetMin: 40000,
    budgetMax: 60000,
    requirements: ['Suppliers must provide bulk pricing', 'Delivery within 7 days', 'Quality guarantee required'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'OPEN' as const,
  },
  {
    title: 'IT Equipment Upgrade',
    description: 'Upgrade of computer systems and peripherals for the IT department.',
    category: 'TECHNOLOGY',
    budgetMin: 120000,
    budgetMax: 180000,
    requirements: ['Latest generation processors', 'Minimum 16GB RAM', '3-year warranty included'],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'OPEN' as const,
  },
  {
    title: 'Cleaning Services Contract',
    description: 'Annual cleaning services for corporate headquarters.',
    category: 'SERVICES',
    budgetMin: 60000,
    budgetMax: 90000,
    requirements: ['Daily cleaning service', 'Eco-friendly products', 'Fully insured staff'],
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'DRAFT' as const,
  },
];

async function clearCollections() {
  console.log('🗑️  Clearing existing collections...');
  await User.deleteMany({});
  await Vendor.deleteMany({});
  await Document.deleteMany({});
  await DocumentType.deleteMany({});
  await DocumentVerification.deleteMany({});
  await Proposal.deleteMany({});
  await ProposalSubmission.deleteMany({});
  await ActivityLog.deleteMany({});
  console.log('✅ Collections cleared');
}

async function seedUsers() {
  console.log('👤 Seeding users...');

  for (const userData of testUsers) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      // Create user without pre-hashed password - let User model's pre-save hook handle it
      const user = new User({
        email: userData.email,
        password: 'Admin@123', // Will be hashed by pre-save hook
        role: userData.role,
        isActive: true,
        loginAttempts: 0,
      });
      await user.save();
      console.log(`   ✅ Created user: ${userData.email} (${userData.role})`);
    } else {
      console.log(`   ⏭️  User already exists: ${userData.email}`);
    }
  }
}

async function seedDocumentTypes() {
  console.log('📄 Seeding document types...');
  for (const docType of documentTypes) {
    const existing = await DocumentType.findOne({ name: docType.name });
    if (!existing) {
      await DocumentType.create(docType);
      console.log(`   ✅ Created document type: ${docType.name}`);
    } else {
      console.log(`   ⏭️  Document type already exists: ${docType.name}`);
    }
  }
}

async function seedVendors() {
  console.log('🏢 Seeding vendors...');

  for (const vendorData of testVendors) {
    const user = await User.findOne({ email: vendorData.email });
    if (!user) {
      console.log(`   ⚠️  User not found for ${vendorData.email}, skipping vendor`);
      continue;
    }

    const existingVendor = await Vendor.findOne({ userId: user._id });
    if (!existingVendor) {
      await Vendor.create({
        userId: user._id,
        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...vendorData,
      });
      console.log(`   ✅ Created vendor: ${vendorData.companyName} (${vendorData.status})`);
    } else {
      console.log(`   ⏭️  Vendor already exists: ${vendorData.companyName}`);
    }
  }
}

async function seedDocuments() {
  console.log('📁 Seeding documents...');

  const vendors = await Vendor.find();
  const docTypes = await DocumentType.find();

  for (const vendor of vendors) {
    // Add 2-4 documents per vendor
    const numDocs = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numDocs; i++) {
      const docType = docTypes[Math.floor(Math.random() * docTypes.length)];

      const existingDoc = await Document.findOne({
        vendorId: vendor._id,
        documentTypeId: docType._id,
      });

      if (!existingDoc) {
        const status = ['PENDING', 'VERIFIED', 'REJECTED'][Math.floor(Math.random() * 3)] as any;

        const document = await Document.create({
          vendorId: vendor._id,
          documentTypeId: docType._id,
          fileName: `${docType.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
          originalName: `${docType.name}.pdf`,
          fileUrl: `https://example.com/documents/${vendor._id}/${docType.name}.pdf`,
          filePath: `/documents/${vendor._id}/${docType.name}.pdf`,
          fileSize: 1024000 + Math.floor(Math.random() * 5000000),
          mimeType: 'application/pdf',
          uploadedBy: vendor.userId,
          status,
        });

        // Add verification for verified/rejected documents
        if (status !== 'PENDING') {
          const admin = await User.findOne({ role: 'ADMIN' });
          if (admin) {
            await DocumentVerification.create({
              documentId: document._id,
              verifiedBy: admin._id,
              status,
              comments: status === 'VERIFIED' ? 'Document looks good' : 'Please resubmit with clearer copy',
              verifiedAt: new Date(),
            });
          }
        }

        console.log(`   ✅ Created document for ${vendor.companyName}: ${docType.name} (${status})`);
      }
    }
  }
}

async function seedProposals() {
  console.log('📋 Seeding proposals...');

  const admin = await User.findOne({ role: 'ADMIN' });
  if (!admin) {
    console.log('   ⚠️  No admin user found, skipping proposals');
    return;
  }

  for (const proposalData of testProposals) {
    const existing = await Proposal.findOne({ title: proposalData.title });
    if (!existing) {
      const proposal = await Proposal.create({
        ...proposalData,
        createdBy: admin._id,
      });
      console.log(`   ✅ Created proposal: ${proposalData.title} (${proposalData.status})`);

      // Create a submission for OPEN proposals from approved vendor
      if (proposalData.status === 'OPEN') {
        const approvedVendor = await Vendor.findOne({ status: 'APPROVED' });
        if (approvedVendor) {
          const existingSubmission = await ProposalSubmission.findOne({
            proposalId: proposal._id,
            vendorId: approvedVendor._id,
          });

          if (!existingSubmission) {
            const avgBudget = (proposalData.budgetMin + proposalData.budgetMax) / 2;
            await ProposalSubmission.create({
              proposalId: proposal._id,
              vendorId: approvedVendor._id,
              proposedAmount: avgBudget,
              description: `We propose to complete this project for $${avgBudget}. Our team has extensive experience in this area.`,
              approach: 'Agile methodology with weekly sprints and deliverables.',
              timeline: '4 weeks',
              status: 'SUBMITTED',
            });
            console.log(`   ✅ Created submission from ${approvedVendor.companyName}`);
          }
        }
      }
    } else {
      console.log(`   ⏭️  Proposal already exists: ${proposalData.title}`);
    }
  }
}

async function seedActivityLogs() {
  console.log('📝 Seeding activity logs...');

  const vendors = await Vendor.find();
  const admin = await User.findOne({ role: 'ADMIN' });

  for (const vendor of vendors) {
    const activities = [
      {
        activityType: 'VENDOR_CREATED',
        description: `${vendor.companyName} registered as a new vendor`,
        performedBy: vendor.userId,
      },
      {
        activityType: 'PROFILE_UPDATED',
        description: `Status changed to ${vendor.status}`,
        performedBy: admin?._id || vendor.userId,
      },
    ];

    for (const activity of activities) {
      await ActivityLog.create({
        vendorId: vendor._id,
        ...activity,
      });
    }
    console.log(`   ✅ Created activity logs for ${vendor.companyName}`);
  }
}

async function seedAll() {
  try {
    console.log('🌱 Starting comprehensive seed...\n');
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    await clearCollections();
    console.log();

    await seedUsers();
    console.log();

    await seedDocumentTypes();
    console.log();

    await seedVendors();
    console.log();

    await seedDocuments();
    console.log();

    await seedProposals();
    console.log();

    await seedActivityLogs();
    console.log();

    console.log('✨ Seed completed successfully!\n');
    console.log('📋 Test credentials:');
    console.log('   Admin: admin@vms.com / Admin@123');
    console.log('   Vendor: vendor@vms.com / Admin@123');
    console.log('   Test Vendor 1: testvendor1@vms.com / Admin@123');
    console.log('   Test Vendor 2: testvendor2@vms.com / Admin@123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

seedAll();
