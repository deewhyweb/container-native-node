const express = require('express')
  , router = express.Router();

/**
   * @swagger
   * /products:
   *   get:
   *     description: Returns products
   *     tags:
   *      - Products
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: products
   */
router.get('/', function (req, res) {
  console.log('Registering Student');
  res.json({ success: true });

});


module.exports = router