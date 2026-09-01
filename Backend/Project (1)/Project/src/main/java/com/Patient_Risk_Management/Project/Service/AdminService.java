package com.Patient_Risk_Management.Project.Service;

import com.Patient_Risk_Management.Project.DTO.AdminDTO;

import java.util.List;

public interface AdminService {

    AdminDTO.Response registerAdmin(AdminDTO.RegistrationRequest registrationRequest);

    AdminDTO.Response loginAdmin(AdminDTO.LoginRequest loginRequest);

    AdminDTO getAdminById(Long id);

    AdminDTO getAdminByUsername(String username);

    List<AdminDTO> getAllAdmins();

    AdminDTO updateAdmin(Long id, AdminDTO adminDTO);

    AdminDTO toggleAdminStatus(Long id, boolean isActive);

    void deleteAdmin(Long id);
}
