const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const getData = require('./search.js')
const {
  UserCatalog
} = require('./models');
const fetchUrl = require("fetch").fetchUrl;
var ObjectId = require('mongodb').ObjectID;

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
      // Username and password come in pre-trimmed, otherwise we throw an error
      // before this
      // console.log(req.body);
      //username = username.trim();
      title = title.trim();
      publisher = publisher.trim();
      published = published.trim();

      const arr = [{
        userid: userid,
        title: title,
        issue: issue,
        publisher: publisher,
        published: published
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
                  console.log('fetch')
                  let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
                  fetchUrl(url, function (error, meta, body) {
                      return UserCatalog.update({
                        _id: ObjectId('59a0e73ca0523d5378ec246d')
                      }, {
                        $set: {
                          coverUrl: 'https://comicvine.gamespot.com/api/image/scale_medium/2645776-chamber_of_chills__13_cgc_8.5.jpg'
                        }
                      })
                      //res.status(201).json(body);
                      //})
                    })
                    .then(results => {
                      console.log(results)
                    })
                } else {
                  return res.status(400).json({

                    code: 400,
                    message: 'User already in collection'
                  });

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
      //   console.log("is working");
      //   let url = 'http://api.comicvine.com/issues/?api_key=811257a1a6ca2c21707f7ad0207533f431883722&format=json&filter=title:hellboy';
      //   fetchUrl(url, function (error, meta, body) {
      //     res.send(body)
      //     //res.status(201).json(body);
      //   })


      // })


      module.exports = {
        router
      };