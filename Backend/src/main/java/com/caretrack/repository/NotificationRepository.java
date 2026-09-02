package com.caretrack.repository;

import com.caretrack.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByPatientId(String patientId);
    List<Notification> findByCategory(String category);
}
