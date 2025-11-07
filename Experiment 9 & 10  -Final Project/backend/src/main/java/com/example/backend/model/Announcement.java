package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "announcements")  // MongoDB collection name
public class Announcement {

    @Id
    private String id;

    private String subject;
    private String body;
    private String by;
    private String date;
    private String time;
    private Date createdAt = new Date();  // default: now

    // Constructors
    public Announcement() {}

    public Announcement(String subject, String body, String by, String date, String time) {
        this.subject = subject;
        this.body = body;
        this.by = by;
        this.date = date;
        this.time = time;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getBy() { return by; }
    public void setBy(String by) { this.by = by; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
