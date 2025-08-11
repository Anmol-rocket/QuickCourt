package com.kucp1127.odoohackathon_2025.JoinGame.Repository;

import com.kucp1127.odoohackathon_2025.JoinGame.Model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    // extra queries can be added later
}
