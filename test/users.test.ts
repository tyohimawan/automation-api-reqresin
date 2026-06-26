import { expect } from 'chai';
import UserService from '../src/services/UserService';
import { UserData } from '../src/types/user.types';
import {
  CREATE_USER_CASES,
  GET_ALL_USERS_CASES,
  UPDATE_USER_CASES,
  GET_USER_BY_ID_CASES,
  DELETE_USER_CASES,
} from './testCases/user.testcases';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — splits a flat case array into positive / negative groups
// ─────────────────────────────────────────────────────────────────────────────
function splitByType<T extends { type: string }>(cases: T[]) {
  return {
    positive: cases.filter((c) => c.type === 'positive'),
    negative: cases.filter((c) => c.type === 'negative'),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

describe('Master Data Users — E2E API Test Suite (reqres.in)', () => {

  // ───────────────────────────────────────────────────────────────
  // STEP 1 — Create a New User  POST /api/users
  // ───────────────────────────────────────────────────────────────
  describe('Step 1: Create a New User  [POST /api/users]', () => {
    const { positive, negative } = splitByType(CREATE_USER_CASES);

    describe('Positive Cases', () => {
      positive.forEach(({ description, input, expected }) => {
        it(description, async () => {
          const response = await UserService.createUser(input);

          expect(response.status).to.equal(expected.status);

          if (expected.hasId) {
            expect(response.data).to.have.property('id').that.is.a('string').and.not.empty;
          }
          if (expected.hasCreatedAt) {
            expect(response.data).to.have.property('createdAt').that.is.a('string').and.not.empty;
            expect(new Date(response.data.createdAt).getTime()).to.not.be.NaN;
          }
          if (expected.nameValue !== undefined) {
            expect(response.data.name).to.equal(expected.nameValue);
          }
          if (expected.jobValue !== undefined) {
            expect(response.data.job).to.equal(expected.jobValue);
          }
        });
      });

      // Standalone — requires two parallel calls, not representable as a single case
      it('should generate a unique id for each creation request', async () => {
        const [r1, r2] = await Promise.all([
          UserService.createUser({ name: 'User A', job: 'Tester' }),
          UserService.createUser({ name: 'User B', job: 'Tester' }),
        ]);

        expect(r1.status).to.equal(201);
        expect(r2.status).to.equal(201);
        expect(r1.data.id).to.not.equal(r2.data.id);
      });
    });

    describe('Negative Cases', () => {
      negative.forEach(({ description, input, expected }) => {
        it(description, async () => {
          const response = await UserService.createUser(input);

          expect(response.status).to.equal(expected.status);

          if (expected.hasId) {
            expect(response.data).to.have.property('id').that.is.not.undefined;
          }
          if (expected.nameValue !== undefined) {
            expect(response.data.name).to.equal(expected.nameValue);
          }
          if (expected.jobValue !== undefined) {
            expect(response.data.job).to.equal(expected.jobValue);
          }
        });
      });
    });
  });

  // ───────────────────────────────────────────────────────────────
  // STEP 2 — Get All Users Paged  GET /api/users?page=2
  // ───────────────────────────────────────────────────────────────
  describe('Step 2: Get All Users Paged  [GET /api/users?page=2]', () => {
    const { positive, negative } = splitByType(GET_ALL_USERS_CASES);

    const runGetAllUsersAssertions = (
      response: Awaited<ReturnType<typeof UserService.getAllUsers>>,
      expected: (typeof GET_ALL_USERS_CASES)[number]['expected']
    ) => {
      expect(response.status).to.equal(expected.status);
      expect(response.data.page).to.equal(expected.page);

      if (expected.dataIsEmpty) {
        expect(response.data.data).to.be.an('array').that.is.empty;
      } else {
        expect(response.data.data).to.be.an('array').that.is.not.empty;
      }

      if (expected.hasMetaFields) {
        expect(response.data).to.include.all.keys('page', 'per_page', 'total', 'total_pages', 'data', 'support');
        expect(response.data.per_page).to.be.a('number').and.greaterThan(0);
        expect(response.data.total).to.be.a('number').and.greaterThan(0);
        expect(response.data.total_pages).to.be.a('number').and.greaterThan(0);
      }

      if (expected.hasUserFields) {
        response.data.data.forEach((user: UserData) => {
          expect(user).to.include.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
          expect(user.id).to.be.a('number');
          expect(user.email).to.be.a('string').that.includes('@');
          expect(user.first_name).to.be.a('string').that.is.not.empty;
          expect(user.last_name).to.be.a('string').that.is.not.empty;
          expect(user.avatar).to.be.a('string').that.is.not.empty;
        });
      }

      if (expected.hasSupport) {
        expect(response.data.support).to.have.property('url').that.is.a('string').and.not.empty;
        expect(response.data.support).to.have.property('text').that.is.a('string').and.not.empty;
      }
    };

    describe('Positive Cases', () => {
      positive.forEach(({ description, page, expected }) => {
        it(description, async () => {
          const response = await UserService.getAllUsers(page);
          runGetAllUsersAssertions(response, expected);
        });
      });
    });

    describe('Negative Cases', () => {
      negative.forEach(({ description, page, expected }) => {
        it(description, async () => {
          const response = await UserService.getAllUsers(page);
          runGetAllUsersAssertions(response, expected);
        });
      });
    });
  });

  // ───────────────────────────────────────────────────────────────
  // STEP 3 — Update User  PUT /api/users/2
  // ───────────────────────────────────────────────────────────────
  describe('Step 3: Update User  [PUT /api/users/2]', () => {
    const { positive, negative } = splitByType(UPDATE_USER_CASES);

    describe('Positive Cases', () => {
      positive.forEach(({ description, userId, input, expected }) => {
        it(description, async () => {
          const response = await UserService.updateUser(userId, input);

          expect(response.status).to.equal(expected.status);

          if (expected.hasUpdatedAt) {
            expect(response.data).to.have.property('updatedAt').that.is.a('string').and.not.empty;
            expect(new Date(response.data.updatedAt).getTime()).to.not.be.NaN;
          }
          if (expected.nameValue !== undefined) {
            expect(response.data.name).to.equal(expected.nameValue);
          }
          if (expected.jobValue !== undefined) {
            expect(response.data.job).to.equal(expected.jobValue);
          }
        });
      });
    });

    describe('Negative Cases', () => {
      negative.forEach(({ description, userId, input, expected }) => {
        it(description, async () => {
          const response = await UserService.updateUser(userId, input);

          expect(response.status).to.equal(expected.status);

          if (expected.hasUpdatedAt) {
            expect(response.data).to.have.property('updatedAt').that.is.a('string');
          }
          if (expected.nameValue !== undefined) {
            expect(response.data.name).to.equal(expected.nameValue);
          }
        });
      });
    });
  });

  // ───────────────────────────────────────────────────────────────
  // STEP 4 — View Detail Single User  GET /api/users/2
  // ───────────────────────────────────────────────────────────────
  describe('Step 4: View Detail Single User  [GET /api/users/2]', () => {
    const { positive, negative } = splitByType(GET_USER_BY_ID_CASES);

    describe('Positive Cases', () => {
      positive.forEach(({ description, userId, expected }) => {
        it(description, async () => {
          const response = await UserService.getUserById(userId);

          expect(response.status).to.equal(expected.status);

          if (expected.userId !== undefined) {
            expect(response.data).to.have.property('data');
            expect(response.data.data.id).to.equal(expected.userId);
          }
          if (expected.hasUserFields) {
            const user = response.data.data;
            expect(user).to.include.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
            expect(user.id).to.be.a('number');
            expect(user.email).to.be.a('string').that.includes('@');
            expect(user.first_name).to.be.a('string').that.is.not.empty;
            expect(user.last_name).to.be.a('string').that.is.not.empty;
            expect(user.avatar).to.be.a('string').that.is.not.empty;
          }
          if (expected.hasSupport) {
            expect(response.data).to.have.property('support');
            expect(response.data.support).to.have.property('url').that.is.a('string');
            expect(response.data.support).to.have.property('text').that.is.a('string');
          }
        });
      });
    });

    describe('Negative Cases', () => {
      negative.forEach(({ description, userId, expected }) => {
        it(description, async () => {
          const response = await UserService.getUserById(userId);

          expect(response.status).to.equal(expected.status);

          if (expected.emptyBody) {
            expect(response.data).to.deep.equal({});
          }
        });
      });
    });
  });

  // ───────────────────────────────────────────────────────────────
  // STEP 5 — Delete User  DELETE /api/users/2
  // ───────────────────────────────────────────────────────────────
  describe('Step 5: Delete User  [DELETE /api/users/2]', () => {
    const { positive, negative } = splitByType(DELETE_USER_CASES);

    describe('Positive Cases', () => {
      positive.forEach(({ description, userId, expected }) => {
        it(description, async () => {
          const response = await UserService.deleteUser(userId);

          expect(response.status).to.equal(expected.status);

          if (expected.emptyBody) {
            expect(response.data).to.equal('');
          }
        });
      });
    });

    describe('Negative Cases', () => {
      negative.forEach(({ description, userId, expected }) => {
        it(description, async () => {
          const response = await UserService.deleteUser(userId);

          expect(response.status).to.equal(expected.status);

          if (expected.emptyBody) {
            expect(response.data).to.equal('');
          }
        });
      });
    });
  });

});
