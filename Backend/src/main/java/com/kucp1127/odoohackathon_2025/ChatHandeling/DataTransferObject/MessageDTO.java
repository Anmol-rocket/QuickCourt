package com.kucp1127.odoohackathon_2025.ChatHandeling.DataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private String sender;
    private String content;
}
