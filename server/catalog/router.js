const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const getData = require('./search.js')
const fetch = require('node-fetch');
const {
  UserCatalog
} = require('./models');
var ObjectId = require('mongodb').ObjectId;

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new item in the catalog
router.post('/additem', jsonParser, (req, res) => {
  // UserCatalog.find({
  //   _id: "59b75b1803f4b236d05202a5"

  // }, function (err, result) {
  //   console.log(err);
  //   console.log(result);

  // })

  UserCatalog.update({
    _id: "59b75b1803f4b236d05202a5"
  }, {
    $set: {
      detailURL: "cvurl"
    }
  }, function (err, result) {
    console.log(err);
    console.log(result);
    res.status(201).json(result);
  })
  return false;
  const requiredFields = ['title', 'issue'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['title', 'publisher', 'published'];
  const nonStringField = stringFields.find(field =>
    (field in req.body) && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  let {
    userid,
    title,
    issue,
    publisher,
    published
  } = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  // console.log(req.body);
  //username = username.trim();
  title = title.trim();
  publisher = publisher.trim();
  //published = published.trim();

  const arr = [{
    userid: userid,
    title: title,
    issue: issue,
    publisher: publisher,
    //published: published
  }];


  return UserCatalog
    .find({
      userid: userid,
      title: title
    })
    .then(update => {
      console.log(update);
      if (update && update.length == 0) {
        UserCatalog.insertMany(arr)
          .then(function (docs) {
            console.log('docs')
            return docs;
          })
          .then(results => {
            let _id = results[0]["_id"];
            console.log(results)
            let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
            fetch(url)
              .then(function (result) {
                return result.json();
              }).then(function (json) {
                //console.log(json);
                if (json && json.results.length > 0) {
                  console.log("test", _id)
                  let cvURL = json.results[0].api_detail_url;
                  var ObjectId = require('mongodb').ObjectId;
                  var o_id = new ObjectId(_id);
                  UserCatalog.update({
                    _id: o_id
                  }, {
                    $set: {
                      detailURL: cvURL
                    }
                  }, function (err, result) {
                    console.log(err);
                    console.log(result);
                    res.status(201).json(result);
                  })

                }

              });
          })
      } else {
        return res.status(400).json({

          code: 400,
          message: 'User already in collection'
        })

      }


    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({
        code: 500,
        message: 'Internal server error'
      });
    });
});


router.get('/:userID', (req, res) => {
  let userID = req.params.userID;
  UserCatalog
    .find({
      userid: userID
    })
    .then(catalog => {

      // for (var i = 0; j = catalog.length, i < j; i++) {
      //   // console.log('catalog.title: ', catalog[i].title);
      //   // console.log('catalog.issue: ', catalog[i].issue);
      //   var iTitle = catalog[i].title;
      //   var iIssue = catalog[i].issue;
      //   console.log('iTitle: ', iTitle);
      //   console.log('iIssue: ', iIssue);
      getData();


      // }
      // console.log('results: ', results);
      return res.status(201).json(catalog);
    })

});


// router.get('/test', (req, res) => {
//   let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
//   fetch(url)
//     .then(function (result) {
//       return result.json();
//     }).then(function (json) {
//       res.send(json)
//     });
// })

module.exports = {
  router
};