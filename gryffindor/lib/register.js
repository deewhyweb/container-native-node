const express = require('express')
  , router = express.Router();

/**
   * @swagger
   * /awards:
   *   get:
   *     description: Returns awards
   *     tags:
   *      - Awards
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: awards
   *   post:
   *     description: Create awards
   *     tags:
   *      - Awards
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: awards
   *   put:
   *     description: Update awards
   *     tags:
   *      - Awards
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: awards
   *   delete:
   *     description: Deletes awards
   *     tags:
   *      - Awards
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: awards
   * /students:
   *   get:
   *     description: Returns students
   *     tags:
   *      - Students
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: students
   *   post:
   *     description: Create student
   *     tags:
   *      - Students
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: students
   *   put:
   *     description: Update student
   *     tags:
   *      - Students
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: students
   *   delete:
   *     description: Deletes student
   *     tags:
   *      - Students
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: students
   * /points:
   *   get:
   *     description: Returns points
   *     tags:
   *      - Points
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: points
   *   post:
   *     description: Create points
   *     tags:
   *      - Points
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: points
   *   put:
   *     description: Update points
   *     tags:
   *      - Points
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: points
   *   delete:
   *     description: Deletes points
   *     tags:
   *      - Points
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: points
   */
router.get('/', function (req, res) {
  console.log('Registering Student');
  res.json({ success: true });

});


module.exports = router