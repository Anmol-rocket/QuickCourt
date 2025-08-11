package com.kucp1127.odoohackathon_2025.ChatHandeling.Entities;


import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Message {
    private String sender;
    private String content;
    private LocalDateTime timeStamp = LocalDateTime.now();
}
