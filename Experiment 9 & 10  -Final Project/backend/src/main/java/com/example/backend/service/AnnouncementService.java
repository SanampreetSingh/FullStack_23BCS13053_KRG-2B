package com.example.backend.service;

import com.example.backend.model.Announcement;
import com.example.backend.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository repository;

    // CREATE
    public Map<String, Object> createAnnouncement(Announcement announcement) {
        Map<String, Object> response = new HashMap<>();

        if (announcement.getSubject() == null || announcement.getBody() == null || announcement.getBy() == null) {
            response.put("message", "All fields are required");
            return response;
        }

        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String time = new SimpleDateFormat("hh:mm a").format(new Date());

        announcement.setDate(date);
        announcement.setTime(time);
        announcement.setCreatedAt(new Date());

        Announcement saved = repository.save(announcement);
        response.put("message", "Announcement created successfully");
        response.put("announcement", saved);
        return response;
    }

    // GET ALL
    public Map<String, Object> getAllAnnouncements() {
        List<Announcement> announcements = repository.findAll();
        announcements.sort(Comparator.comparing(Announcement::getCreatedAt).reversed());

        Map<String, Object> response = new HashMap<>();
        response.put("announcements", announcements);
        return response;
    }

    // GET BY ID
    public Map<String, Object> getAnnouncementById(String id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Announcement> announcement = repository.findById(id);

        if (announcement.isEmpty()) {
            response.put("message", "Announcement not found");
            return response;
        }

        response.put("announcement", announcement.get());
        return response;
    }

    // DELETE
    public Map<String, Object> deleteAnnouncement(String id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Announcement> existing = repository.findById(id);

        if (existing.isEmpty()) {
            response.put("message", "Announcement not found");
            return response;
        }

        repository.deleteById(id);
        response.put("message", "Announcement deleted successfully");
        return response;
    }

    // UPDATE
    public Map<String, Object> updateAnnouncement(String id, Announcement updatedData) {
        Map<String, Object> response = new HashMap<>();
        Optional<Announcement> existing = repository.findById(id);

        if (existing.isEmpty()) {
            response.put("message", "Announcement not found");
            return response;
        }

        Announcement announcement = existing.get();

        if (updatedData.getSubject() == null || updatedData.getBody() == null || updatedData.getBy() == null) {
            response.put("message", "All fields are required");
            return response;
        }

        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String time = new SimpleDateFormat("hh:mm a").format(new Date());

        announcement.setSubject(updatedData.getSubject());
        announcement.setBody(updatedData.getBody());
        announcement.setBy(updatedData.getBy());
        announcement.setDate(date);
        announcement.setTime(time);
        announcement.setCreatedAt(new Date());

        Announcement saved = repository.save(announcement);

        response.put("message", "Announcement updated successfully");
        response.put("announcement", saved);
        return response;
    }
}
