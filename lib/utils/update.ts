/**
 * Safe update utilities to prevent mass assignment vulnerabilities
 */

import { IVendor } from '@/lib/types/vendor';
import { IProposal } from '@/lib/types/proposal';
import { IProposalSubmission } from '@/lib/types/proposal';

/**
 * Allowed fields for vendor profile updates by the vendor themselves
 */
const VENDOR_SELF_UPDATE_FIELDS = new Set([
  'phone',
  'address',
  'companyType',
  'taxId',
]);

/**
 * Allowed fields for vendor profile updates by admin
 */
const VENDOR_ADMIN_UPDATE_FIELDS = new Set([
  'companyName',
  'contactPerson',
  'phone',
  'address',
  'companyType',
  'taxId',
  'status',
  'rejectionReason',
]);

/**
 * Allowed fields for proposal updates by admin
 */
const PROPOSAL_UPDATE_FIELDS = new Set([
  'title',
  'description',
  'category',
  'budgetMin',
  'budgetMax',
  'deadline',
  'requirements',
  'status',
]);

/**
 * Allowed fields for proposal submission updates by vendor
 */
const SUBMISSION_UPDATE_FIELDS = new Set([
  'proposedAmount',
  'timeline',
  'description',
  'approach',
  'status',
]);

/**
 * Safely updates an object with only allowed fields
 *
 * @param target - The target object to update
 * @param source - The source data to apply
 * @param allowedFields - Set of allowed field names
 * @returns The updated target object
 */
export function safeUpdate<T extends object>(
  target: T,
  source: Partial<Record<string, unknown>>,
  allowedFields: Set<string>
): T {
  for (const key of Object.keys(source)) {
    if (allowedFields.has(key)) {
      (target as Record<string, unknown>)[key] = source[key];
    }
  }
  return target;
}

/**
 * Safely updates vendor profile (vendor self-update)
 */
export function safeVendorSelfUpdate(
  vendor: object,
  data: Record<string, unknown>
): object {
  return safeUpdate(vendor, data, VENDOR_SELF_UPDATE_FIELDS);
}

/**
 * Safely updates vendor profile (admin update)
 */
export function safeVendorAdminUpdate(
  vendor: object,
  data: Record<string, unknown>
): object {
  return safeUpdate(vendor, data, VENDOR_ADMIN_UPDATE_FIELDS);
}

/**
 * Safely updates proposal
 */
export function safeProposalUpdate(
  proposal: object,
  data: Record<string, unknown>
): object {
  return safeUpdate(proposal, data, PROPOSAL_UPDATE_FIELDS);
}

/**
 * Safely updates proposal submission
 */
export function safeSubmissionUpdate(
  submission: object,
  data: Record<string, unknown>
): object {
  return safeUpdate(submission, data, SUBMISSION_UPDATE_FIELDS);
}

/**
 * Creates a whitelist update helper
 *
 * @param allowedFields - Array of allowed field names
 * @returns A function that safely updates objects
 */
export function createWhitelistedUpdate<T extends object>(
  allowedFields: string[]
): (target: T, source: Partial<Record<string, unknown>>) => T {
  const fieldSet = new Set(allowedFields);
  return (target: T, source: Partial<Record<string, unknown>>) => {
    return safeUpdate(target, source, fieldSet);
  };
}
