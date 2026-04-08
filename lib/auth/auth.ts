import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import Vendor from "@/lib/db/models/Vendor";
import ActivityLog from "@/lib/db/models/ActivityLog";
import { generateCertificateNumber } from "@/lib/utils/certificate";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
            const { sendEmail, PasswordResetEmail } = await import("@/lib/email");
            const emailTemplate = PasswordResetEmail({
                recipientName: user.name || user.email,
                resetUrl: url,
            });
            await sendEmail({
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
            });
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "VENDOR",
            },
            vendorProfile: {
                type: "string",
                required: false,
            },
            isActive: {
                type: "boolean",
                defaultValue: true,
            },
            // Registration specific fields (stored on user for hooks to access)
            companyName: { type: "string", required: false },
            contactPerson: { type: "string", required: false },
            phone: { type: "string", required: false },
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // If the user is a VENDOR and has registration data, create a vendor profile
                    if (user.role === 'VENDOR' && user.companyName) {
                        try {
                            const certificateNumber = generateCertificateNumber();
                            const vendor = await Vendor.create({
                                userId: user.id,
                                companyName: user.companyName,
                                contactPerson: user.contactPerson || user.name,
                                phone: user.phone || '',
                                status: 'PENDING',
                                certificateNumber,
                                registrationDate: new Date(),
                            });

                            // Log the registration activity
                            await ActivityLog.create({
                                vendorId: vendor._id,
                                performedBy: user.id,
                                activityType: 'VENDOR_CREATED',
                                description: `New vendor registration submitted for ${user.companyName}`,
                                metadata: {
                                    companyName: user.companyName,
                                    email: user.email,
                                },
                            });

                            // Notify Admin about new registration
                            try {
                                const { createNotification } = await import('@/lib/notifications/service');
                                const User = (await import('@/lib/db/models/User')).default;
                                const admin = await User.findOne({ role: 'ADMIN' });
                                
                                if (admin) {
                                    await createNotification({
                                        userId: admin._id.toString(),
                                        type: 'STATUS_CHANGED', // or a more specific type if added
                                        title: 'New Vendor Registration',
                                        message: `A new vendor "${user.companyName}" has registered and is awaiting approval.`,
                                        link: `/admin/vendors`,
                                        metadata: { vendorId: vendor._id.toString() }
                                    });
                                }
                            } catch (notifError) {
                                console.error('Failed to notify admin of registration:', notifError);
                            }
                        } catch (error) {
                            console.error('Failed to create vendor profile in hook:', error);
                        }
                    }
                }
            }
        }
    },
    // Better Auth handles sessions in the database by default with the MongoDB adapter
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    }
});
