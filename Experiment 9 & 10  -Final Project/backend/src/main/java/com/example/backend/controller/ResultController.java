package com.example.backend.controller;

import com.example.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/result")
@CrossOrigin
public class ResultController {

    @Autowired
    private ResultService resultService;

    // ---------------- Save Results ----------------
    @PostMapping("/save")
    public ResponseEntity<?> saveResults(@RequestBody Map<String, Object> request) {
        String message = resultService.saveResults(
                (String) request.get("classId"),
                (String) request.get("subjectName"),
                (String) request.get("type"),
                (String) request.get("activityName"),
                (Map<String, Object>) request.get("marks")
        );
        return ResponseEntity.ok(Map.of("message", message));
    }

    // ---------------- Get Existing Results ----------------
    @PostMapping("/existing")
    public ResponseEntity<?> getExistingResults(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = resultService.getExistingResults(
                (String) request.get("classId"),
                (String) request.get("type"),
                (String) request.get("subjectName"),
                (String) request.get("activityName")
        );
        return ResponseEntity.ok(result);
    }

    // ---------------- Get Regular Results ----------------
    @GetMapping("/regular")
    public ResponseEntity<?> getRegularResults(@RequestParam String className, @RequestParam String uid) {
        List<Map<String, Object>> results = resultService.getRegularResults(className, uid);
        return ResponseEntity.ok(results);
    }

    // ---------------- Get Semester Results ----------------
    @GetMapping("/semester")
    public ResponseEntity<?> getSemesterResults(@RequestParam String className, @RequestParam String uid) {
        Map<String, Object> results = resultService.getSemesterResults(className, uid);
        return ResponseEntity.ok(results);
    }
}
