package com.example.backend.model;

import java.util.List;

public class Day {
    private String name;
    private List<Slot> slots;

    public Day() {}
    public Day(String name, List<Slot> slots) {
        this.name = name;
        this.slots = slots;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Slot> getSlots() { return slots; }
    public void setSlots(List<Slot> slots) { this.slots = slots; }
}