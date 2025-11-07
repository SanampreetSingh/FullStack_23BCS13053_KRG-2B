package com.example.backend.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "otp")
public class Otp {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String otp;

    @CreatedDate
    private Date createdAt = new Date();

    // MongoDB TTL index (auto delete after 300 seconds)
    @Indexed(expireAfterSeconds = 300)
    private Date expiry = new Date();

    // ✅ Default constructor (required by Spring Data)
    public Otp() {}

    // ✅ Constructor used in service (fix for your error)
    public Otp(String email, String otp) {
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.otp = otp;
        this.createdAt = new Date();
        this.expiry = new Date();
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email != null ? email.trim().toLowerCase() : null; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getExpiry() { return expiry; }
    public void setExpiry(Date expiry) { this.expiry = expiry; }
}
