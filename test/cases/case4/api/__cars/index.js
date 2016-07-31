var router = require('express').Router({mergeParams: true});

module.exports = router;

router.post('/', function(req, res) {
    res.status(200).send('Hello');
});
