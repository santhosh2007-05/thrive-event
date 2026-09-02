package com.caretrack.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transport_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransportRequest {

    @Id
    private String id;

    @Column(nullable = false)
    private String patientId;

    private String patientName;
    private String phone;
    private String address;
    private double distanceKm;
    private String requestedDate;
    private String requestedTime;
    private String status; // Pending | Accepted | Paid
    private double fareAmount;
    private String driverName;
    private String driverPhone;
    private String paymentId;
    private String paidAt;
    private String notes;
}
