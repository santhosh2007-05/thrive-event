package com.caretrack.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private int age;
    private String gender;

    @Column(nullable = false)
    private String phone;

    private String password;
    private String address;
    private double distanceKm;
    private String department;
    private String assignedDoctor;
    private String assignedNurse;
    private String status;
    private String preferredComm;
    private String lastVisitDate;
    private String nextFollowUpDate;
    private String nextFollowUpTime;
    private int missedAppointmentsCount;
    private int totalAppointments;
    private int appointmentFrequencyDays;
    private int treatmentDurationMonths;
}
