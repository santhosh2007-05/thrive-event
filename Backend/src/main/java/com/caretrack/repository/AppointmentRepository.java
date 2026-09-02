package com.caretrack.repository;

import com.caretrack.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByRiskLevel(String riskLevel);
}
