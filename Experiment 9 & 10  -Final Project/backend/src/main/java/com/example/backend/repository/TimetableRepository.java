package com.example.backend.repository;

import com.example.backend.model.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TimetableRepository extends MongoRepository<Timetable, String> {

    // Find timetable by class reference ID
    Optional<Timetable> findByClassRef(String classRef);

    // Find timetable by class name
    Optional<Timetable> findByClassName(String className);
}
