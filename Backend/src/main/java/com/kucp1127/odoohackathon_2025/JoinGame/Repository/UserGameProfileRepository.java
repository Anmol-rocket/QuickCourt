package com.kucp1127.odoohackathon_2025.JoinGame.Repository;

import com.kucp1127.odoohackathon_2025.JoinGame.Model.UserGameProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserGameProfileRepository extends JpaRepository<UserGameProfile, String> {
    // findById (email) provided by JpaRepository
}
