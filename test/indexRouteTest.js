const expect  = require('chai').expect,
      request = require('request');

const app = require('../app');

it('Check if /index route returns 200OK response', (done) => {
    request('http://localhost:3000/index', (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        done();
    });
});


it('Check if /index/about route returns 4xx response', (done) => {
    request('http://localhost:3000/index/about', (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        done();
    });
});
