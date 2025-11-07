package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "classes")
public class ClassModel {

    @Id
    private String id;
    private String className;
    private List<Subject> subjects;
    private List<Student> students;
    private Date createdAt = new Date();

    // Nested classes (like sub-schemas in Mongoose)
    public static class Activity {
        private String name;
        private int total;

        public Activity() {}
        public Activity(String name, int total) {
            this.name = name;
            this.total = total;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
    }

    public static class Subject {
        private String name;
        private String type = "Graded";
        private Integer credits;
        private int internal;
        private int external;
        private List<Activity> activities;

        public Subject() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Integer getCredits() { return credits; }
        public void setCredits(Integer credits) { this.credits = credits; }

        public int getInternal() { return internal; }
        public void setInternal(int internal) { this.internal = internal; }

        public int getExternal() { return external; }
        public void setExternal(int external) { this.external = external; }

        public List<Activity> getActivities() { return activities; }
        public void setActivities(List<Activity> activities) { this.activities = activities; }
    }

    public static class Student {
        private String uid;
        private String name;

        public Student() {}
        public Student(String uid, String name) {
            this.uid = uid;
            this.name = name;
        }

        public String getUid() { return uid; }
        public void setUid(String uid) { this.uid = uid; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Constructors
    public ClassModel() {}
    public ClassModel(String className, List<Subject> subjects, List<Student> students) {
        this.className = className;
        this.subjects = subjects;
        this.students = students;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public List<Subject> getSubjects() { return subjects; }
    public void setSubjects(List<Subject> subjects) { this.subjects = subjects; }

    public List<Student> getStudents() { return students; }
    public void setStudents(List<Student> students) { this.students = students; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
