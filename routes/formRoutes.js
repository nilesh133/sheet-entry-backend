const express = require("express");
const { saveFormData } = require("../controllers/formController.js");

const router = express.Router();

router.post("/save", saveFormData);

module.exports = router;