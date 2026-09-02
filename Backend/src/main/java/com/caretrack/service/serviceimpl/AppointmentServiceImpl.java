package com.caretrack.service.serviceimpl;

import com.caretrack.model.Appointment;
import com.caretrack.repository.AppointmentRepository;
import com.caretrack.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    @Override
    public Appointment confirmAppointment(String id) {
        Appointment apt = appointmentRepository.findById(id).orElseThrow();
        apt.setStatus("Confirmed");
        apt.setConfirmationStatus("Confirmed");
        return appointmentRepository.save(apt);
    }

    @Override
    public Appointment rescheduleAppointment(String id, String newDate, String reason) {
        Appointment apt = appointmentRepository.findById(id).orElseThrow();
        apt.setDate(newDate);
        apt.setStatus("Rescheduled Requested");
        return appointmentRepository.save(apt);
    }
}
