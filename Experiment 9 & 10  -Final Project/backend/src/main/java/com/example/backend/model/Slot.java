package com.example.backend.model;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Slot {
    private String time;
    private String subject = "---";
    private String teacher = "---";
    private String room = "---";

    public Slot() {}
    public Slot(String time) {
        this.time = time;
    }

    public static List<Slot> defaultSlots() {
        List<String> times = Arrays.asList(
                "9:30 AM - 10:20 AM", "10:20 AM - 11:10 AM", "11:10 AM - 12:00 PM",
                "12:00 PM - 12:30 PM", "12:30 PM - 1:20 PM", "1:20 PM - 2:10 PM",
                "2:10 PM - 3:00 PM", "3:10 PM - 4:00 PM", "4:00 PM - 4:20 PM"
        );
        return times.stream().map(Slot::new).collect(Collectors.toList());
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTeacher() { return teacher; }
    public void setTeacher(String teacher) { this.teacher = teacher; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
}
