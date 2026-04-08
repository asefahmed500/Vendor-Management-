import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '@/lib/db/models/User';
import Vendor from '@/lib/db/models/Vendor';
import Proposal from '@/lib/db/models/Proposal';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import Document from '@/lib/db/models/Document';
import DocumentType from '@/lib/db/models/DocumentType';
import ActivityLog from '@/lib/db/models/ActivityLog';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

async function findOrCreateUser(email: string, data: any) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create(data);
  }
  return user;
}

async function findOrCreateVendor(userId: string, data: any) {
  let vendor = await Vendor.findOne({ userId });
  if (!vendor) {
    vendor = await Vendor.create(data);
  }
  return vendor;
}

async function findOrCreateActivity(data: any) {
  const exists = await ActivityLog.findOne({
    vendorId: data.vendorId,
    activityType: data.activityType,
  });
  if (!exists) {
    return ActivityLog.create(data);
  }
  return exists;
}

async function findOrCreateSubmission(proposalId: mongoose.Types.ObjectId, vendorId: mongoose.Types.ObjectId, data: any) {
  let submission = await ProposalSubmission.findOne({ proposalId, vendorId });
  if (!submission) {
    submission = await ProposalSubmission.create(data);
  }
  return submission;
}

async function findOrCreateDocument(vendorId: mongoose.Types.ObjectId, documentTypeId: mongoose.Types.ObjectId, data: any) {
  let doc = await Document.findOne({ vendorId, documentTypeId });
  if (!doc) {
    doc = await Document.create(data);
  }
  return doc;
}

async function seed() {
  console.log('🌱 Starting VMS seed...');
  
  await connectDB();
  
  console.log('\n📋 Seeding Document Types...');
  const documentTypes = await DocumentType.insertMany([
    {
      name: 'Business Registration Certificate',
      category: 'BUSINESS_REGISTRATION',
      description: 'Certificate of incorporation or business registration',
      isRequired: true,
      isActive: true,
      allowedFormats: ['pdf', 'doc', 'docx'],
      maxSizeMB: 10,
    },
    {
      name: 'Tax Identification Number',
      category: 'TAX',
      description: 'Tax ID or VAT registration certificate',
      isRequired: true,
      isActive: true,
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      maxSizeMB: 5,
    },
    {
      name: 'Insurance Certificate',
      category: 'INSURANCE',
      description: 'General liability or professional insurance certificate',
      isRequired: true,
      isActive: true,
      allowedFormats: ['pdf', 'doc', 'docx'],
      maxSizeMB: 10,
    },
    {
      name: 'Bank Details Letter',
      category: 'BANKING',
      description: 'Bank account verification letter on bank letterhead',
      isRequired: false,
      isActive: true,
      allowedFormats: ['pdf', 'doc', 'docx'],
      maxSizeMB: 5,
    },
    {
      name: 'ISO Certification',
      category: 'CERTIFICATES_LICENCES',
      description: 'ISO 9001 or other relevant certifications',
      isRequired: false,
      isActive: true,
      allowedFormats: ['pdf', 'doc', 'docx'],
      maxSizeMB: 10,
    },
  ]);
  console.log(`   Created ${documentTypes.length} document types`);

  console.log('\n👤 Seeding Admin User...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await findOrCreateUser('admin@vms.com', {
    name: 'Admin User',
    email: 'admin@vms.com',
    password: adminPassword,
    role: 'ADMIN',
    isVerified: true,
  });
  console.log(`   Admin user: admin@vms.com / admin123`);

  console.log('\n🏢 Seeding Vendors...');
  const vendorData = [
    {
      companyName: 'TechCorp Solutions',
      contactPerson: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1 555-0101',
      address: { city: 'San Francisco', country: 'USA' },
      companyType: 'Technology',
      status: 'APPROVED',
    },
    {
      companyName: 'Global Services Inc',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@globalservices.com',
      phone: '+1 555-0102',
      address: { city: 'New York', country: 'USA' },
      companyType: 'Services',
      status: 'APPROVED',
    },
    {
      companyName: 'Prime Logistics',
      contactPerson: 'Mike Wilson',
      email: 'mike@primelogistics.com',
      phone: '+1 555-0103',
      address: { city: 'Chicago', country: 'USA' },
      companyType: 'Logistics',
      status: 'DOCUMENTS_SUBMITTED',
    },
    {
      companyName: 'CloudTech Systems',
      contactPerson: 'Emily Davis',
      email: 'emily@cloudtech.com',
      phone: '+1 555-0104',
      address: { city: 'Seattle', country: 'USA' },
      companyType: 'Technology',
      status: 'PENDING',
    },
    {
      companyName: 'Apex Consulting',
      contactPerson: 'Robert Brown',
      email: 'robert@apexconsulting.com',
      phone: '+1 555-0105',
      address: { city: 'Boston', country: 'USA' },
      companyType: 'Consulting',
      status: 'UNDER_REVIEW',
    },
  ];

  const createdVendors = [];
  for (const vData of vendorData) {
    const vendorPassword = await bcrypt.hash('vendor123', 12);
    const vendorUser = await findOrCreateUser(vData.email, {
      name: vData.contactPerson,
      email: vData.email,
      password: vendorPassword,
      role: 'VENDOR',
      isVerified: true,
    });

    const vendor = await findOrCreateVendor(vendorUser._id.toString(), {
      userId: vendorUser._id.toString(),
      companyName: vData.companyName,
      contactPerson: vData.contactPerson,
      phone: vData.phone,
      address: vData.address,
      companyType: vData.companyType,
      status: vData.status,
      registrationDate: new Date(),
    });
    createdVendors.push(vendor);

    await findOrCreateActivity({
      vendorId: vendor._id,
      performedBy: adminUser._id,
      activityType: 'VENDOR_CREATED',
      description: `Vendor ${vData.companyName} registered`,
    });
  }
  console.log(`   Created ${createdVendors.length} vendors`);

  console.log('\n📝 Seeding Proposals (RFPs)...');
  const proposalData = [
    {
      title: 'Cloud Infrastructure Upgrade',
      description: 'Seeking vendor to upgrade our cloud infrastructure including servers, storage, and networking.',
      budget: 150000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
      requirements: ['Cloud architecture certification', 'Minimum 5 years experience', '24/7 support capability'],
    },
    {
      title: 'Security Audit Services',
      description: 'Comprehensive security audit and penetration testing for enterprise systems.',
      budget: 75000,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
      requirements: ['CISSP certification', 'ISO 27001 experience', 'Detailed report capability'],
    },
    {
      title: 'IT Support Contract',
      description: 'Ongoing IT support and maintenance for 500+ employees.',
      budget: 200000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
      requirements: ['Help desk experience', 'SLA commitment', 'On-site and remote support'],
    },
    {
      title: 'Database Migration Project',
      description: 'Migrate legacy databases to modern cloud-based solution.',
      budget: 120000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'CLOSED',
      requirements: ['Database certification', 'Migration experience', 'Data integrity guarantee'],
    },
  ];

  const createdProposals = await Proposal.insertMany(proposalData);
  console.log(`   Created ${createdProposals.length} proposals`);

  console.log('\n📨 Seeding Proposal Submissions...');
  const submissionData = [
    {
      proposalId: createdProposals[0]._id,
      vendorId: createdVendors[0]._id,
      proposedAmount: 145000,
      description: 'Complete cloud infrastructure upgrade with 3-year support.',
      status: 'PENDING',
    },
    {
      proposalId: createdProposals[0]._id,
      vendorId: createdVendors[1]._id,
      proposedAmount: 155000,
      description: 'Enterprise cloud solution with dedicated support team.',
      status: 'ACCEPTED',
    },
    {
      proposalId: createdProposals[1]._id,
      vendorId: createdVendors[2]._id,
      proposedAmount: 70000,
      description: 'Comprehensive security audit with detailed remediation plan.',
      status: 'PENDING',
    },
    {
      proposalId: createdProposals[2]._id,
      vendorId: createdVendors[0]._id,
      proposedAmount: 195000,
      description: 'Full IT support with dedicated account manager.',
      status: 'PENDING',
    },
  ];

  for (const sub of submissionData) {
    await findOrCreateSubmission(sub.proposalId, sub.vendorId, sub);
  }
  console.log(`   Created ${submissionData.length} submissions`);

  console.log('\n📄 Seeding Sample Documents...');
  const sampleDocTypes = await DocumentType.find().limit(3).lean();
  
  for (const vendor of createdVendors.slice(0, 3)) {
    for (const docType of sampleDocTypes) {
      const status = vendor.status === 'APPROVED' ? 'VERIFIED' : 
                     vendor.status === 'DOCUMENTS_SUBMITTED' ? 'PENDING' : 'PENDING';
      
      await findOrCreateDocument(vendor._id, docType._id, {
        vendorId: vendor._id,
        documentTypeId: docType._id,
        fileName: `${docType.name.toLowerCase().replace(/\s+/g, '_')}_${vendor.companyName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        originalName: `${docType.name} - ${vendor.companyName}.pdf`,
        fileUrl: `/uploads/${docType.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        filePath: `/uploads/${docType.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: 1024000,
        mimeType: 'application/pdf',
        uploadedBy: vendor.userId,
        status: status,
        isRequired: docType.isRequired,
      });
    }
  }
  console.log(`   Created sample documents for vendors`);

  console.log('\n📊 Seeding Activity Logs...');
  const activityTypes = [
    { type: 'VENDOR_CREATED', desc: 'Vendor registration completed' },
    { type: 'LOGIN', desc: 'User logged in' },
    { type: 'DOCUMENT_UPLOADED', desc: 'Document uploaded for review' },
    { type: 'DOCUMENT_VERIFIED', desc: 'Document verified by administrator' },
    { type: 'PROFILE_UPDATED', desc: 'Vendor profile updated' },
  ];

  for (const vendor of createdVendors) {
    for (let i = 0; i < 3; i++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      await ActivityLog.create({
        vendorId: vendor._id,
        performedBy: adminUser._id,
        activityType: activityType.type,
        description: activityType.desc,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      });
    }
  }
  console.log(`   Created activity logs for vendors`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log('   Admin: admin@vms.com / admin123');
  console.log('   Vendor: john@techcorp.com / vendor123');
  console.log('');

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
