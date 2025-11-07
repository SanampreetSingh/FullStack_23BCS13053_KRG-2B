package com.example.backend.service;

import com.example.backend.model.ClassModel;
import com.example.backend.model.Timetable;
import com.example.backend.repository.ClassRepository;
import com.example.backend.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    // ✅ Create class and timetable
    public Map<String, Object> createClass(ClassModel classModel) {
        Map<String, Object> response = new HashMap<>();

        if (classModel.getClassName() == null || classModel.getSubjects() == null || classModel.getSubjects().isEmpty()) {
            response.put("message", "Class name and at least one subject are required");
            return response;
        }

        if (classRepository.findByClassName(classModel.getClassName()) != null) {
            response.put("message", "Class name already exists");
            return response;
        }

        // Save class
        ClassModel newClass = classRepository.save(classModel);

        // Create default timetable
        Timetable timetable = new Timetable();
        timetable.setClassRef(newClass.getId());
        timetable.setClassName(newClass.getClassName());
        timetableRepository.save(timetable);

        response.put("message", "Class and timetable created successfully");
        response.put("class", newClass);
        response.put("timetable", timetable);

        return response;
    }

    // ✅ Get all classes (for dropdown)
    public List<ClassModel> getClasses() {
        return classRepository.findAll();
    }

    // ✅ Get class by ID (admin view)
    public Optional<ClassModel> getClassById(String id) {
        return classRepository.findById(id);
    }

    // ✅ Get timetable by class name
    public Optional<Timetable> getTimetableByClassName(String className) {
        return timetableRepository.findByClassName(className);
    }

    // ✅ Create timetable manually
    public Map<String, Object> createTimetable(Timetable timetable) {
        Map<String, Object> response = new HashMap<>();

        if (timetable.getClassRef() == null || timetable.getClassName() == null) {
            response.put("message", "Class reference and name are required");
            return response;
        }

        if (timetableRepository.findByClassRef(timetable.getClassRef()).isPresent()) {
            response.put("message", "Timetable already exists for this class");
            return response;
        }

        Timetable newTimetable = timetableRepository.save(timetable);
        response.put("message", "Timetable created successfully");
        response.put("timetable", newTimetable);

        return response;
    }

    // ✅ Update timetable
    public Map<String, Object> updateTimetable(Timetable timetable) {
        Map<String, Object> response = new HashMap<>();

        if (timetable.getClassRef() == null || timetable.getDays() == null || timetable.getDays().isEmpty()) {
            response.put("message", "Class reference and days are required");
            return response;
        }

        Optional<Timetable> existingTimetable = timetableRepository.findByClassRef(timetable.getClassRef());
        if (existingTimetable.isEmpty()) {
            response.put("message", "Timetable not found for this class");
            return response;
        }

        Timetable tt = existingTimetable.get();
        tt.setDays(timetable.getDays());
        timetableRepository.save(tt);

        response.put("message", "Timetable updated successfully");
        response.put("timetable", tt);

        return response;
    }
}
