package com.kucp1127.odoohackathon_2025.UserRegistration.Repository;

import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserRegistrationsModel, String> {

    Optional<UserRegistrationsModel> findByEmail(String email);
}