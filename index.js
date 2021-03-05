const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

//FILES

// Blocking Synchronous way

// const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8');
//
// console.log(textIn);
//
// const textOut = `This is what we know about the avocado : ${textIn}. \n Created on ${Date.now()}`
//
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File written !')

//Non-Blocking Asynchronous Way
//
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error");
//
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n ${data3}`,
//         "utf-8",
//         (err1) => {
//           console.log("Your file has been written");
//         }
//       );
//     });
//   });
// });
// console.log("Reading File");

//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    response.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);
    //API
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(data);

    //NOT FOUND
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    response.end("Page not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
