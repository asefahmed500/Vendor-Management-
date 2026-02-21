import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';
import Vendor from '../lib/db/models/Vendor';
import Document from '../lib/db/models/Document';
import DocumentType from '../lib/db/models/DocumentType';
import ActivityLog from '../lib/db/models/ActivityLog';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';

// More fake vendors with diverse data
const fakeVendors = [
  {
    email: 'summit-tech@vms.com',
    password: 'Vendor@123',
    companyName: 'Summit Technologies LLC',
    contactPerson: 'Michael Chen',
    phone: '+1-555-0201',
    address: {
      street: '100 Innovation Drive',
      city: 'San Jose',
      state: 'CA',
      country: 'USA',
      postalCode: '95134',
    },
    companyType: 'LLC',
    taxId: '77-1234567',
    status: 'APPROVED',
  },
  {
    email: 'green-earth@vms.com',
    password: 'Vendor@123',
    companyName: 'Green Earth Solutions',
    contactPerson: 'Sarah Williams',
    phone: '+1-555-0202',
    address: {
      street: '250 Eco Way',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      postalCode: '97201',
    },
    companyType: 'Corporation',
    taxId: '93-4567890',
    status: 'UNDER_REVIEW',
  },
  {
    email: 'premier-logistics@vms.com',
    password: 'Vendor@123',
    companyName: 'Premier Logistics Group',
    contactPerson: 'David Martinez',
    phone: '+1-555-0203',
    address: {
      street: '500 Transport Blvd',
      city: 'Dallas',
      state: 'TX',
      country: 'USA',
      postalCode: '75201',
    },
    companyType: 'Partnership',
    taxId: '21-8901234',
    status: 'DOCUMENTS_SUBMITTED',
  },
  {
    email: 'stellar-services@vms.com',
    password: 'Vendor@123',
    companyName: 'Stellar Services Inc',
    contactPerson: 'Emily Johnson',
    phone: '+1-555-0204',
    address: {
      street: '75 Starlight Avenue',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      postalCode: '98101',
    },
    companyType: 'Corporation',
    taxId: '56-2345678',
    status: 'APPROVED',
  },
  {
    email: 'quantum-builders@vms.com',
    password: 'Vendor@123',
    companyName: 'Quantum Builders & Contractors',
    contactPerson: 'Robert Taylor',
    phone: '+1-555-0205',
    address: {
      street: '900 Construction Lane',
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      postalCode: '80202',
    },
    companyType: 'LLC',
    taxId: '84-3456789',
    status: 'PENDING',
  },
];

async function addFakeVendors() {
  try {
    console.log('🌱 Adding fake vendors...\n');
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get document types
    const docTypes = await DocumentType.find();

    for (const vendorData of fakeVendors) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: vendorData.email });
      if (existingUser) {
        console.log(`⏭️  Skipping ${vendorData.email} - already exists`);
        continue;
      }

      // Create user
      const user = new User({
        email: vendorData.email,
        password: vendorData.password,
        role: 'VENDOR',
        isActive: true,
        loginAttempts: 0,
      });
      await user.save();
      console.log(`   ✅ Created user: ${vendorData.email}`);

      // Create vendor
      const { password, email, ...vendorInfo } = vendorData;
      const vendor = await Vendor.create({
        userId: user._id,
        certificateNumber: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email,
        ...vendorInfo,
      });
      console.log(`   ✅ Created vendor: ${vendorData.companyName} (${vendorData.status})`);

      // Add some documents
      const numDocs = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numDocs; i++) {
        const docType = docTypes[Math.floor(Math.random() * docTypes.length)];
        const status = ['PENDING', 'VERIFIED', 'REJECTED'][Math.floor(Math.random() * 3)];

        const document = await Document.create({
          vendorId: vendor._id,
          documentTypeId: docType._id,
          fileName: `${docType.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
          originalName: `${docType.name}.pdf`,
          fileUrl: `https://example.com/documents/${vendor._id}/${docType.name}.pdf`,
          filePath: `/documents/${vendor._id}/${docType.name}.pdf`,
          fileSize: 1024000 + Math.floor(Math.random() * 5000000),
          mimeType: 'application/pdf',
          uploadedBy: user._id,
          status,
        });

        // Add verification for non-pending documents
        if (status !== 'PENDING') {
          const admin = await User.findOne({ role: 'ADMIN' });
          if (admin) {
            const DocumentVerification = (await import('../lib/db/models/DocumentVerification')).default;
            await DocumentVerification.create({
              documentId: document._id,
              verifiedBy: admin._id,
              status,
              comments: status === 'VERIFIED' ? 'Document verified' : 'Please resubmit',
              verifiedAt: new Date(),
            });
          }
        }
      }
      console.log(`   ✅ Added ${numDocs} documents for ${vendorData.companyName}`);

      // Add activity logs
      await ActivityLog.create({
        vendorId: vendor._id,
        performedBy: user._id,
        activityType: 'VENDOR_CREATED',
        description: `${vendorData.companyName} registered as a new vendor`,
      });
      console.log(`   ✅ Created activity logs\n`);
    }

    // Get total count
    const totalVendors = await Vendor.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'VENDOR' });
    const totalDocuments = await Document.countDocuments();

    console.log('\n✨ Fake vendors added successfully!\n');
    console.log('📊 Current Database Stats:');
    console.log(`   Total Vendors: ${totalVendors}`);
    console.log(`   Total Vendor Users: ${totalUsers}`);
    console.log(`   Total Documents: ${totalDocuments}`);

    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error adding fake vendors:', error);
    process.exit(1);
  }
}

addFakeVendors();
