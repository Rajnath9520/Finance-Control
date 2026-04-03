
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Control API',
      version: '1.0.0',
      description: `

A secure, multi-user financial records management API with role-based access control.

### Authentication
This API uses **JWT Bearer tokens** for authentication.

1. Register via **POST /auth/register** or login via **POST /auth/login**

2. Copy the \`accessToken\` from the response

3. Click **Authorize** at the top and enter: \`Bearer <your_access_token>\`

4. The \`refreshToken\` is handled automatically via HTTP-only cookie

### Roles & Permissions

| Role | Dashboard | View Records | Manage Records | User Management |
|------|:---------:|:------------:|:--------------:|:---------------:|
| \`viewer\` | Yes | No | No | No |
| \`analyst\` | Yes | Yes | No | No |
| \`admin\` | Yes | Yes | Yes | Yes |

### Data Isolation
Every financial record is scoped to its creator via \`createdBy\`. All queries are filtered by \`userId\` — users never access each other's data.

### Error Format
\`\`\`json
{
  "success": false,
  "message": "Human-readable description",
  "errorCode": "MACHINE_READABLE_CODE",
  "details": [{ "field": "e.g:email", "message": "Invalid email" }]
}
\`\`\`
      `
    },
    servers: [
      { url: '/api', description: 'Local development' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from POST /auth/login. Expires in 15 minutes.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:        { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            name:      { type: 'string', example: 'Jane Doe' },
            email:     { type: 'string', format: 'email', example: 'test@example.com' },
            role:      { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'analyst' },
            isActive:  { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Record: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
            amount:    { type: 'number', format: 'float', example: 1500.00 },
            type:      { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category:  { type: 'string', example: 'Salary' },
            date:      { type: 'string', format: 'date-time', example: '2024-06-01T00:00:00.000Z' },
            note:      { type: 'string', example: 'June monthly salary' },
            createdBy: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total:       { type: 'integer', example: 42 },
            totalPages:  { type: 'integer', example: 5 },
            currentPage: { type: 'integer', example: 1 },
            limit:       { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalIncome:       { type: 'number', example: 15000.00 },
                totalExpenses:     { type: 'number', example: 8200.00 },
                netBalance:        { type: 'number', example: 6800.00 },
                totalIncomeCount:  { type: 'integer', example: 12 },
                totalExpenseCount: { type: 'integer', example: 34 },
              },
            },
            categoryBreakdown: {
              type: 'object',
              properties: {
                income: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      category: { type: 'string', example: 'Salary' },
                      total:    { type: 'number', example: 12000.00 },
                      count:    { type: 'integer', example: 6 },
                    },
                  },
                },
                expense: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      category: { type: 'string', example: 'Rent' },
                      total:    { type: 'number', example: 4200.00 },
                      count:    { type: 'integer', example: 6 },
                    },
                  },
                },
              },
            },
            monthlyTrends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  year:    { type: 'integer', example: 2024 },
                  month:   { type: 'integer', example: 6 },
                  income:  { type: 'number', example: 3000.00 },
                  expense: { type: 'number', example: 1400.00 },
                  net:     { type: 'number', example: 1600.00 },
                },
              },
            },
            recentTransactions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Record' },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success:   { type: 'boolean', example: false },
            message:   { type: 'string', example: 'Validation failed' },
            errorCode: {
              type: 'string',
              enum: [
                'VALIDATION_ERROR','UNAUTHORIZED','FORBIDDEN','NOT_FOUND',
                'CONFLICT','INTERNAL_ERROR','TOKEN_EXPIRED','INVALID_TOKEN',
                'INVALID_CREDENTIALS','USER_EXISTS',
              ],
              example: 'VALIDATION_ERROR',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field:   { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Please provide a valid email address' },
                },
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful.' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing or invalid access token',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Authentication required. Please log in.', errorCode: 'UNAUTHORIZED' } } },
        },
        Forbidden: {
          description: 'Insufficient role permissions',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Access denied. Required roles: admin. Your role: viewer', errorCode: 'FORBIDDEN' } } },
        },
        NotFound: {
          description: 'Resource not found',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Record not found or access denied.', errorCode: 'NOT_FOUND' } } },
        },
        ValidationError: {
          description: 'Request validation failed',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Validation failed', errorCode: 'VALIDATION_ERROR', details: [{ field: 'email', message: 'Please provide a valid email address' }] } } },
        },
      },
      parameters: {
        RecordId: { name: 'id', in: 'path', required: true, schema: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' }, description: 'MongoDB ObjectId of the record' },
        UserId:   { name: 'id', in: 'path', required: true, schema: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' }, description: 'MongoDB ObjectId of the user' },
      },
    },
    tags: [
      { name: 'Auth',      description: 'Register, login, logout, token refresh' },
      { name: 'Records',   description: 'Financial records — CRUD with filtering, sorting, pagination' },
      { name: 'Dashboard', description: 'Analytics — summary stats, trends, category breakdown' },
      { name: 'Users',     description: 'User management (admin only)' },
    ],
    security: [{ BearerAuth: [] }],
    paths: {
      //  AUTH

      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Creates a new user account. Role defaults to `viewer` if not specified. Password must contain ≥1 uppercase, ≥1 lowercase, ≥1 digit.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name:     { type: 'string', minLength: 2, maxLength: 50, example: 'Jane Doe' },
                    email:    { type: 'string', format: 'email', example: 'test@example.com' },
                    password: { type: 'string', minLength: 8, example: 'SecurePass1' },
                    role:     { type: 'string', enum: ['viewer', 'analyst', 'admin'], default: 'viewer', example: 'analyst' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } }] },
                  example: { success: true, message: 'Account created successfully.', user: { id: '665f1a2b3c4d5e6f7a8b9c0d', name: 'Jane Doe', email: 'test@example.com', role: 'analyst' } },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            409: {
              description: 'Email already registered',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'An account with this email already exists.', errorCode: 'USER_EXISTS' } } },
            },
          },
        },
      },

      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive tokens',
          description: 'Authenticates credentials. Returns `accessToken` in the body. Sets `refreshToken` as an HTTP-only cookie scoped to `/api/auth`.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email:    { type: 'string', format: 'email', example: 'test@example.com' },
                    password: { type: 'string', example: 'SecurePass1' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              headers: { 'Set-Cookie': { schema: { type: 'string' }, description: 'HTTP-only refresh token cookie (Path=/api/auth; HttpOnly; SameSite=Strict)' } },
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { accessToken: { type: 'string' }, user: { $ref: '#/components/schemas/User' } } }] },
                  example: { success: true, message: 'Logged in successfully.', accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', user: { id: '665f1a2b3c4d5e6f7a8b9c0d', name: 'Jane Doe', email: 'test@example.com', role: 'analyst' } },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: {
              description: 'Invalid credentials',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Invalid email or password.', errorCode: 'INVALID_CREDENTIALS' } } },
            },
          },
        },
      },

      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh the access token',
          description: 'Issues a new access token using the `refreshToken` HTTP-only cookie. Rotates the token on every call (new cookie set). Detects token reuse — if a refresh token is used twice, the stored hash is cleared and re-login is forced.',
          security: [],
          responses: {
            200: {
              description: 'Token refreshed and rotated',
              headers: { 'Set-Cookie': { schema: { type: 'string' }, description: 'New rotated refresh token cookie' } },
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } }] },
                  example: { success: true, message: 'Token refreshed successfully.', accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                },
              },
            },
            401: {
              description: 'Invalid, expired, or reused refresh token',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, message: 'Refresh token expired. Please log in again.', errorCode: 'TOKEN_EXPIRED' } } },
            },
          },
        },
      },

      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout current user',
          description: 'Invalidates the server-side refresh token hash and clears the cookie. The client should also discard the access token from memory.',
          responses: {
            200: {
              description: 'Logged out successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' }, example: { success: true, message: 'Logged out successfully.' } } },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // RECORDS 
      '/records': {
        get: {
          tags: ['Records'],
          summary: 'List financial records',
          description: 'Returns a paginated, filtered, and sorted list of financial records for the authenticated user. Requires `analyst` or `admin` role.',
          parameters: [
            { name: 'page',      in: 'query', schema: { type: 'integer', minimum: 1, default: 1 },              description: 'Page number' },
            { name: 'limit',     in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }, description: 'Records per page (max 100)' },
            { name: 'type',      in: 'query', schema: { type: 'string', enum: ['income', 'expense'] },           description: 'Filter by transaction type' },
            { name: 'category',  in: 'query', schema: { type: 'string' },                                        description: 'Filter by category (case-insensitive partial match)' },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' },                        description: 'Start of date range (ISO 8601)', example: '2024-01-01' },
            { name: 'endDate',   in: 'query', schema: { type: 'string', format: 'date' },                        description: 'End of date range (ISO 8601)', example: '2024-12-31' },
            { name: 'search',    in: 'query', schema: { type: 'string' },                                        description: 'Full-text search on the `note` field' },
            { name: 'sortBy',    in: 'query', schema: { type: 'string', enum: ['date', 'amount'], default: 'date' }, description: 'Field to sort by' },
            { name: 'order',     in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },    description: 'Sort direction' },
          ],
          responses: {
            200: {
              description: 'Records retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      { type: 'object', properties: { records: { type: 'array', items: { $ref: '#/components/schemas/Record' } }, pagination: { $ref: '#/components/schemas/Pagination' } } },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Records retrieved successfully.',
                    records: [{ _id: '665f1a2b3c4d5e6f7a8b9c0e', amount: 1500, type: 'income', category: 'Salary', date: '2024-06-01T00:00:00.000Z', note: 'June salary', createdBy: '665f1a2b3c4d5e6f7a8b9c0d', isDeleted: false }],
                    pagination: { total: 42, totalPages: 5, currentPage: 1, limit: 10, hasNextPage: true, hasPrevPage: false },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
        post: {
          tags: ['Records'],
          summary: 'Create a financial record',
          description: 'Creates a new financial record scoped to the authenticated user. Requires `admin` role.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'type', 'category'],
                  properties: {
                    amount:   { type: 'number', minimum: 0.01, example: 1500.00 },
                    type:     { type: 'string', enum: ['income', 'expense'], example: 'income' },
                    category: { type: 'string', maxLength: 50, example: 'Salary' },
                    date:     { type: 'string', format: 'date', default: 'today', example: '2024-06-01' },
                    note:     { type: 'string', maxLength: 500, example: 'June monthly salary' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Record created',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { record: { $ref: '#/components/schemas/Record' } } }] },
                  example: { success: true, message: 'Record created successfully.', record: { _id: '665f1a2b3c4d5e6f7a8b9c0e', amount: 1500, type: 'income', category: 'Salary', date: '2024-06-01T00:00:00.000Z', note: 'June salary', createdBy: '665f1a2b3c4d5e6f7a8b9c0d', isDeleted: false } },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },

      '/records/{id}': {
        patch: {
          tags: ['Records'],
          summary: 'Update a financial record',
          description: 'Partially updates a record. Only provided fields are changed. Ownership is enforced — users can only update their own records. Requires `admin` role.',
          parameters: [{ $ref: '#/components/parameters/RecordId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  minProperties: 1,
                  properties: {
                    amount:   { type: 'number', minimum: 0.01, example: 2000.00 },
                    type:     { type: 'string', enum: ['income', 'expense'] },
                    category: { type: 'string', maxLength: 50, example: 'Freelance' },
                    date:     { type: 'string', format: 'date', example: '2024-06-15' },
                    note:     { type: 'string', maxLength: 500, example: 'Updated note' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Record updated',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { record: { $ref: '#/components/schemas/Record' } } }] },
                  example: { success: true, message: 'Record updated successfully.', record: { _id: '665f1a2b3c4d5e6f7a8b9c0e', amount: 2000, type: 'income', category: 'Freelance' } },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['Records'],
          summary: 'Soft-delete a financial record',
          description: 'Marks the record as `isDeleted: true`. The record is excluded from all future queries but retained in the database for auditing. Ownership is enforced. Requires `admin` role.',
          parameters: [{ $ref: '#/components/parameters/RecordId' }],
          responses: {
            200: {
              description: 'Record deleted',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' }, example: { success: true, message: 'Record deleted successfully.' } } },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },


      // DASHBOARD 
      '/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get financial analytics summary',
          description: 'Returns a comprehensive financial overview for the authenticated user. All data is strictly scoped to the current user. Accessible by all roles (viewer, analyst, admin). Uses MongoDB aggregation pipelines for efficiency.',
          responses: {
            200: {
              description: 'Summary retrieved',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { data: { $ref: '#/components/schemas/DashboardSummary' } } }] },
                  example: {
                    success: true,
                    message: 'Dashboard summary retrieved successfully.',
                    data: {
                      summary: { totalIncome: 15000, totalExpenses: 8200, netBalance: 6800, totalIncomeCount: 12, totalExpenseCount: 34 },
                      categoryBreakdown: {
                        income:  [{ category: 'Salary', total: 12000, count: 6 }, { category: 'Freelance', total: 3000, count: 6 }],
                        expense: [{ category: 'Rent', total: 4200, count: 6 }, { category: 'Utilities', total: 1200, count: 12 }],
                      },
                      monthlyTrends: [
                        { year: 2024, month: 4, income: 2500, expense: 1400, net: 1100 },
                        { year: 2024, month: 5, income: 3000, expense: 1600, net: 1400 },
                        { year: 2024, month: 6, income: 2800, expense: 1200, net: 1600 },
                      ],
                      recentTransactions: [{ _id: '665f1a2b3c4d5e6f7a8b9c0e', amount: 1500, type: 'income', category: 'Salary', date: '2024-06-01T00:00:00.000Z', note: 'June salary' }],
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },

      //  USERS
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'List all users',
          description: 'Returns all registered users. Sensitive fields (password hash, refresh token hash) are excluded. Requires `admin` role.',
          responses: {
            200: {
              description: 'Users retrieved',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { users: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }] },
                  example: {
                    success: true,
                    message: 'Users retrieved successfully.',
                    users: [
                      { id: '665f1a2b3c4d5e6f7a8b9c0d', name: 'Jane Doe',   email: 'test@example.com',  role: 'analyst', isActive: true, createdAt: '2024-06-01T10:00:00.000Z' },
                      { id: '665f1a2b3c4d5e6f7a8b9c0f', name: 'Admin User', email: 'admin@example.com', role: 'admin',   isActive: true, createdAt: '2024-05-15T08:30:00.000Z' },
                    ],
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },

      '/users/{id}': {
        patch: {
          tags: ['Users'],
          summary: 'Update user role or active status',
          description: 'Updates a user\'s `role` and/or `isActive` status. At least one field required. Requires `admin` role.',
          parameters: [{ $ref: '#/components/parameters/UserId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  minProperties: 1,
                  properties: {
                    role:     { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'analyst' },
                    isActive: { type: 'boolean', example: false },
                  },
                },
                examples: {
                  promote:    { summary: 'Promote to analyst', value: { role: 'analyst' } },
                  deactivate: { summary: 'Deactivate account', value: { isActive: false } },
                  both:       { summary: 'Downgrade and deactivate', value: { role: 'viewer', isActive: false } },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User updated',
              content: {
                'application/json': {
                  schema: { allOf: [{ $ref: '#/components/schemas/SuccessResponse' }, { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } }] },
                  example: { success: true, message: 'User updated successfully.', user: { id: '665f1a2b3c4d5e6f7a8b9c0d', name: 'Jane Doe', email: 'test@example.com', role: 'analyst', isActive: true } },
                },
              },
            },
            400: { $ref: '#/components/responses/ValidationError' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },
    },
  },
  apis: [],
};

 const swaggerSpec = swaggerJSDoc(options);

 export {swaggerSpec};
