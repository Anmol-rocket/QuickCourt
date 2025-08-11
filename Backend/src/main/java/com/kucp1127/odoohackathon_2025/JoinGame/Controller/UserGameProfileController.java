package com.kucp1127.odoohackathon_2025.JoinGame.Controller;

import com.kucp1127.odoohackathon_2025.JoinGame.Model.UserGameProfile;
import com.kucp1127.odoohackathon_2025.JoinGame.Service.JoinGameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/user-profiles")
public class UserGameProfileController {

    private final JoinGameService service;

    public UserGameProfileController(JoinGameService service) {
        this.service = service;
    }

    @PostMapping("/{email}")
    public ResponseEntity<UserGameProfile> createProfile(@PathVariable String email) {
        UserGameProfile created = service.createUserProfileIfNotExist(email);
        return ResponseEntity.created(URI.create("/api/user-profiles/" + created.getUserEmail())).body(created);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserGameProfile> getProfile(@PathVariable String email) {
        return service.getUserProfile(email).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{email}/game-ids")
    public ResponseEntity<List<Long>> getJoinedIds(@PathVariable String email) {
        return ResponseEntity.ok(service.getJoinedGameIdsForUser(email));
    }
}
