const $ = require('cheerio');
const got = require('got')

const findProduct = async (query) =>{
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

const getCart = async (Cookie) => {
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

findProduct('mickey mouse mug')
getCart("s_ptc=0.00%5E%5E0.10%5E%5E1.36%5E%5E0.22%5E%5E1.33%5E%5E0.00%5E%5E14.82%5E%5E0.01%5E%5E18.00; _cs_id=679a7027-1e44-aeb0-b1a2-c35136c0bd1a.1609291876.2.1609294741.1609294371.1.1643455876565.Lax.0; __cfduid=dc5e8eb3889bba674dea0d5db7aa9cac81609292024; dwac_cdYLkiaagQNQ6aaadqpRAb3HPZ=UkF9xOBfUkNVc2iTlnR0PjF4q9OFzBaxu_4%3D|dw-only|||GBP|false|Europe%2FLondon|true; cqcid=bc1a5KaePSujjtsFSQ7pOzFl6v; cquid=||; sid=UkF9xOBfUkNVc2iTlnR0PjF4q9OFzBaxu_4; dwanonymous_4b4f41ef658a5f7622324979f744826c=bc1a5KaePSujjtsFSQ7pOzFl6v; __cq_dnt=0; dw_dnt=0; dwsid=w6Hznl_GpbOP5S9L7rmoAaCYJYk6VeFBYWht-yiPog0R6ZAii-uUGGMHJp1ZLCOl8DAEeGT5DefOX_Wt_3P9cQ==; uvtddl=1; utag_main=v_id:0176b14555f00018d2aa748d969800044002000900bd0$_sn:2$_se:1$_ss:1$_st:1609296539849$_prevpage:shopdisney%3Acheckout%3Aview%20basket%3Bexp-1609298339856$vapi_domain:shopdisney.co.uk$ses_id:1609294739849%3Bexp-session$_pn:1%3Bexp-session$user_status:inc%3Bexp-session; SWID=92017a7e-7994-4bc8-8c16-5d8542f3f317; __cq_uuid=ehmZfYrWskbAeadNXKy5hdcHpl; __cq_seg=0~0.46!1~0.48!2~-0.02!3~-0.34!4~-0.15!5~-0.45!6~0.16!7~0.40!8~-0.16!9~-0.08; CONSENTMGR=c1:1|c2:1|c3:1|c4:1|c5:1|c6:1|c17:1|c18:1|c19:1|c20:1|c21:1|c22:1|c23:1|c24:1|c25:1|c26:1|c27:1|c28:1|c29:1|c30:1|c31:1|c33:1|c37:1|c38:1|ts:1609291978964|consent:true; AMCV_CC0A3704532E6FD70A490D44%40AdobeOrg=-281048578%7CMCIDTS%7C18627%7CMCMID%7C05659410444509023513875751967249015796%7CMCAID%7CNONE%7CMCOPTOUT-1609299142s%7CNONE%7CMCAAMLH-1609896742%7C3%7CMCAAMB-1609896742%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CvVersion%7C4.6.0; DisneyCookieConsentChecksum=-636545365; _cs_c=1; _gcl_au=1.1.1273280247.1609291942; s_ecid=MCMID%7C05659410444509023513875751967249015796; AMCVS_CC0A3704532E6FD70A490D44%40AdobeOrg=1; s_ppv=emea%253Auk%253Ashopdisney%253Acheckout%253Aview%2520basket%2C52%2C35%2C1411; s_tp=2707; s_cc=true; _pin_unauth=dWlkPU5tVTNZMlZqTkdJdE16bG1ZUzAwTW1WaExUbGxOVGN0T0RCbU1EQmxNVGhtWmpCbQ; _y2=1%3AeyJjIjp7IjEzNjgxMyI6LTE0NzM5ODQwMDAsIjEzOTI1NyI6LTE0NzM5ODQwMDAsIjE0MTA2NCI6LTE0NzM5ODQwMDAsIjE0MTA2NSI6LTE0NzM5ODQwMDAsIjE0MTIxNCI6LTE0NzM5ODQwMDAsIjE0MzAwMyI6LTE0NzM5ODQwMDAsIjE0MzAwNCI6LTE0NzM5ODQwMDAsIjE0NDI0NCI6LTE0NzM5ODQwMDAsIjE0NTM2OCI6LTE0NzM5ODQwMDAsIjE0NTQ2NSI6LTE0NzM5ODQwMDAsIm8iOi0xNDczOTg0MDAwfX0%3D%3ALTE0NzEzNjMxNjg%3D%3A3; _yi=1%3AeyJsaSI6eyJjIjoxLCJjb2wiOjMyNTY4MDEwNDYsImNwZyI6MTM2NDA1LCJjcGkiOjEwMDk2MDgzMjQyNywic2MiOjEsInRzIjoxNjA5MjkwMDU2OTAxfSwic2UiOnsiYyI6MSwiZWMiOjE1OSwibGEiOjE2MDkyOTUxNDg4NDcsInAiOjcsInNjIjozMTA1fSwidSI6eyJpZCI6ImIzMWVjN2E3LTJlNmMtNDdjMS1hNDU2LTU3OTZlYjA4ZDg2NSIsImZsIjoiMCJ9fQ%3D%3D%3ALTE5NjU3ODQwMA%3D%3D%3A3; _fbp=fb.2.1609291950587.644526947; s_sq=%5B%5BB%5D%5D; __cq_bc=%7B%22aamz-disneyuk%22%3A%5B%7B%22id%22%3A%22466041627741%22%7D%2C%7B%22id%22%3A%22466041552814%22%7D%5D%7D; __olapicU=1609291960792; BVBRANDID=a7dfcfa3-a233-4b6c-ba87-ece0a8bed75a; _cs_s=2.1; _cs_mk=0.8521723984664548_1609294740399; gpv_pn=emea%3Auk%3Ashopdisney%3Acheckout%3Aview%20basket; _uetsid=9a48e2304a2e11eb830a9b419522bd54; _uetvid=9a48ed404a2e11ebb1b9878dcc65b6f1")