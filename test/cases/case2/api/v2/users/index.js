var router = require('express').Router({mergeParams: true});

module.exports = router;

router.get('/', function(req, res) {
    res.status(200).send('Hello V2');
});
