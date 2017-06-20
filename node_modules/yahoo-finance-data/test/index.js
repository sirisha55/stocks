import {expect} from 'chai';
import sinon from 'sinon';

import YahooFinanceAPI from '../src';

describe('The Yahoo Finance Data module', () => {
  it('should export a function', () => {
    expect(YahooFinanceAPI).to.be.a('function');
  });

  it('should throw an error if no api details are passed to it', () => {
    expect(() => {
      new YahooFinanceAPI();
    }).to.throw();
  });

  it('should create a yql instance', () => {
    let API = new YahooFinanceAPI({
      key: 'somekey',
      secret: 'somesecret'
    });

    expect(API.yql).to.be.an('object');
  });

  describe('The fetch method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.yql.execute = sinon.spy();
    });

    afterEach(() => {
      API = null;
    });

    it('should make a call to YQL', function() {
      let query = 'SELECT * from yahoo.finance';
      API.fetch(query);
      expect(API.yql.execute.calledWith(query)).to.equal(true);
    });
  });

  describe('The formatSymbolList method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });
    });

    afterEach(() => {
      API = null;
    });

    it('should format a list of symbols', () => {
      let list = API.formatSymbolList('yhoo,aapl,msft');
      expect(list).to.equal('"YHOO","AAPL","MSFT"');
    });
  });

  describe('The uppercaseList method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });
    });

    afterEach(() => {
      API = null;
    });

    it('should uppercase a list of symbols', () => {
      let list = API.uppercaseList('yhoo,aapl,msft');
      expect(list).to.equal('YHOO,AAPL,MSFT');
    });
  });

  describe('The getQuotes method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some quote data', () => {
      return API
        .getQuotes('aapl')
        .then((res) => {
          expect(API.fetch.calledWith('select * from yahoo.finance.quotes where symbol in ("AAPL")')).to.equal(true);
        });
    });
  });

  describe('The getRealtimeQuotes method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some realtime quote data', () => {
      return API
        .getRealtimeQuotes('aapl')
        .then((res) => {
          expect(API.fetch.calledWith('select * from pm.finance where symbol="AAPL"')).to.equal(true);
        });
    });
  });

  describe('The getDividendsHistory method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some dividend data', () => {
      return API
        .getDividendsHistory('aapl', '2016-01-01', '2016-12-31')
        .then((res) => {
          expect(API.fetch.calledWith('select * from yahoo.finance.dividendhistory where symbol = "AAPL" and startDate = "2016-01-01" and endDate = "2016-12-31"')).to.equal(true);
        });
    });
  });

  describe('The getHistoricalData method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some historical data', () => {
      return API
        .getHistoricalData('aapl', '2016-01-01', '2016-12-31')
        .then((res) => {
          expect(API.fetch.calledWith('select * from yahoo.finance.historicaldata where symbol = "AAPL" and startDate = "2016-01-01" and endDate = "2016-12-31"')).to.equal(true);
        });
    });
  });

  describe('The getSecuritiesBySectorIndex method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some securities belonging to a given sector', () => {
      return API
        .getSecuritiesBySectorIndex('812')
        .then((res) => {
          expect(API.fetch.calledWith('select * from yahoo.finance.industry where id="812"')).to.equal(true);
        });
    });
  });

  describe('The getForexData method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some foreign exchange data', () => {
      return API
        .getForexData('EURUSD')
        .then((res) => {
          expect(API.fetch.calledWith('select * from yahoo.finance.xchange where pair in ("EURUSD")')).to.equal(true);
        });
    });
  });

  describe('The getHeadlinesByTicker method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some news', () => {
      return API
        .getHeadlinesByTicker('aapl')
        .then((res) => {
          expect(API.fetch.calledWith('select * from pm.finance.articles where symbol in ("AAPL")')).to.equal(true);
        });
    });
  });

  describe('The getIntradayChartData method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });

      API.fetch = sinon.stub().returns(new Promise((resolve, reject) => {
        resolve(true);
      }));
    });

    afterEach(() => {
      API = null;
    });

    it('should call YQL to get some intraday data', () => {
      return API
        .getIntradayChartData('aapl')
        .then((res) => {
          expect(API.fetch.calledWith('select * from pm.finance.graphs where symbol in ("AAPL")')).to.equal(true);
        });
    });
  });

  describe('The tickerSearch method', () => {
    let API;

    beforeEach(() => {
      API = new YahooFinanceAPI({
        key: 'somekey',
        secret: 'somesecret'
      });
    });

    afterEach(() => {
      API = null;
    });

    it('should search for matching securities', () => {
      return API
        .tickerSearch('Apple Inc.')
        .then((res) => {
          expect(res).to.be.an('object');
        });
    });
  });
});
