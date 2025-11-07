package com.example.backend.controller;

import com.example.backend.model.Announcement;
import com.example.backend.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementService service;

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.createAnnouncement(announcement));
    }

    @GetMapping
    public ResponseEntity<?> getAllAnnouncements() {
        return ResponseEntity.ok(service.getAllAnnouncements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable String id) {
        return ResponseEntity.ok(service.getAnnouncementById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable String id) {
        return ResponseEntity.ok(service.deleteAnnouncement(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable String id, @RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.updateAnnouncement(id, announcement));
    }
}
