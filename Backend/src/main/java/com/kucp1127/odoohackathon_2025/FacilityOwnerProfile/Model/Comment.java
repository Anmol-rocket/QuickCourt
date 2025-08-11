package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

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

    private String UserEmail;
    private Long sportId;
    @Column(nullable = true)
    private Integer rating;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
