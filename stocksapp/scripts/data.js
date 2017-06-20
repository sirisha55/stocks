var yql = require('yql-node');
var rp = require('request-promise');
var Promise = require('bluebird');

class YahooFinanceAPI {
     /** 
10    * @constructor 
11    * @param {Object} apiDetails 
12    * @return undefined 
13    */ 
       constructor(apiDetails) { 
            if(!apiDetails) { 
                 throw new Error('You need to provide an API key and secret.'); 
                 } 
        
 
           this.yql = yql.formatAsJSON().withOAuth(apiDetails.key, apiDetails.secret); 
        
 
          this.yql.setQueryParameter({ 
             env: 'store://datatables.org/alltableswithkeys', 
                  diagnostics: true 
            }); 
     } 

 
 /** 
28    * @method fetch 
29    * @desc executes a YQL query 
30    * @param {String} query 
31    * @return {Promise} 
*/
       fetch(query) { 
        return new Promise((resolve, reject) => { 
               this.yql.execute(query, (err, res) => { 
                    if(err) { 
                          reject({error: true, message: err.message}); 
                        } 
            
 
                   if(typeof res === 'object') { 
                          resolve(res); 
                      } 
            
 
                  try { 
                          const data = JSON.parse(res); 
                          resolve(data); 
                       } catch(e) { 
                              reject({error: true, message: e.message}); 
                            } 
                  }); 
            }); 
      } 

 
 /** 
55    * @method formatSymbolList 
56    * @desc formats a raw list of tickers to insert in a query 
57    * @param {String} rawList 
58    * @return {String} 
59    */ 
 formatSymbolList(rawList) { 
        const list = rawList.split(',').map(symbol => symbol.toUpperCase()).join('","'); 
         return `"${list}"`; 
       } 

  /** 
66    * @method uppercaseList 
67    * @desc uppercases a raw list of tickers to insert in a query 
68    * @param {String} rawList 
69    * @return {String} 
70    */ 
 uppercaseList(rawList) { 
     return rawList.split(',').map(s => s.toUpperCase()).join(','); 
 } 
 

   /** 
76    * @method getQuotes 
77    * @desc retrieves quote data 
78    * @param {String} rawSymbolList 
79    * @return {Promise} 
80    */ 
   getQuotes(rawSymbolList) { 
        const list = this.formatSymbolList(rawSymbolList); 
         const query = `select * from yahoo.finance.quotes where symbol in (${list})`; 
        return this.fetch(query); 
     } 

   /** 
88    * @method getRealtimeQuotes 
89    * @desc retrieves realtime quote data 
90    * @param {String} rawSymbolList 
91    * @return {Promise} 
92    */ 
   getRealtimeQuotes(rawSymbolList) { 
       const list = this.uppercaseList(rawSymbolList); 
       const query = `select * from pm.finance where symbol="${list}"`; 
       return this.fetch(query); 

   }
   /** 
100    * @method getDividendsHistory 
101    * @desc retrieves dividend payout historical data 
102    * @param {String} symbol 
103    * @param {String} startDate 
104    8 @param {String} endDate 
105    * @return {Promise} 
106    */ 
   getDividendsHistory(symbol, startDate, endDate) { 
       const query = `select * from yahoo.finance.dividendhistory where symbol = "${symbol.toUpperCase()}" and startDate = "${startDate}" and endDate = "${endDate}"`; 
        return this.fetch(query); 
   } 

   /** 
113    * @method getHistoricalData 
114    * @desc retrieves historical data 
115    * @param {String} symbol 
116    * @param {String} startDate 
117    8 @param {String} endDate 
118    * @return {Promise} 
119    */ 
  getHistoricalData(symbol, startDate, endDate) { 
      const query = `select * from yahoo.finance.historicaldata where symbol = "${symbol.toUpperCase()}" and startDate = "${startDate}" and endDate = "${endDate}"`; 
      return this.fetch(query); 
    } 

 
  /** 
126    * @method getSecuritiesBySectorIndex 
127    * @desc retrieves a list of securities belonging to a given sector 
128    * @param {String} sectorIndex 
129    * @return {Promise} 
130    */ 
   getSecuritiesBySectorIndex(sectorIndex) { 
         const query = `select * from yahoo.finance.industry where id="${sectorIndex}"`; 
         return this.fetch(query); 
    } 

 
  /** 
137    * @method getForexData 
138    * @desc retrieves foreign exchange data 
139    * @param {String} exchanges 
140    * @return {Promise} 
141    */ 
   getForexData(exchanges) { 
       const list = this.formatSymbolList(exchanges); 
       const query = `select * from yahoo.finance.xchange where pair in (${list})`; 
      return this.fetch(query); 
      } 
 
 
  /** 
149    * @method getHeadlinesByTicker 
150    * @desc retrieves news headlines 
151    * @param {String} ticker 
152    * @return {Promise} 
153    */ 
   getHeadlinesByTicker(ticker) { 
       const query = `select * from pm.finance.articles where symbol in ("${ticker.toUpperCase()}")`; 
       return this.fetch(query); 
    } 

 
   /** 
160    * @method getIntradayChartData 
161    * @desc retrieves intraday data 
162    * @param {String} ticker 
163    * @return {Promise} 
164    */ 
   getIntradayChartData(ticker) { 
       const query = `select * from pm.finance.graphs where symbol in ("${ticker.toUpperCase()}")`; 
       return this.fetch(query); 
       } 

 
   /** 
171    * @method tickerSearch 
172    * @desc searches for matching tickers based on search term 
173    * @param {String} searchTerm 
174    * @param {String} region 
175    * @param {String} lang 
176    * @return {Promise} 
177    */ 
  /* tickerSearch(searchTerm, region = 'US', lang = 'en-US') { 
       const query = `http://d.yimg.com/aq/autoc?query=${encodeURIComponent(searchTerm)}&region=${region}&lang=${lang}`; 
       return new Promise((resolve, reject) => { 
           rp(query) 
             .then(raw => { 
                 try { 
                     const data = JSON.parse(raw); 
                     resolve(data); 
                 } catch(e) { 
                     reject({error: true, message: e.message}); 
                 } 
             }) 
              .catch(err => { 
                  reject({error: true, message: err.message}); 
              }); 
       }); 
   }
   */
 }
 module.exports = YahooFinanceAPI;