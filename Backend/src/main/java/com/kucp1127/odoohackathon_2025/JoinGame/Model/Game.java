package com.kucp1127.odoohackathon_2025.JoinGame.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gameName;
    private String location;
    private LocalDateTime timeDate;
    private String venue;
    private int playersRequired;
    @ElementCollection
    private List<String> listOfUserEmailJoined = new ArrayList<>();
}