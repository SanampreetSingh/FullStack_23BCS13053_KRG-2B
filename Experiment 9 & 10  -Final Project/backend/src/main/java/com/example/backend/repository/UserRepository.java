package com.example.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUid(String uid);
    Optional<User> findByPhone(Long phone);
}
