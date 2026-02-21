/**
 * Proposal API Unit Tests
 */

jest.mock('@/lib/db/models/Proposal', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(() => ({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    })),
    countDocuments: jest.fn().mockResolvedValue(10),
  },
}));

jest.mock('@/lib/db/models/User', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

jest.mock('@/lib/db/connect', () => jest.fn());
jest.mock('@/lib/auth/guards', () => ({
  adminGuard: jest.fn(),
  vendorGuard: jest.fn(),
  authGuard: jest.fn(),
}));

import { adminGuard } from '@/lib/auth/guards';
import Proposal from '@/lib/db/models/Proposal';
import { POST } from '../route';
import { NextResponse } from 'next/server';

describe('POST /api/admin/proposals (Create)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock behavior
    (adminGuard as jest.Mock).mockResolvedValue({ authorized: false, user: null });
  });

  it('should return 401 for non-admin request', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({ authorized: false, user: null });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'A'.repeat(50), // minimum 50 characters
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: ['Requirement 1'],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should return 400 for missing title', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: '',
        description: 'A'.repeat(50),
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: ['Requirement 1'],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
    expect(data.errors).toHaveProperty('title');
  });

  it('should return 400 for short description', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'Short',
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: ['Requirement 1'],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
    expect(data.errors).toHaveProperty('description');
  });

  it('should return 400 for budgetMax < budgetMin', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'A'.repeat(50),
        category: 'IT_SERVICES',
        budgetMin: 10000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: ['Requirement 1'],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
    expect(data.errors).toHaveProperty('budgetMax');
  });

  it('should return 400 for past deadline', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'A'.repeat(50),
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2020-01-01',
        requirements: ['Requirement 1'],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
    expect(data.errors).toHaveProperty('deadline');
  });

  it('should return 400 for empty requirements', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'A'.repeat(50),
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: [],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation error');
    expect(data.errors).toHaveProperty('requirements');
  });

  it('should successfully create proposal with valid data', async () => {
    (adminGuard as jest.Mock).mockResolvedValue({
      authorized: true,
      user: { id: '507f1f77bcf86cd799439011' },
    });

    (Proposal.create as jest.Mock).mockResolvedValue({
      _id: '507f191e810c19729de860ea',
      title: 'Test Proposal',
      description: 'A'.repeat(50),
      category: 'IT_SERVICES',
      budgetMin: 1000,
      budgetMax: 5000,
      deadline: new Date('2027-12-31'),
      requirements: ['Requirement 1'],
      status: 'DRAFT',
      createdBy: '507f1f77bcf86cd799439011',
      toJSON: function () {
        const { toJSON, ...rest } = this as any;
        return rest;
      },
    });

    const request = new Request('http://localhost:3000/api/admin/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Proposal',
        description: 'A'.repeat(50),
        category: 'IT_SERVICES',
        budgetMin: 1000,
        budgetMax: 5000,
        deadline: '2027-12-31',
        requirements: ['Requirement 1'],
        status: 'OPEN',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();
    if (response.status === 500) {
      console.log('500_ERROR_DATA:', JSON.stringify(data, null, 2));
    }
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.proposal).toHaveProperty('title', 'Test Proposal');
    expect(data.data.proposal).toHaveProperty('status', 'DRAFT');
  });
});
