package com.kucp1127.odoohackathon_2025.ChatHandeling.Service;

import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Room;
import com.kucp1127.odoohackathon_2025.ChatHandeling.Repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    RoomRepository roomRepository;

    public Room findByRoomId(String roomId){
        return roomRepository.findByRoomId(roomId);
    }

    public void createRoom(String roomId , String user1 , String user2) {
        Room room = new Room();
        room.setRoomId(roomId);
        room.setUser1(user1);
        room.setUser2(user2);
        roomRepository.save(room);
    }

    public Object getMessagesByRoomId(String roomId) {
        return roomRepository.findByRoomId(roomId).getMessages();
    }

    public String getRoomIdByUser1AndUser2(String User1 , String User2){
        Room room = roomRepository.findRoomIdByUser1AndUser2(User1, User2);
        if (room == null) {
            room = roomRepository.findRoomIdByUser1AndUser2(User2, User1);
        }
        if (room == null) return null;
        return room.getRoomId();
    }

    public void save(Room room) {
        roomRepository.save(room);
    }
}
