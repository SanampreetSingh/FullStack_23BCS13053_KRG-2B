package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "User") // same name as Mongoose model
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String uid;

    private String role = "user"; // default value

    @Indexed(unique = true)
    private Long phone;

    private String password;

    private String className; // optional

    private Date createdAt = new Date(); // default current date

    // 🟢 Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email.toLowerCase(); }

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid.toLowerCase(); }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getPhone() { return phone; }
    public void setPhone(Long phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
