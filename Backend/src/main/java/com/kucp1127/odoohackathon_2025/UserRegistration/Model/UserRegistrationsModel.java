package com.kucp1127.odoohackathon_2025.UserRegistration.Model;

import com.kucp1127.odoohackathon_2025.UserRegistration.ENUM.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "users")
public class UserRegistrationsModel {
    @Id
    private String email;
    private String password;
    private String fullName;
    private String avatarUrl;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Boolean verified;
}