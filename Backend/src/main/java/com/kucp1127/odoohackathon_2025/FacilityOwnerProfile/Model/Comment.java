package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;
    private int upvotes = 0;
    private int downvotes = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_email", nullable = false)
    private UserRegistrationsModel author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    @JsonBackReference("venue-comments")
    private Venue venue;

    // rating is nullable (comment-only vs comment-with-rating)
    @Column(nullable = true)
    private Integer rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id")
    @JsonBackReference("sport-comments")
    private Sport sport;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    @JsonBackReference("comment-replies")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("comment-replies")
    private List<Comment> replies = new ArrayList<>();
}
