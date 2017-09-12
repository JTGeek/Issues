const express = require('express');
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public/index.html"))
});

router.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public/signin.html"))
});


router.get("/shelf", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public/shelf.html"))
});

function requireLogin(req, res, next) {
    console.log(req.session.user);
    if (!req.session.user) {
        res.redirect('/signin');
    } else {
        next();
    }
}
module.exports = router;