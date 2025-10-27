const announcementController = require('../controllers/announcement.controller');
const express = require('express');
const router = express.Router();

router.post('/', announcementController.createAnnouncement);
router.get('/', announcementController.getAllAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.delete('/:id', announcementController.deleteAnnouncement);
router.put('/:id', announcementController.updateAnnouncement);

module.exports = router;
