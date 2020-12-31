const $ = require('cheerio');
const got = require('got')

exports.findProduct = async (query) =>{
    query = query.split(' ').join('+')
    const url = `https://www.shopdisney.co.uk/search?q=${query}`;

    const nameSelector = 'h4.product__tilename';
    const priceSelector = 'span.price__current';

    try {
        const response = await got(url);

        const productNames = $(nameSelector, response.body);
        const productPrices = $(priceSelector, response.body);

        let data=[];
        for (let index = 0; index < productNames.length; index++) {
            const name = productNames[index].childNodes[0].data;
            const price = productPrices[index].attribs['data-price'];
            data.push({name,price})
        }

        console.log(data.length + ' items on find list');
        console.log(data)
            
    } catch (error) {
        console.log(error)
    }
}

exports.getCart = async (Cookie) => {
    const url = 'https://www.shopdisney.co.uk/bag'
    const headers = {Cookie}
    const nameSelector = 'a.line-item-name';
    const priceSelector = 'div.line-item-list__price>span:not(.line-item-list__price--crossed)';

    try {
        const response = await got(url,{headers})
        const productNames = $(nameSelector, response.body);
        const productPrices = $(priceSelector, response.body);
        
        let data=[];
        for (let index = 0; index < productNames.length; index++) {
            const name = productNames[index].childNodes[0].data;
            const price = productPrices[index].childNodes[0].data;
            data.push({name,price})
        }
    
        console.log(data.length + ' items on cart');
        console.log(data)
        
    } catch (error) {
        console.log(error)
    }
}
