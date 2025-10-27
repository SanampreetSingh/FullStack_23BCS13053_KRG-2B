const Announcement = require("../models/announcement.model"); 


exports.createAnnouncement = async (req, res) => {
    try {
        const { subject, body, by } = req.body;
        if (!subject || !body || !by) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const newAnnouncement = new Announcement({ subject, body, by, date, time });
        await newAnnouncement.save();
        res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ announcements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);
        if (!announcement) return res.status(404).json({ message: "Announcement not found" });
        res.status(200).json({ announcement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) return res.status(404).json({ message: "Announcement not found" });
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, body, by } = req.body;
        if (!subject || !body || !by) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { subject, body, by, date, time },
            { new: true }
        );
        if (!updatedAnnouncement) return res.status(404).json({ message: "Announcement not found" });
        res.status(200).json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
