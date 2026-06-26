import { CreateUserRequest, UpdateUserRequest } from '../../src/types/user.types';

// ─── Shared types ────────────────────────────────────────────────────────────

export type CaseType = 'positive' | 'negative';

export interface BaseCase {
  description: string;
  type: CaseType;
}

// ─── Step 1 — Create User ────────────────────────────────────────────────────

export interface CreateUserExpected {
  status: number;
  hasId?: boolean;
  hasCreatedAt?: boolean;
  nameValue?: string;
  jobValue?: string;
}

export interface CreateUserCase extends BaseCase {
  input: CreateUserRequest;
  expected: CreateUserExpected;
}

export const CREATE_USER_CASES: CreateUserCase[] = [
  {
    description: 'should return 201 with id, name, job, and createdAt for valid input',
    type: 'positive',
    input: { name: 'John Doe', job: 'QA Engineer' },
    expected: { status: 201, hasId: true, hasCreatedAt: true, nameValue: 'John Doe', jobValue: 'QA Engineer' },
  },
  {
    description: 'should return 201 and echo the correct name and job values',
    type: 'positive',
    input: { name: 'Jane Smith', job: 'Developer' },
    expected: { status: 201, hasId: true, hasCreatedAt: true, nameValue: 'Jane Smith', jobValue: 'Developer' },
  },
  {
    description: 'should return 201 but echo empty name when name is blank',
    type: 'negative',
    input: { name: '', job: 'QA Engineer' },
    expected: { status: 201, hasId: true, nameValue: '' },
  },
  {
    description: 'should return 201 but echo empty job when job is blank',
    type: 'negative',
    input: { name: 'John Doe', job: '' },
    expected: { status: 201, hasId: true, jobValue: '' },
  },
  {
    description: 'should return 201 but echo empty name and job when both are blank',
    type: 'negative',
    input: { name: '', job: '' },
    expected: { status: 201, hasId: true, nameValue: '', jobValue: '' },
  },
  {
    description: 'should return 201 but echo same name and different job values',
    type: 'negative',
    input: { name: 'John Doe', job: 'Developer' },
    expected: { status: 201, hasId: true, nameValue: 'John Doe', jobValue: 'Developer' },
  }
];

// ─── Step 2 — Get All Users Paged ────────────────────────────────────────────

export interface GetAllUsersExpected {
  status: number;
  page: number;
  dataIsEmpty: boolean;
  hasMetaFields?: boolean;
  hasUserFields?: boolean;
  hasSupport?: boolean;
}

export interface GetAllUsersCase extends BaseCase {
  page: number;
  expected: GetAllUsersExpected;
}

export const GET_ALL_USERS_CASES: GetAllUsersCase[] = [
  // ── Positive ──
  {
    description: 'should return 200 with non-empty user list on page 2',
    type: 'positive',
    page: 2,
    expected: { status: 200, page: 2, dataIsEmpty: false },
  },
  {
    description: 'should include all pagination meta fields for page 2',
    type: 'positive',
    page: 2,
    expected: { status: 200, page: 2, dataIsEmpty: false, hasMetaFields: true },
  },
  {
    description: 'should return users that each have all required fields',
    type: 'positive',
    page: 2,
    expected: { status: 200, page: 2, dataIsEmpty: false, hasUserFields: true },
  },
  {
    description: 'should include support info in the response',
    type: 'positive',
    page: 2,
    expected: { status: 200, page: 2, dataIsEmpty: false, hasSupport: true },
  },
  // ── Negative ──
  {
    description: 'should return 200 with empty data array for out-of-range page 999',
    type: 'negative',
    page: 999,
    expected: { status: 200, page: 999, dataIsEmpty: true },
  },
  {
    description: 'should still return valid pagination meta when page is out of range',
    type: 'negative',
    page: 999,
    expected: { status: 200, page: 999, dataIsEmpty: true, hasMetaFields: true },
  },
];

// ─── Step 3 — Update User ─────────────────────────────────────────────────────

export interface UpdateUserExpected {
  status: number;
  hasUpdatedAt: boolean;
  nameValue?: string;
  jobValue?: string;
}

export interface UpdateUserCase extends BaseCase {
  userId: number;
  input: UpdateUserRequest;
  expected: UpdateUserExpected;
}

export const UPDATE_USER_CASES: UpdateUserCase[] = [
  {
    description: 'should return 200 with updated name, job, and updatedAt',
    type: 'positive',
    userId: 2,
    input: { name: 'John Updated', job: 'Senior QA Engineer' },
    expected: { status: 200, hasUpdatedAt: true, nameValue: 'John Updated', jobValue: 'Senior QA Engineer' },
  },
  {
    description: 'should return 200 and valid updatedAt timestamp',
    type: 'positive',
    userId: 2,
    input: { name: 'Jane Updated', job: 'Lead Developer' },
    expected: { status: 200, hasUpdatedAt: true, nameValue: 'Jane Updated', jobValue: 'Lead Developer' },
  },
  {
    description: 'should return 200 for partial update with name only',
    type: 'negative',
    userId: 2,
    input: { name: 'Partial Name Only' },
    expected: { status: 200, hasUpdatedAt: true, nameValue: 'Partial Name Only' },
  },
  {
    description: 'should return 200 even for a non-existent user id (reqres mock)',
    type: 'negative',
    userId: 9999,
    input: { name: 'Ghost User', job: 'None' },
    expected: { status: 200, hasUpdatedAt: true },
  },
];

// ─── Step 4 — Get User By Id ──────────────────────────────────────────────────

export interface GetUserByIdExpected {
  status: number;
  userId?: number;
  hasUserFields?: boolean;
  hasSupport?: boolean;
  emptyBody?: boolean;
}

export interface GetUserByIdCase extends BaseCase {
  userId: number;
  expected: GetUserByIdExpected;
}

export const GET_USER_BY_ID_CASES: GetUserByIdCase[] = [
  // ── Positive ──
  {
    description: 'should return 200 with user data for id 2',
    type: 'positive',
    userId: 2,
    expected: { status: 200, userId: 2 },
  },
  {
    description: 'should return all required user fields with correct types',
    type: 'positive',
    userId: 2,
    expected: { status: 200, userId: 2, hasUserFields: true },
  },
  {
    description: 'should include support info in the single user response',
    type: 'positive',
    userId: 2,
    expected: { status: 200, hasSupport: true },
  },
  {
    description: 'should return 404 for non-existent user id 999',
    type: 'negative',
    userId: 999,
    expected: { status: 404, emptyBody: true },
  },
  {
    description: 'should return 404 for non-existent user id 23',
    type: 'negative',
    userId: 23,
    expected: { status: 404, emptyBody: true },
  },
];

// ─── Step 5 — Delete User ─────────────────────────────────────────────────────

export interface DeleteUserExpected {
  status: number;
  emptyBody: boolean;
}

export interface DeleteUserCase extends BaseCase {
  userId: number;
  expected: DeleteUserExpected;
}

export const DELETE_USER_CASES: DeleteUserCase[] = [
  {
    description: 'should return 204 No Content for existing user id 2',
    type: 'positive',
    userId: 2,
    expected: { status: 204, emptyBody: true },
  },
  {
    description: 'should return 204 No Content for existing user id 1',
    type: 'positive',
    userId: 1,
    expected: { status: 204, emptyBody: true },
  },
  {
    description: 'should return 204 even for non-existent user id 9999 (reqres mock)',
    type: 'negative',
    userId: 9999,
    expected: { status: 204, emptyBody: true },
  },
];
