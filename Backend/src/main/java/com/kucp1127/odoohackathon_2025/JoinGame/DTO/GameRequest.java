package com.kucp1127.odoohackathon_2025.JoinGame.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameRequest {
    public String gameName;
    public String location;
    public String venue;
    public LocalDateTime timeDate;
    public int playersRequired;
}
