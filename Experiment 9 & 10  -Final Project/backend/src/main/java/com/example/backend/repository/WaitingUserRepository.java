package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.model.WaitingUser;

import java.util.Optional;

public interface WaitingUserRepository extends MongoRepository<WaitingUser, String> {
    Optional<WaitingUser> findByEmail(String email);
    Optional<WaitingUser> findByUid(String uid);
}
