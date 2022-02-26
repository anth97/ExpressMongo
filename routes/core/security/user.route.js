const { Router } = require('express');
const { create, list } = require('../../../controllers/core/security/user.controller');

const router = Router();

router.post('/', create);
router.get('/', list);



module.exports = router;