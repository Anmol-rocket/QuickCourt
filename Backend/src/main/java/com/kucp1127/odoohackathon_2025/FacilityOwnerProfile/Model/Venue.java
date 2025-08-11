package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String description;
    private String address;
    private boolean isVerified;
    @ElementCollection
    private List<String> photoUrls = new ArrayList<>();

    @ElementCollection
    private List<String> amenities = new ArrayList<>();

    @Column(nullable = true)
    private Integer rating;
    private String ownerMail;

    private List<Long> SportIds;

}
