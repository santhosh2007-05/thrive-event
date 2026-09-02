package com.caretrack.repository;

import com.caretrack.model.TransportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRequestRepository extends JpaRepository<TransportRequest, String> {
    List<TransportRequest> findByPatientId(String patientId);
    List<TransportRequest> findByStatus(String status);
}
