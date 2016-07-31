const
    express     = require('express'),
    router      = express.Router({mergeParams: true});

module.exports = router;

router.get('/', (req, res) => {
    res.status(200).send(req.params);
});
