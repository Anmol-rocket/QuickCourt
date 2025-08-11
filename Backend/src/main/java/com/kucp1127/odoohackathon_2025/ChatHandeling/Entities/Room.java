package com.kucp1127.odoohackathon_2025.ChatHandeling.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String roomId;
    @ElementCollection
    private List<Message> messages = new ArrayList<>();
    private String user1;
    private String user2;
}
