import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill Web APIs for Next.js API routes
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Request class for Next.js API routes
class MockRequest {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Headers(options.headers)
    this.body = options.body
    this.json = async () => JSON.parse(this.body)
    this.text = async () => this.body
    this.formData = async () => this._formData
  }

  get _formData() {
    return this._formDataValue
  }

  set _formData(value) {
    this._formDataValue = value
  }
}

global.Request = MockRequest

// Mock Response class for Next.js API routes
class MockResponse {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.headers = new Headers(init.headers)
    this._jsonBody = body
  }

  static json(data, init = {}) {
    return new MockResponse(data, { ...init, status: init.status || 200 })
  }

  async json() {
    return this._jsonBody
  }
}

global.Response = MockResponse

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/vms-test'
process.env.JWT_ACCESS_SECRET = 'test-secret-key-for-access-token-min-32-chars'
process.env.JWT_REFRESH_SECRET = 'test-secret-key-for-refresh-token-min-32-chars'
process.env.RESEND_API_KEY = 're_test_key'
process.env.RESEND_FROM_EMAIL = 'noreply@test.dev'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Next.js images
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: class extends MockRequest {},
  NextResponse: {
    json: jest.fn((data, init = {}) => {
      const response = MockResponse.json(data, init);
      response.cookies = {
        set: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
      };
      return response;
    }),
  },
}));

// Mock heavy dependencies before they get loaded
jest.mock('@/lib/db/connect', () => ({
  dbConnect: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/lib/cloudinary/config', () => ({
  uploadBuffer: jest.fn(),
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));

// Mock middleware
jest.mock('@/lib/middleware/errorHandler', () => ({
  handleApiError: jest.fn((error) => {
    const { NextResponse } = require('next/server');
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        errors: error.flatten?.()?.fieldErrors || {},
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }),
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnauthorizedError';
    }
  },
  ForbiddenError: class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ForbiddenError';
    }
  },
}));

jest.mock('@/lib/middleware/rateLimit', () => ({
  withRateLimit: jest.fn(() => Promise.resolve(null)),
  loginRateLimiter: {},
  apiRateLimiter: {},
}));

// Mock Resend email service
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(() => Promise.resolve({ data: 'mocked', error: null })),
    },
  })),
}));

jest.mock('mongoose', () => {
  const ObjectId = class ObjectId {
    constructor(id) { this.id = id; }
    toString() { return this.id || '507f1f77bcf86cd799439011'; }
  };

  const Schema = class Schema {
    constructor(obj) {
      this.obj = obj;
      this.methods = {};
    }
    static Types = { ObjectId };
    index() { return this; }
    virtual() {
      return {
        get: () => this,
        set: () => this,
      };
    }
    pre() { return this; }
    post() { return this; }
  };
  Schema.Types = { ObjectId };

  const mockModels = {};

  return {
    connect: jest.fn(() => Promise.resolve({
      connection: { readyState: 1 },
    })),
    disconnect: jest.fn(() => Promise.resolve()),
    Schema,
    model: jest.fn((name, schema) => {
      // Return a model-like object with common methods
      return {
        findOne: jest.fn(() => Promise.resolve(null)),
        find: jest.fn(() => Promise.resolve([])),
        create: jest.fn(() => Promise.resolve({})),
        save: jest.fn(() => Promise.resolve({})),
        populate: jest.fn(() => ({ lean: jest.fn(() => Promise.resolve([])) })),
        lean: jest.fn(() => Promise.resolve([])),
        select: jest.fn(() => ({
          findOne: jest.fn(() => Promise.resolve(null)),
        })),
        ...mockModels[name],
      };
    }),
    models: mockModels,  // Shared models object
    Types: { ObjectId },
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => 'LayoutDashboard',
  Users: () => 'Users',
  UserPlus: () => 'UserPlus',
  FileText: () => 'FileText',
  LogOut: () => 'LogOut',
  Eye: () => 'Eye',
  Search: () => 'Search',
  Filter: () => 'Filter',
  ChevronLeft: () => 'ChevronLeft',
  ChevronRight: () => 'ChevronRight',
  User: () => 'User',
  Award: () => 'Award',
  Clock: () => 'Clock',
  CheckCircle: () => 'CheckCircle',
  AlertCircle: () => 'AlertCircle',
  Upload: () => 'Upload',
  Trash2: () => 'Trash2',
  XCircle: () => 'XCircle',
  Download: () => 'Download',
  Calendar: () => 'Calendar',
}))

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
