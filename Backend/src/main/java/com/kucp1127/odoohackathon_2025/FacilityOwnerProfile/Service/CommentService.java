package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;// CommentService.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.CommentRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.SportRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.VenueRepository;
import com.kucp1127.odoohackathon_2025.UserRegistration.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.*;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final SportRepository sportRepository;

    public CommentService(CommentRepository commentRepository,
                          SportRepository sportRepository,
                          VenueRepository venueRepository,
                          UserRepository userRepository,
                          SportService sportService) {
        this.commentRepository = commentRepository;
        this.sportRepository = sportRepository;
    }

    @Transactional
    public Comment addComment(Comment comment,  Long sportId) {
        Comment newComment = commentRepository.save(comment);
        Optional<Sport> sport = sportRepository.findById(sportId);
        if(sport.isPresent()){
            sport.get().getCommentIds().add(newComment.getId());
            int size = sport.get().getCommentIds().size();
            double rating = sport.get().getAverageRating();
            rating*=(size-1);
            rating+=(comment.getRating());
            rating/=size;
            sport.get().setAverageRating(rating);
            sportRepository.save(sport.get());
        }
        return newComment;
    }

    public Optional<List<Comment>> getCommentsForSport(Long sportId) {
        return commentRepository.findBySportId(sportId);
    }

}
