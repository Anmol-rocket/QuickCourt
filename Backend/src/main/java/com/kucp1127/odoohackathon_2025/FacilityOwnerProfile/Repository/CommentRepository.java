package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Comment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findBySportId(Long sportId);
    List<Comment> findBySportIdAndRatingIsNotNull(Long sportId);
    List<Comment> findByParentCommentId(Long parentId);
    List<Comment> findByVenueId(Long venueId);
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.sport.id = :sportId AND c.rating IS NOT NULL")
    Double findAverageRatingBySportId(@Param("sportId") Long sportId);
}