import chai           from 'chai';
import sinon          from 'sinon';
import sinonChai      from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import mockery        from 'mockery';


chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();


const moduleUnderTest = '../src/eventlistener';

let eventlistener;


describe('openExchange', () => {
    beforeEach(() => {
        mockery.registerAllowable(moduleUnderTest);
        mockery.enable({
            useCleanCache:      true,
            warnOnReplace:      false,
            warnOnUnregistered: false,
        });

        const Eventlistener = require(moduleUnderTest).default;
        eventlistener = new Eventlistener();
    });

    afterEach(function() {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('#getCurrencies', () => {
        it('returns currencies with API request', async() => {
            const responseData = { 'AED': 'United Arab Emirates Dirham' };
            const setValueHandler = sinon.spy((key) => responseData);
            const requestsHandler = sinon.spy((key) => responseData);


            servicesMock.memCache.setValue = setValueHandler;
            servicesMock.request           = requestsHandler;


            const response = await eventlistener.getCurrencies();


            setValueHandler.should.be.calledOnce;
            requestsHandler.should.be.calledOnce;
            response.should.be.deep.equal(responseData);
        });
    });

    describe('#getHistorical', () => {
        it('returns request', async() => {
            const date = '2009-12-09';
            const responseData = { 'AED': 'United Arab Emirates Dirham' };
            const setValueHandler = sinon.spy((key) => responseData);
            const requestsHandler = sinon.spy((key) => responseData);


            servicesMock.memCache.setValue = setValueHandler;
            servicesMock.request           = requestsHandler;


            const response = await eventlistener.getHistorical(date);


            setValueHandler.should.be.calledOnce;
            requestsHandler.should.be.calledOnce;
            response.should.be.deep.equal(responseData);
        });

        it('returns Error with undefined date parameter', async() => {
            const setValueHandler = sinon.spy();
            const requestsHandler = sinon.spy();


            servicesMock.memCache.setValue = setValueHandler;
            servicesMock.request           = requestsHandler;


            setValueHandler.should.not.be.called;
            requestsHandler.should.not.be.called;
            eventlistener.getHistorical().should.be.rejected;
        });
    });
});
