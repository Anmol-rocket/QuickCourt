package com.kucp1127.odoohackathon_2025.ChatHandeling.Repositories;

import com.kucp1127.odoohackathon_2025.ChatHandeling.Entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room,Integer> {
    Room findByRoomId(String roomId);
    Room findRoomIdByUser1AndUser2(String user1, String user2);
}
