[![Build Status](https://travis-ci.org/stephanepericat/yahoo-finance.svg?branch=master)](https://travis-ci.org/stephanepericat/yahoo-finance)

[![npm version](https://badge.fury.io/js/yahoo-finance-data.svg)](https://badge.fury.io/js/yahoo-finance-data)

[![NPM](https://nodei.co/npm/yahoo-finance-data.png)](https://nodei.co/npm/yahoo-finance-data/)

# yahoo-finance

A node wrapper to call the various Yahoo! Finance API's.

## Prerequisites

This module requires a Yahoo! API key. [More info here](https://developer.yahoo.com/apps/create/).

## Install

```shell
npm install yahoo-finance-data
```

## Getting started

```js
import YahooFinanceAPI from 'yahoo-finance-data';

const api = new YahooFinanceAPI({
  key: 'mylongyahooapikey',
  secret: 'mylongyahooapisecret'
});
```

## API

### getQuotes(symbolList)

Retrieves Yahoo! standard quote data for one or more securities (15 min delay).

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| symbolList   | String  | the ticker list, comma-separated |

```js
api
  .getQuotes('YHOO,MSFT,AAPL')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getReatimeQuotes(symbolList)

Retrieves realtime quote data for one or more securities.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| symbolList   | String  | the ticker list, comma-separated |

```js
api
  .getRealtimeQuotes('YHOO,MSFT,AAPL')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getHistoricalData(symbol, startDate, endDate)

Retrieves historical data for a given security.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| symbol       | String  | the ticker |
| start date   | String  | start date (2017-01-01) |
| end date     | String  | end date (2017-01-01) |

```js
api
  .getHistoricalData('AAPL', '2016-01-01', '2016-02-01')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getDividendsHistory(symbol, startDate, endDate)

Retrieves dividends historical data for a given security.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| symbol       | String  | the ticker |
| start date   | String  | start date (2016-01-01) |
| end date     | String  | end date (2016-12-31) |

```js
api
  .getDividendsHistory('AAPL', '2016-01-01', '2016-12-31')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getSecuritiesBySectorIndex(sectorIndex)

Retrieves a list of securities for a given sector index.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| sectorIndex  | String  | the sector index |

```js
api
  .getSecuritiesBySectorIndex(812)
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getForexData(exchanges)

Retrieves forex data for one or multiple currency pairs.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| exchanges    | String  | the list of currency pairs, comma-separated |

```js
api
  .getForexData('eurusd,gbpusd,cadusd')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getHeadlinesByTicker(ticker)

Retrieves news headlines for a given security.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| ticker       | String  | the ticker |

```js
api
  .getHeadlinesByTicker('AAPL')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### getIntradayChartData(ticker)

Retrieves intraday chart data for a given security.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| ticker       | String  | the ticker |

```js
api
  .getIntradayChartData('AAPL')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### tickerSearch(searchTerm, [region, lang])

Retrieves matches for a given search term.

| Param        | Type    | Desc  |
| ------------ |:-------:| :---- |
| searchTerm   | String  | the search query |
| region       | String  | OPTIONAL the region (default: US) |
| lang         | String  | OPTIONAL the language (default: en-US) |

```js
api
  .tickerSearch('Apple Inc.')
  .then(data => console.log(data))
  .catch(err => console.log(err));
```
