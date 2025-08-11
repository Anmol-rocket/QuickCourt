package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Controller;// CommentController.java


import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO.CommentRequest;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Comment;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service.CommentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // CommentController.java (snippet)
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequest req) {
        if (req.rating != null && (req.rating < 1 || req.rating > 5)) {
            return ResponseEntity.badRequest().body("rating must be between 1 and 5");
        }
        Comment comment = new Comment();
        comment.setText(req.text);
        comment.setRating(req.rating);
        comment.setUserEmail(req.authorEmail);
        Comment saved = commentService.addComment(comment, req.sportId);
        return ResponseEntity.ok(saved);
    }


    @GetMapping("/sport/{sportId}")
    public ResponseEntity<?> getCommentsForSport(@PathVariable Long sportId) {
        return ResponseEntity.ok(commentService.getCommentsForSport(sportId));
    }

}
