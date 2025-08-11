package com.kucp1127.odoohackathon_2025.JoinGame.Service;

import com.kucp1127.odoohackathon_2025.JoinGame.DTO.GameRequest;
import com.kucp1127.odoohackathon_2025.JoinGame.DTO.GameUpdateRequest;
import com.kucp1127.odoohackathon_2025.JoinGame.Model.Game;
import com.kucp1127.odoohackathon_2025.JoinGame.Model.UserGameProfile;
import com.kucp1127.odoohackathon_2025.JoinGame.Repository.GameRepository;
import com.kucp1127.odoohackathon_2025.JoinGame.Repository.UserGameProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JoinGameService {

    private final GameRepository gameRepository;
    private final UserGameProfileRepository profileRepository;

    public JoinGameService(GameRepository gameRepository, UserGameProfileRepository profileRepository) {
        this.gameRepository = gameRepository;
        this.profileRepository = profileRepository;
    }

    // --- Game CRUD ---

    @Transactional
    public Game createGame(GameRequest req) {
        Game g = new Game();
        g.setGameName(req.gameName);
        g.setLocation(req.location);
        g.setTimeDate(req.timeDate);
        g.setPlayersRequired(req.playersRequired);
        return gameRepository.save(g);
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Optional<Game> getGame(Long id) {
        return gameRepository.findById(id);
    }

    @Transactional
    public Optional<Game> updateGame(Long id, GameUpdateRequest req) {
        return gameRepository.findById(id).map(game -> {
            if (req.gameName != null) game.setGameName(req.gameName);
            if (req.location != null) game.setLocation(req.location);
            if (req.timeDate != null) game.setTimeDate(req.timeDate);
            if (req.playersRequired != null) game.setPlayersRequired(req.playersRequired);
            return gameRepository.save(game);
        });
    }

    @Transactional
    public boolean deleteGame(Long id) {
        Optional<Game> opt = gameRepository.findById(id);
        if (opt.isEmpty()) return false;

        Game game = opt.get();
        // remove this game id from every user's profile who joined
        if (!game.getListOfUserEmailJoined().isEmpty()) {
            List<UserGameProfile> profiles = profileRepository.findAllById(game.getListOfUserEmailJoined());
            Long gameId = game.getId();
            for (UserGameProfile p : profiles) {
                if (p.getIdsOfGamesJoined().remove(gameId)) {
                    profileRepository.save(p);
                }
            }
        }
        gameRepository.deleteById(id);
        return true;
    }

    // --- User profile management (create/get) ---

    @Transactional
    public UserGameProfile createUserProfileIfNotExist(String email) {
        return profileRepository.findById(email).orElseGet(() -> {
            UserGameProfile p = new UserGameProfile();
            p.setUserEmail(email);
            p.setIdsOfGamesJoined(new java.util.HashSet<>());
            return profileRepository.save(p);
        });
    }

    public Optional<UserGameProfile> getUserProfile(String email) {
        return profileRepository.findById(email);
    }

    // --- Join / Leave logic ---

    @Transactional
    public Optional<Game> joinGame(String userEmail, Long gameId) {
        Optional<Game> og = gameRepository.findById(gameId);
        if (og.isEmpty()) return Optional.empty();

        Game game = og.get();

        // check capacity
        int joinedCount = game.getListOfUserEmailJoined().size();
        if (game.getPlayersRequired() > 0 && joinedCount >= game.getPlayersRequired()) {
            // full -> don't add
            return Optional.of(game);
        }

        // idempotent add to game
        if (!game.getListOfUserEmailJoined().contains(userEmail)) {
            game.getListOfUserEmailJoined().add(userEmail);
            game = gameRepository.save(game);
        }

        // ensure profile exists and add id
        UserGameProfile profile = createUserProfileIfNotExist(userEmail);
        if (!profile.getIdsOfGamesJoined().contains(gameId)) {
            profile.getIdsOfGamesJoined().add(gameId);
            profileRepository.save(profile);
        }

        return Optional.of(game);
    }

    @Transactional
    public Optional<Game> leaveGame(String userEmail, Long gameId) {
        Optional<Game> og = gameRepository.findById(gameId);
        if (og.isEmpty()) return Optional.empty();

        Game game = og.get();

        if (game.getListOfUserEmailJoined().removeIf(email -> email.equals(userEmail))) {
            gameRepository.save(game);
        }

        profileRepository.findById(userEmail).ifPresent(profile -> {
            if (profile.getIdsOfGamesJoined().remove(gameId)) {
                profileRepository.save(profile);
            }
        });

        return Optional.of(game);
    }

    public List<Long> getJoinedGameIdsForUser(String userEmail) {
        return profileRepository.findById(userEmail)
                .map(p -> List.copyOf(p.getIdsOfGamesJoined()))
                .orElse(List.of());
    }
}
