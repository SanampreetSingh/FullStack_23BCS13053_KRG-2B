package com.example.backend.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.ClassModel;
import com.example.backend.model.Result;
import com.example.backend.repository.ClassRepository;
import com.example.backend.repository.ResultRepository;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ClassRepository classRepository;

    // ---------------- Save or Update Results ----------------
    public String saveResults(String classId, String subjectName, String type, String activityName, Map<String, Object> marks) {

        if (classId == null || subjectName == null || type == null || marks == null) {
            return "Missing or invalid fields";
        }

        if ("Regular".equalsIgnoreCase(type)) {
            if (activityName == null) return "activityName required for Regular type";

            Result result = resultRepository
                    .findByClassIdAndSubjectNameAndTypeAndActivityName(classId, subjectName, type, activityName)
                    .orElse(new Result());

            result.setClassId(classId);
            result.setSubjectName(subjectName);
            result.setType(type);
            result.setActivityName(activityName);
            result.setMarks(marks);
            result.setUpdatedAt(new Date());

            resultRepository.save(result);
            return "Regular results saved successfully";

        } else if ("Semester".equalsIgnoreCase(type)) {
            if (!marks.containsKey("internal") || !marks.containsKey("external")) {
                return "Missing internal or external marks";
            }

            Result result = resultRepository
                    .findByClassIdAndSubjectNameAndType(classId, subjectName, type)
                    .orElse(new Result());

            result.setClassId(classId);
            result.setSubjectName(subjectName);
            result.setType(type);
            result.setMarks(marks);
            result.setUpdatedAt(new Date());

            resultRepository.save(result);
            return "Semester results saved successfully";

        } else {
            return "Invalid type provided";
        }
    }

    // ---------------- Fetch Existing Results ----------------
    public Map<String, Object> getExistingResults(String classId, String type, String subjectName, String activityName) {

        Map<String, Object> response = new HashMap<>();

        if (classId == null || type == null || subjectName == null) {
            response.put("message", "Missing required query parameters");
            return response;
        }

        Result result;

        if ("Regular".equalsIgnoreCase(type) && activityName != null) {
            result = resultRepository.findByClassIdAndSubjectNameAndTypeAndActivityName(classId, subjectName, type, activityName).orElse(null);
        } else {
            result = resultRepository.findByClassIdAndSubjectNameAndType(classId, subjectName, type).orElse(null);
        }

        if (result == null) {
            response.put("existing", false);
            response.put("message", "No existing result data found.");
            return response;
        }

        response.put("existing", true);
        Map<String, Object> resultsMap = new HashMap<>();
        resultsMap.put("type", type);
        resultsMap.put("subjectName", subjectName);

        if ("Regular".equalsIgnoreCase(type)) {
            resultsMap.put("activityName", result.getActivityName());
            resultsMap.put("marks", result.getMarks());
        } else if ("Semester".equalsIgnoreCase(type)) {
            Map<String, Object> marks = result.getMarks();
            resultsMap.put("internal", marks != null ? marks.get("internal") : new HashMap<>());
            resultsMap.put("external", marks != null ? marks.get("external") : new HashMap<>());
        }

        response.put("results", resultsMap);
        return response;
    }

    // ---------------- Helper: Grade Calculation ----------------
    private String calculateGrade(int total) {
        if (total >= 90) return "A+";
        if (total >= 80) return "A";
        if (total >= 70) return "B+";
        if (total >= 60) return "B";
        if (total >= 50) return "C+";
        if (total >= 40) return "C";
        return "F";
    }

    private String calculateSGPA(List<Map<String, Object>> subjects) {
        double totalPoints = 0;
        int totalCredits = 0;

        for (Map<String, Object> s : subjects) {
            String type = (String) s.get("type");
            if ("Non-Graded".equalsIgnoreCase(type)) continue;

            int credits = (int) s.getOrDefault("credits", 0);
            String grade = (String) s.getOrDefault("grade", "F");
            int points;
            switch (grade) {
                case "A+": points = 10; break;
                case "A": points = 9; break;
                case "B+": points = 8; break;
                case "B": points = 7; break;
                case "C+": points = 6; break;
                case "C": points = 5; break;
                default: points = 0; break;
            }
            totalPoints += points * credits;
            totalCredits += credits;
        }

        return totalCredits > 0 ? String.format("%.2f", totalPoints / totalCredits) : "0.00";
    }

    // ---------------- Fetch Regular Results (Student) ----------------
    public List<Map<String, Object>> getRegularResults(String className, String uid) {
        ClassModel classModel = classRepository.findByClassName(className);
        if (classModel == null) return null;

        List<Result> results = resultRepository.findByClassIdAndType(classModel.getId(), "Regular");
        Map<String, List<Map<String, Object>>> data = new HashMap<>();

        for (Result r : results) {
            Object studentMarks = r.getMarks() != null ? r.getMarks().get(uid) : null;
            if (studentMarks == null) continue;

            data.computeIfAbsent(r.getSubjectName(), k -> new ArrayList<>());
            Map<String, Object> activity = new HashMap<>();
            activity.put("activityName", r.getActivityName() != null ? r.getActivityName() : "N/A");
            activity.put("marks", studentMarks);

            // Determine total marks for this activity from the class definition if available
            int total = 10; // default
            try {
                if (classModel != null && classModel.getSubjects() != null) {
                    for (ClassModel.Subject subj : classModel.getSubjects()) {
                        if (subj.getName() != null && subj.getName().equalsIgnoreCase(r.getSubjectName())) {
                            if (subj.getActivities() != null) {
                                for (ClassModel.Activity act : subj.getActivities()) {
                                    if (act.getName() != null && act.getName().equalsIgnoreCase(r.getActivityName())) {
                                        total = act.getTotal();
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            } catch (Exception ignore) {
                // keep default total
            }

            activity.put("total", total);
            data.get(r.getSubjectName()).add(activity);
        }

        List<Map<String, Object>> formatted = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : data.entrySet()) {
            Map<String, Object> subjectMap = new HashMap<>();
            subjectMap.put("subjectName", entry.getKey());
            subjectMap.put("activities", entry.getValue());
            formatted.add(subjectMap);
        }
        return formatted;
    }

    // ---------------- Fetch Semester Results (Student) ----------------
    public Map<String, Object> getSemesterResults(String className, String uid) {
        Map<String, Object> response = new HashMap<>();
        ClassModel classModel = classRepository.findByClassName(className);
        if (classModel == null) return null;

        List<Result> results = resultRepository.findByClassIdAndType(classModel.getId(), "Semester");

        List<Map<String, Object>> subjectsList = new ArrayList<>();

        for (ClassModel.Subject subject : classModel.getSubjects()) {
            Map<String, Object> subjectMap = new HashMap<>();
            subjectMap.put("subjectName", subject.getName());
            subjectMap.put("type", subject.getType());
            subjectMap.put("credits", subject.getCredits() != null ? subject.getCredits() : 0);

            Result subjectResult = results.stream()
                    .filter(r -> r.getSubjectName().equalsIgnoreCase(subject.getName()))
                    .findFirst().orElse(null);

            String internal = "---";
            String external = "---";
            String grade = "---";

            if (subjectResult != null && subjectResult.getMarks() != null) {
                Map<String, Object> marks = subjectResult.getMarks();
                Map<String, Object> internalMarks = (Map<String, Object>) marks.get("internal");
                Map<String, Object> externalMarks = (Map<String, Object>) marks.get("external");

                if (internalMarks != null && internalMarks.get(uid) != null) internal = String.valueOf(internalMarks.get(uid));
                if (externalMarks != null && externalMarks.get(uid) != null) external = String.valueOf(externalMarks.get(uid));

                if (!internal.equals("---") && !external.equals("---")) {
                    int total = Integer.parseInt(internal) + Integer.parseInt(external);
                    grade = calculateGrade(total);
                }
            }

            subjectMap.put("internal", internal);
            subjectMap.put("external", external);
            subjectMap.put("grade", grade);
            subjectsList.add(subjectMap);
        }

        String sgpa = calculateSGPA(subjectsList);
        response.put("subjects", subjectsList);
        response.put("sgpa", sgpa);
        return response;
    }
}
