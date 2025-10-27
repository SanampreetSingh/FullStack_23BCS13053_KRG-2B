const express = require("express");
const router = express.Router();
const classController = require("../controllers/class.controller");

router.post("/", classController.createClass);
router.get("/get", classController.getClasses);
router.get("/timetable/:classname", classController.getTimetable);
router.post("/createtimetable", classController.createTimetable);
router.put("/updatetimetable", classController.updateTimetable);

module.exports = router;
