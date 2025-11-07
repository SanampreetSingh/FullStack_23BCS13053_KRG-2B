package com.example.backend.repository;

import com.example.backend.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends MongoRepository<Result, String> {

    // Find all results for a specific class
    List<Result> findByClassId(String classId);

    // Find all results for a class and type (Regular or Semester)
    List<Result> findByClassIdAndType(String classId, String type);

    // Find by class + subject + type
    Optional<Result> findByClassIdAndSubjectNameAndType(String classId, String subjectName, String type);

    // Find by class + subject + type + activity (used for Regular type)
    Optional<Result> findByClassIdAndSubjectNameAndTypeAndActivityName(String classId, String subjectName, String type, String activityName);
}
