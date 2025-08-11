package com.kucp1127.odoohackathon_2025.ChatHandeling.Controller;


import com.kucp1127.odoohackathon_2025.ChatHandeling.DataTransferObject.MessageDTO;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Message;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Service.ChatService;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @Autowired
    private RoomService roomService;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@RequestBody MessageDTO messageDTO , @DestinationVariable String roomId){
        return chatService.saveMessage(roomId,messageDTO);
    }
}
