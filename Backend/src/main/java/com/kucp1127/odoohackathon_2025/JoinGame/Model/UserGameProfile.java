package com.kucp1127.odoohackathon_2025.JoinGame.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserGameProfile {
    @Id
    private String userEmail;
    @ElementCollection
    private Set<Long> idsOfGamesJoined = new HashSet<>();
}