package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
    public String text;
    public String authorEmail;
    public Integer rating; // optional 1-5
    public Long sportId;   // optional (comment on sport)
    public Long venueId;   // optional (comment on venue)
    public Long parentCommentId; // optional (reply)
}
