package com.eventmanagement.repository;

import com.eventmanagement.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("{'role': ?0}")
    List<User> findByRole(User.UserRole role);
    
    @Query("{'enabled': true}")
    List<User> findActiveUsers();
    
    @Query("{'emailVerified': true}")
    List<User> findVerifiedUsers();
    
    @Query("{'createdAt': {$gte: ?0}}")
    List<User> findUsersCreatedAfter(java.time.LocalDateTime date);
}