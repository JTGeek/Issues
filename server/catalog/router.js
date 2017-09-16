const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const fetch = require('node-fetch');
const {
  UserCatalog
} = require('./models');
var ObjectId = require('mongodb').ObjectId;

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new item in the catalog
router.post('/additem', jsonParser, (req, res) => {
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
  title = title.trim();
  publisher = publisher.trim();

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
      title: title,
      issue: issue,
      publisher: publisher
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
            let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:' + title + '&filter=issue:' + issue + '&filter=publisher:' + publisher;
            fetch(url)
              .then(function (result) {
                return result.json();
              }).then(function (json) {
                //console.log(json);
                if (json && json.results.length > 0) {
                  console.log("test", _id)
                  let cvURL = json.results[0].site_detail_url;
                  let cvImgURL = json.results[0].image.medium_url;
                  let cvDisc = json.results[0].description || 'No Discription for this issue yet';


                  UserCatalog.findOneAndUpdate({
                    _id: _id
                  }, {
                    $set: {
                      pageUrl: cvURL,
                      imgUrl: cvImgURL,
                      Discription: cvDisc

                    }
                  }, {
                    new: true
                  }, function (err, r) {
                    console.log(err);
                    console.log(r);
                    res.status(201).json(r);
                  })
                }

              });
          })
      } else {
        return res.status(400).json({

          code: 400,
          message: 'Update Failed'
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
  console.log(userID);
  UserCatalog
    .find({
      userid: userID
    })
    .then(catalog => {

      for (var i = 0; j = catalog.length, i < j; i++) {
        // console.log('catalog.title: ', catalog[i].title);
        // console.log('catalog.issue: ', catalog[i].issue);
        var iTitle = catalog[i].title;
        var iIssue = catalog[i].issue;

        console.log('iTitle: ', iTitle);
        console.log('iIssue: ', iIssue);


      }
      console.log('results: ', catalog);
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