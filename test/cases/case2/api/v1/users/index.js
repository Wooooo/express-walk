var router = require('express').Router({mergeParams: true});

module.exports = router;

router.get('/', function(req, res) {
    res.status(200).send('Hello V1');
});

router.post('/', function(req, res) {
    res.status(200).send('Hello V1 post');
});
