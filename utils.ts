const cheerio = require("cheerio");
// const {promisify} = require('util');
const got = require("got");
const { Cookie, CookieJar } = require("tough-cookie");
const formData = require("form-data");

const cookiejar = new CookieJar();
const url = "https://www.shopdisney.co.uk";

exports.search = async function (query: string): Promise<any> {
  query = query.split(" ").join("+");
  const path = `${url}/search?q=${query}`;

  const nameSelector = "h4.product__tilename";
  const priceSelector = "span.price__current";
  const linkSelector = "a.product__linkcontainer";

  try {
    const response = await got(path, {
      headers: {
        Cookie: cookiejar.getCookieStringSync(url),
      },
    });
    setCookie(response);

    const productNames = cheerio(nameSelector, response.body);
    const productPrices = cheerio(priceSelector, response.body);
    const links = cheerio(linkSelector, response.body);

    let data = [];
    for (let index = 0; index < productNames.length; index++) {
      const id = links[index].attribs["data-product-id"];
      const name = productNames[index].childNodes[0].data;
      const price = productPrices[index].attribs["data-price"];
      const link = links[index].attribs["href"];
      data.push({ id, name, price, link });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

exports.findProductById = async (pid: string): Promise<any> => {
  const path = `${url}/search?q=${pid}`;
  const productNotFoundSelector = "section.search-catlisting-heading>h1";
  // const productHasSetItemsSelector = '.productset__itemsheading'
  const csrfTokenSelector = ".csrftoken";
  try {
    const response = await got(path, {
      headers: { Cookie: cookiejar.getCookieStringSync(url) },
    });
    setCookie(response);

    const productNotFound =
      cheerio(productNotFoundSelector, response.body).length > 0;
    if (productNotFound) {
      return { message: "product not found" };
    } else {
      const form = new formData();
      form.append(
        "csrf_token",
        cheerio(csrfTokenSelector, response.body)[0].attribs["value"]
      );
      form.append("Quantity", "1");
      form.append("format", "ajax");
      form.append("pid", pid);

      const options = {
        method: "POST",
        body: form,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: cookiejar.getCookieStringSync(url),
        },
      };
      const addToChartResponse = await got(
        `${url}/on/demandware.store/Sites-disneyuk-Site/en_GB/Cart-AddProduct`,
        options
      );
      console.log("result", addToChartResponse.body);

      return { message: "success" };
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (): Promise<any> => {
  const path = `${url}/bag`;
  const headers = {
    Cookie: cookiejar.getCookieStringSync(url),
  };
  const nameSelector = "a.line-item-name";
  const priceSelector =
    "div.line-item-list__price>span:not(.line-item-list__price--crossed)";
  const linkSelector = "a.product__linkcontainer";

  try {
    const response = await got(path, { headers });
    const productNames = cheerio(nameSelector, response.body);
    const productPrices = cheerio(priceSelector, response.body);
    const links = cheerio(linkSelector, response.body);

    if (productNames.length) {
      let data = [];
      for (let index = 0; index < productNames.length; index++) {
        const name = productNames[index].childNodes[0].data;
        const price = productPrices[index].childNodes[0].data;
        const link = links[index].attribs["href"];
        data.push({ name, price, link });
      }
      return data;
    } else {
      return { message: "cart is empty" };
    }
  } catch (error) {
    console.log(error);
  }
};

function setCookie(response: any) {
  let cookies;
  if (response.headers["set-cookie"]) {
    if (response.headers["set-cookie"] instanceof Array) {
      cookies = response.headers["set-cookie"].map(Cookie.parse);
    } else {
      cookies = [Cookie.parse(response.headers["set-cookie"])];
    }

    cookies.map((cookie: any) => cookiejar.setCookie(cookie, url));
  }
}
