import YahooFinanceAPI from './src';
import express from 'express';
import apiDetails from './api_key';

const app = express();
const api = new YahooFinanceAPI(apiDetails);
const router = new express.Router();

router.get('/', (req, res) => {
  res.json({status: 'ok'});
});

/**
 * @desc Standard Yahoo! Quote data (15 min delay)
 * @example http://localhost:3000/api/quote/info/yahoo,msft,aapl
 */
router.get('/quote/info/:tickers', (req, res) => {
  api
    .getQuotes(req.params.tickers)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc Realtime Quote data
 * @example http://localhost:3000/api/quote/realtime/yhoo,aapl,msft
 */
router.get('/quote/realtime/:tickers', (req, res) => {
  api
    .getRealtimeQuotes(req.params.tickers)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc historical data
 * @example http://localhost:3000/api/quote/historical/yhoo/2017-01-01/2017-02-01
 */
router.get('/quote/historical/:ticker/:start/:end', (req, res) => {
  let {ticker, start, end} = req.params;

  api
    .getHistoricalData(ticker, start, end)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc Dividends history
 * @example http://localhost:3000/api/dividends/history/aapl/2016-01-01/2016-12-31
 */
router.get('/dividends/history/:ticker/:start/:end', (req, res) => {
  let {ticker, start, end} = req.params;

  api
    .getDividendsHistory(ticker, start, end)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc List of securities by sector id
 * @example http://localhost:3000/api/securities/bysector/812
 */
router.get('/securities/bysector/:sectorid', (req, res) => {
  api
    .getSecuritiesBySectorIndex(req.params.sectorid)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc Forex data
 * @example http://localhost:3000/api/forex/eurusd,gbpusd,cadusd
 */
router.get('/forex/:exchanges', (req, res) => {
  api
    .getForexData(req.params.exchanges)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc News Headlines by ticker
 * @example http://localhost:3000/api/news/headlines/aapl
 */
router.get('/news/headlines/:ticker', (req, res) => {
  api
    .getHeadlinesByTicker(req.params.ticker)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc Chart data
 * @example http://localhost:3000/api/chart/intraday/aapl
 */
router.get('/chart/intraday/:ticker', (req, res) => {
  api
    .getIntradayChartData(req.params.ticker)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

/**
 * @desc Ticker search
 * @example http://localhost:3000/api/ticker/search/Apple%20Inc.
 */
router.get('/ticker/search/:searchterm', (req, res) => {
  api
    .tickerSearch(req.params.searchterm)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

app.use('/api', router);

app.listen(3000);
