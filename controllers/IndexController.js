const axios = require('axios');
const env = require('../env');
const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 10 });

class IndexController {
    static async calculateRate({ from_currency_code, to_currency_code, amount}, cb) {
        const {RATE_API_URL, RATE_API_KEY} = env;
        const CACHE_KEY = 'cache_key';
        try {
            let data = null;
            if (cache.has(CACHE_KEY)) {
                data = cache.get(CACHE_KEY);
                console.log('from cache');
            } else {
                const apiData = await axios.get(RATE_API_URL, {
                    params: {
                        access_key: RATE_API_KEY,
                    }
                });
                data = apiData.data;
                cache.set(CACHE_KEY, data);
                console.log('from api');
            }
            const to = 1 / data.quotes['USD' + to_currency_code];
            const from = 1 / data.quotes['USD' + from_currency_code];
            
            const totalAmount = ((from / to) * amount).toFixed(2);
            cb.json({
                exchange_rate: (totalAmount / amount).toFixed(2),
                currency_code: to_currency_code,
                amount: totalAmount,
            })
        } catch (err) {
            console.log(err);
        }
        
    }
}

module.exports = IndexController;