package com.example.backend.controller;

import com.example.backend.model.ClassModel;
import com.example.backend.model.Timetable;
import com.example.backend.repository.ClassRepository;
import com.example.backend.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class")
@CrossOrigin
public class ClassController {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    // Create Class and automatically create timetable
    @PostMapping("/")
    public ResponseEntity<?> createClass(@RequestBody ClassModel classModel) {
        try {
            if (classModel.getClassName() == null || classModel.getSubjects() == null || classModel.getSubjects().isEmpty()) {
                return ResponseEntity.badRequest().body("Class name and at least one subject are required");
            }

            ClassModel existingClass = classRepository.findByClassName(classModel.getClassName());
            if (existingClass != null) {
                return ResponseEntity.badRequest().body("Class name already exists");
            }

            ClassModel newClass = classRepository.save(classModel);

            // Create default timetable
            Timetable timetable = new Timetable();
            timetable.setClassRef(newClass.getId());
            timetable.setClassName(newClass.getClassName());
            timetableRepository.save(timetable);

            return ResponseEntity.status(201).body(newClass);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }

    // Get all classes
    @GetMapping("/get")
    public ResponseEntity<List<ClassModel>> getClasses() {
        try {
            List<ClassModel> classes = classRepository.findAll();
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Get timetable for a specific class
    @GetMapping("/timetable/{classname}")
    public ResponseEntity<?> getTimetable(@PathVariable String classname) {
        try {
            Timetable timetable = timetableRepository.findByClassName(classname).orElse(null);
            if (timetable == null) {
                return ResponseEntity.status(404).body("Timetable not found");
            }
            return ResponseEntity.ok(timetable);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }

    // Create timetable manually
    @PostMapping("/createtimetable")
    public ResponseEntity<?> createTimetable(@RequestBody Timetable timetable) {
        try {
            if (timetable.getClassRef() == null || timetable.getClassName() == null) {
                return ResponseEntity.badRequest().body("Class reference and name are required");
            }

            Timetable existing = timetableRepository.findByClassRef(timetable.getClassRef()).orElse(null);
            if (existing != null) {
                return ResponseEntity.badRequest().body("Timetable already exists for this class");
            }

            Timetable savedTimetable = timetableRepository.save(timetable);
            return ResponseEntity.status(201).body(savedTimetable);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }

    // Update existing timetable
    @PutMapping("/updatetimetable")
    public ResponseEntity<?> updateTimetable(@RequestBody Timetable timetable) {
        try {
            if (timetable.getClassRef() == null || timetable.getDays() == null || timetable.getDays().isEmpty()) {
                return ResponseEntity.badRequest().body("Class reference and days are required");
            }

            Timetable existing = timetableRepository.findByClassRef(timetable.getClassRef()).orElse(null);
            if (existing == null) {
                return ResponseEntity.status(404).body("Timetable not found for this class");
            }

            existing.setDays(timetable.getDays());
            timetableRepository.save(existing);

            return ResponseEntity.ok(existing);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }

    // Get class details by admin
    @GetMapping("/admin/{classId}")
    public ResponseEntity<?> getClassAdmin(@PathVariable String classId) {
        try {
            ClassModel classModel = classRepository.findById(classId).orElse(null);
            if (classModel == null) {
                return ResponseEntity.status(404).body("Class not found");
            }
            return ResponseEntity.ok(classModel);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong. Please try again.");
        }
    }
}
