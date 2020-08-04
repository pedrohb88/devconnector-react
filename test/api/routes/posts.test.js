const request = require('supertest');
const app = require('../../../server');

describe('GET /posts', () => {

    it('should return 401 status for no authorization token request on private route', (done) => {
        request(app)
            .get('/api/posts')
            .expect(401)
            .end(done);
    });
});