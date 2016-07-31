var router = require('express').Router({mergeParams: true});

module.exports = router;

router.put('/', function(req, res) {
    res.status(200).send('Hello');
});
