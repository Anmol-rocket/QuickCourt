package com.kucp1127.odoohackathon_2025.JoinGame.Controller;


import com.kucp1127.odoohackathon_2025.JoinGame.DTO.GameRequest;
import com.kucp1127.odoohackathon_2025.JoinGame.DTO.GameUpdateRequest;
import com.kucp1127.odoohackathon_2025.JoinGame.Model.Game;
import com.kucp1127.odoohackathon_2025.JoinGame.Service.JoinGameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final JoinGameService service;

    public GameController(JoinGameService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Game> create(@RequestBody GameRequest req) {
        Game saved = service.createGame(req);
        return ResponseEntity.created(URI.create("/api/games/" + saved.getId())).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Game>> all() {
        return ResponseEntity.ok(service.getAllGames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getOne(@PathVariable Long id) {
        return service.getGame(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> update(@PathVariable Long id, @RequestBody GameUpdateRequest req) {
        return service.updateGame(id, req).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = service.deleteGame(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // join a game (idempotent)
    @PostMapping("/{id}/join")
    public ResponseEntity<Game> join(@PathVariable Long id, @RequestParam String userEmail) {
        return service.joinGame(userEmail, id)
                .map(g -> ResponseEntity.ok(g))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // leave a game (idempotent)
    @PostMapping("/{id}/leave")
    public ResponseEntity<Game> leave(@PathVariable Long id, @RequestParam String userEmail) {
        return service.leaveGame(userEmail, id)
                .map(g -> ResponseEntity.ok(g))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
