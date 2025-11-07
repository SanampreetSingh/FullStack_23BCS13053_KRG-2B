package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Document(collection = "result")
@CompoundIndex(name = "class_subject_type_activity",
        def = "{'classId': 1, 'subjectName': 1, 'type': 1, 'activityName': 1}")
public class Result {

    @Id
    private String id;

    private String classId;
    private String subjectName;
    private String type; // "Regular" or "Semester"
    private String activityName;

    // like { uid: marks }
    private Map<String, Object> marks;

    private Date createdAt = new Date();
    private Date updatedAt = new Date();

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public Map<String, Object> getMarks() { return marks; }
    public void setMarks(Map<String, Object> marks) { this.marks = marks; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}