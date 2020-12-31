const $ = require('cheerio');
// const {promisify} = require('util');
const got = require('got');
const {Cookie,CookieJar} = require('tough-cookie');

const cookiejar = new CookieJar();

exports.search = async function(query){
    query = query.split(' ').join('+')
    const url = `https://www.shopdisney.co.uk/search?q=${query}`;

    const nameSelector = 'h4.product__tilename';
    const priceSelector = 'span.price__current';
    const linkSelector = 'a.product__linkcontainer';

    try {
        const response = await got(url,{
            headers:{
                Cookie:cookiejar.getCookieStringSync('https://www.shopdisney.co.uk')}
        })
        setCookie(response)

        const productNames = $(nameSelector, response.body);
        const productPrices = $(priceSelector, response.body);
        const links = $(linkSelector, response.body);

        let data=[];
        for (let index = 0; index < productNames.length; index++) {
            const id = links[index].attribs['data-product-id'];
            const name = productNames[index].childNodes[0].data;
            const price = productPrices[index].attribs['data-price'];
            const link = links[index].attribs['href'];
            data.push({id, name, price, link})
        }
        
        return data
            
    } catch (error) {
        console.log(error)
    }
}

exports.findProductById = async (pid)=>{
    const url = `https://www.shopdisney.co.uk/search?q=${pid}`;
    const productNotFoundSelector = 'section.search-catlisting-heading>h1';
    // const productHasSetItemsSelector = '.productset__itemsheading'
    const csrfTokenSelector = 'input.csrftoken';
    try {
        const response = await got(url,{headers:{Cookie:cookiejar.getCookieStringSync('https://www.shopdisney.co.uk')}});
        setCookie(response)

        const productNotFound = $(productNotFoundSelector, response.body).length > 0;
        if(productNotFound){
            return {message: 'product not found'}
        } else{
            const json = {
                'csrf_token':$(csrfTokenSelector, response.body)[0].attribs['value'],
                'Quantity':1,
                'format':'ajax',
                pid
            }
            const options = {
                // responseType: 'json',
                data:JSON.stringify(json),
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Cookie":cookiejar.getCookieStringSync('https://www.shopdisney.co.uk')
                }
            }
            console.log("🚀 ~ file: utils.js ~ line 77 ~ exports.findProductById= ~ options", options)
            const addToChartResponse = await got.post(
                "https://www.shopdisney.co.uk/on/demandware.store/Sites-disneyuk-Site/en_GB/Cart-AddProduct",
                options)
                console.log('test', addToChartResponse.body)

            // const productHasSetItem = $(productHasSetItemsSelector, response.body).length > 0;
            return {message:'success'}
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getCart = async () => {
    const url = 'https://www.shopdisney.co.uk/bag'
    const headers = {
        Cookie:cookiejar.getCookieStringSync('https://www.shopdisney.co.uk')
    }
    const nameSelector = 'a.line-item-name';
    const priceSelector = 'div.line-item-list__price>span:not(.line-item-list__price--crossed)';
    const linkSelector = 'a.product__linkcontainer';
    
    try {
        const response = await got(url,{headers})
        const productNames = $(nameSelector, response.body);
        const productPrices = $(priceSelector, response.body);
        const links = $(linkSelector, response.body);
        
        if(productNames.length){
            let data=[];
            for (let index = 0; index < productNames.length; index++) {
                const name = productNames[index].childNodes[0].data;
                const price = productPrices[index].childNodes[0].data;
                const link = links[index].attribs['href'];
                data.push({name, price, link})
            }
            return data
        }else{
            return {message:'cart is empty'}
        }
        
    } catch (error) {
        console.log(error)
    }
}

function setCookie(response){
    let cookies
    if(response.headers['set-cookie']){
        if (response.headers['set-cookie'] instanceof Array){
            cookies = response.headers['set-cookie'].map(Cookie.parse);
        }
        else{
            cookies = [Cookie.parse(response.headers['set-cookie'])];
        }

        cookies.map(cookie=>cookiejar.setCookie(cookie,'https://www.shopdisney.co.uk'))
    }
}
