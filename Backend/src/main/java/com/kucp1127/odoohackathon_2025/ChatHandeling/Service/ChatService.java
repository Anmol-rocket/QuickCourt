package com.kucp1127.odoohackathon_2025.ChatHandeling.Service;


import com.kucp1127.odoohackathon_2025.ChatHandeling.DataTransferObject.MessageDTO;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Message;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Room;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatService {

    @Autowired
    RoomService roomService;

    @Transactional
    public Message saveMessage(String roomId, MessageDTO messageDTO) {
        Room room = roomService.findByRoomId(roomId);
        if(room!=null){
            Message message = new Message();
            message.setContent(messageDTO.getContent());
            message.setSender(messageDTO.getSender());
            message.setTimeStamp(LocalDateTime.now());
            room.getMessages().add(message);
            roomService.save(room);
            return message;
        }
        return null;
    }
}
