package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;// CommentService.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.CommentRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.SportRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.VenueRepository;
import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import com.kucp1127.odoohackathon_2025.UserRegistration.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.*;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final SportRepository sportRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final SportService sportService;

    public CommentService(CommentRepository commentRepository,
                          SportRepository sportRepository,
                          VenueRepository venueRepository,
                          UserRepository userRepository,
                          SportService sportService) {
        this.commentRepository = commentRepository;
        this.sportRepository = sportRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.sportService = sportService;
    }

    @Transactional
    public Comment addComment(Comment comment, String authorEmail, Long sportId, Long venueId, Long parentCommentId) {
        // set author
        UserRegistrationsModel author = userRepository.findById(authorEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + authorEmail));
        comment.setAuthor(author);

        if (parentCommentId != null) {
            Comment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            comment.setParentComment(parent);
            parent.getReplies().add(comment);
        }

        if (sportId != null) {
            Sport sport = sportRepository.findById(sportId).orElseThrow(() -> new IllegalArgumentException("Sport not found"));
            comment.setSport(sport);
            sport.getComments().add(comment);
        } else if (venueId != null) {
            Venue venue = venueRepository.findById(venueId).orElseThrow(() -> new IllegalArgumentException("Venue not found"));
            comment.setVenue(venue);
            venue.getComments().add(comment);
        } else {
            throw new IllegalArgumentException("Either sportId or venueId must be provided.");
        }

        Comment saved = commentRepository.save(comment);

        if (saved.getSport() != null && saved.getSport().getId() != null) {
            sportService.recomputeAverageRating(saved.getSport().getId());
        }
        return saved;
    }

    public List<Comment> getCommentsForSport(Long sportId) {
        return commentRepository.findBySportId(sportId);
    }

    public List<Comment> getReplies(Long commentId) {
        return commentRepository.findByParentCommentId(commentId);
    }

    // delete comment, update comment, etc. can be added here
}
