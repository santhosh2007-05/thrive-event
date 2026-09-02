package com.caretrack.service.serviceimpl;

import com.caretrack.model.Patient;
import com.caretrack.repository.PatientRepository;
import com.caretrack.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    @Override
    public Optional<Patient> getPatientByPhone(String phone) {
        return patientRepository.findByPhone(phone);
    }

    @Override
    public Patient registerPatient(Patient patient) {
        if (patient.getId() == null || patient.getId().isEmpty()) {
            long count = patientRepository.count();
            patient.setId("P-" + (1001 + count));
        }
        return patientRepository.save(patient);
    }

    @Override
    public boolean validatePatientPassword(String usernameOrIdOrPhone, String password) {
        Optional<Patient> patientOpt = patientRepository.findById(usernameOrIdOrPhone);
        if (patientOpt.isEmpty()) {
            patientOpt = patientRepository.findByPhone(usernameOrIdOrPhone);
        }

        if (patientOpt.isPresent()) {
            Patient p = patientOpt.get();
            // Strict exact match against the password entered during registration!
            return p.getPassword() != null && p.getPassword().equals(password);
        }
        return false;
    }
}
