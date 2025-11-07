package com.example.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.model.ClassModel;

public interface ClassRepository extends MongoRepository<ClassModel, String> {
    ClassModel findByClassName(String className);
}
