package com.caretrack.service;

import com.caretrack.model.Appointment;

import java.util.List;

public interface AppointmentService {
    List<Appointment> getAllAppointments();
    List<Appointment> getAppointmentsByPatientId(String patientId);
    List<Appointment> getAppointmentsByStatus(String status);
    Appointment confirmAppointment(String id);
    Appointment rescheduleAppointment(String id, String newDate, String reason);
}
