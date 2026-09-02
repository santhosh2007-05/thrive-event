package com.caretrack.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    private String id;

    @Column(nullable = false)
    private String patientId;

    private String patientName;
    private int patientAge;
    private String doctor;
    private String department;
    private String date;
    private String time;
    private String status; // Upcoming | Confirmed | Missed | Rescheduled Requested
    private String confirmationStatus;
    private int riskScore;
    private String riskLevel;
}
