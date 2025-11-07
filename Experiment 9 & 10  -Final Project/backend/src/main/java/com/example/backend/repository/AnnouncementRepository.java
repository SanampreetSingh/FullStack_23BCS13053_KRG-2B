package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.model.Announcement;

public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    // Custom queries if needed later
}
