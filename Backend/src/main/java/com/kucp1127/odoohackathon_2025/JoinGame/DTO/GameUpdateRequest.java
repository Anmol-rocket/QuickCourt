package com.kucp1127.odoohackathon_2025.JoinGame.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameUpdateRequest {
    public String gameName;
    public String location;

    public LocalDateTime timeDate;
    public Integer playersRequired; // Integer so null means "no change"
}
