package com.caretrack.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String patientId;
    private String patientName;
    private String title;
    private String message;
    private String severity; // danger | warning | info
    private String category; // High Risk | Missed Follow-up | Clinical Alert
    private String timestamp;
    private boolean isRead;
    private String actionRequired;
}
