// const {
//     CV_APIKEY
// } = require('../config');
// const http = require('http');

// //The url we want is: 'comicvine.gamespot.com/api/characters/?api_key=$APIKEY$&format=json'
// const apiHost = "api.comicvine.com";
// const apiPath = "/issues/?api_key=" + CV_APIKEY + "&format=json";



// const getData = function (iTitle, iIssue) {

// const filter = '&filter=title:' + iTitle + '&filter=issue:' + iIssue;

// //Standard API Request:
// const options = {
//     host: apiHost,
//     path: apiPath + '&filter=title:hellboy' //filter
// };
// console.log('options: ', options);

// // let callback = function (response) {
// //     let str = '';

// //     // another chunk of data has been recieved, so append it to `str`
// //     // response.setEncoding('utf8')
// //     response.on('data', function (chunk) {
// //         str += chunk;
// //     });
// //     response.on('error', function (error) {
// //         console.log("error: " + error);
// //     })
// //     //the whole response has been recieved, so we just print it out here
// //     response.on('end', function () {
// //         console.log('hello');
// //         console.log(str);
// //         return (str);
// //     });

// // }


// // http.request(options, callback).end();


// // let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
// // fetchUrl(url, function (error, meta, body) {
// //     return body
// })

// //     request

// //         .get('http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy')
// //         .on('response', function (response) {
// //             console.log('response', response);
// //             console.log("test", response.statusCode) // 200 
// //             console.log(response.headers['content-type']) // 'image/png' 
// //         })
// //         .on('error', function (error) {
// //             console.log("error: " + error);
// //         })

// // request('http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy', function (error, response, body) {
// //     console.log('error:', error); // Print the error if one occurred
// //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
// //     console.log('body:', body); // Print the HTML for the Google homepage. 
// // });
// }


// module.exports = getData;