package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionChecker implements CommandLineRunner {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) {
        try {
            mongoTemplate.getDb().getName(); // forces connection test
            System.out.println("✅ MongoDB Connected Successfully");
        } catch (Exception e) {
            System.out.println("❌ MongoDB Connection Failed: " + e.getMessage());
            System.exit(1);
        }
    }
}
