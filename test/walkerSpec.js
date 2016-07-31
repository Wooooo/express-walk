const
    expect          = require('chai').expect,
    express         = require('express'),
    path            = require('path'),
    walk            = require('../index'),
    mocha           = require('mocha'),
    coMocha         = require('co-mocha'),
    supertest       = require('supertest-as-promised');

coMocha(mocha);

describe('#Express Walk', () => {
    var app, agent;

    beforeEach(() => {
        app = express();
        agent = supertest.agent(app);
    });

    describe('if empty directory \'case1\' is given,', () => {
        it('should perform walk and return empty list.', () => {
            var routes = walk(app)(path.join(__dirname, './cases/case1'));

            expect(routes).to.have.length(0);
        });
    });

    describe('if directory with diverse versions \'case2\' is given', () => {
        it('should perform walk and return url list.', function*() {
            var routes = walk(app)(path.join(__dirname, './cases/case2'));

            expect(routes).to.have.length(5);

            for(var i = 0 ; i < routes.length ; i++) {
                var method = routes[i].split(' ')[0];
                var url    = routes[i].split(' ')[1];

                yield agent[method.toLowerCase()](url)
                    .expect(200);
            }
        });
    });

    describe('if directory \'case3\' having param directory is given,', () => {
        it('should perform walk and return url list.', function*() {
            var routes = walk(app)(path.join(__dirname, './cases/case3'));

            expect(routes).to.have.length(4);

            var requests = [
                'GET /api/users/1000',
                'GET /api/users/woooo',
                'GET /api/users',
                'GET /api/users/1000/company'
            ];

            for(var i = 0 ; i < requests.length ; i++) {
                var method  = requests[i].split(' ')[0];
                var url     = requests[i].split(' ')[1];

                yield agent[method.toLowerCase()](url)
                    .expect(200);
            }

            var url = '/api/users/1000/company/naver';

            var resp = yield agent.get(url).expect(200);

            expect(resp.body).to.deep.equal({userId: '1000', companyId: 'naver'});
        });
    });

    describe('if directory having preservePrefix is given,', () => {
        it('should perform walk and return url list.', function*() {
            var routes = walk(app)(path.join(__dirname, './cases/case4'));

            expect(routes).to.have.length(3);

            var requests = [
                'PUT /api/companies',
                'GET /api/users/index',
                'POST /api/_cars'
            ];

            for(var i = 0 ; i < requests.length ; i++) {
                var method = routes[i].split(' ')[0];
                var url    = routes[i].split(' ')[1];

                yield agent[method.toLowerCase()](url)
                    .expect(200);
            }
        });
    });
});
