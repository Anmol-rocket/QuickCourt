package com.kucp1127.odoohackathon_2025.ChatHandeling.Controller;


import com.kucp1127.odoohackathon_2025.ChatHandeling.DataTransferObject.UserDTO;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Message;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Room;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@RestController
@CrossOrigin("*")
@RequestMapping("/rooms")
public class RoomController {


    @Autowired
    private RoomService roomService;

    // CREATING A ROOM
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody UserDTO userDTO){
        StringBuilder s = new StringBuilder("0000000000000000");
        Random rand = new SecureRandom();
        while(roomService.findByRoomId(String.valueOf(s))!=null){
            s= new StringBuilder();
            for (int i = 0; i < 16; i++) {
                char c = (char) (rand.nextInt(94) + 33);
                s.append(c);
            }
        }
        String user1 = userDTO.getUser1();
        String user2 = userDTO.getUser2();

        if(roomService.getRoomIdByUser1AndUser2(user1,user2)!=null) return ResponseEntity.ok().body("room already exists");
        System.out.println("Room id is :" +  s);
        roomService.createRoom(String.valueOf(s) , user1 , user2);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/message/{roomId}")
    public ResponseEntity<?> getAllMessages(@PathVariable String roomId){
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<Message> messages = room.getMessages();
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/getRoomId")
    public ResponseEntity<?> getRoomIdByUser1AndUser2(@RequestBody UserDTO userDTO){
        String user1 = userDTO.getUser1();
        String user2 = userDTO.getUser2();
        String roomId = roomService.getRoomIdByUser1AndUser2(user1,user2);
        if(roomId!=null) return ResponseEntity.ok(roomId);
        return ResponseEntity.ok().body("room not present");
    }

}
