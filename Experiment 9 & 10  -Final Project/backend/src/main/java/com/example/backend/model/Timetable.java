package com.example.backend.model;


import java.util.List;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Document(collection = "timetable")
public class Timetable {

    @Id
    private String id;

    private String classRef;
    private String className;
    private List<Day> days = defaultDays();
    private Date createdAt = new Date();

    // Default full week days
    private static List<Day> defaultDays() {
        List<String> names = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        List<Day> days = new ArrayList<>();
        for (String name : names) {
            days.add(new Day(name, Slot.defaultSlots()));
        }
        return days;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClassRef() { return classRef; }
    public void setClassRef(String classRef) { this.classRef = classRef; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public List<Day> getDays() { return days; }
    public void setDays(List<Day> days) { this.days = days; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}