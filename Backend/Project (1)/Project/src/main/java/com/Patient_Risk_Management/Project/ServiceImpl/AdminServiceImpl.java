package com.Patient_Risk_Management.Project.ServiceImpl;

import com.Patient_Risk_Management.Project.DTO.AdminDTO;
import com.Patient_Risk_Management.Project.Exception.AdminException;
import com.Patient_Risk_Management.Project.Model.Admin;
import com.Patient_Risk_Management.Project.Repository.AdminRepository;
import com.Patient_Risk_Management.Project.Service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    public AdminDTO.Response registerAdmin(AdminDTO.RegistrationRequest registrationRequest) {
        if (adminRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new AdminException("Admin with username '" + registrationRequest.getUsername() + "' already exists", HttpStatus.CONFLICT);
        }

        if (adminRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new AdminException("Admin with email '" + registrationRequest.getEmail() + "' already exists", HttpStatus.CONFLICT);
        }

        Admin admin = Admin.builder()
                .username(registrationRequest.getUsername())
                .email(registrationRequest.getEmail())
                .password(registrationRequest.getPassword())
                .fullName(registrationRequest.getFullName())
                .role("ROLE_ADMIN")
                .isActive(true)
                .build();

        Admin savedAdmin = adminRepository.save(admin);

        return AdminDTO.Response.builder()
                .id(savedAdmin.getId())
                .username(savedAdmin.getUsername())
                .email(savedAdmin.getEmail())
                .fullName(savedAdmin.getFullName())
                .role(savedAdmin.getRole())
                .isActive(savedAdmin.getIsActive())
                .createdAt(savedAdmin.getCreatedAt())
                .updatedAt(savedAdmin.getUpdatedAt())
                .message("Admin registered successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDTO.Response loginAdmin(AdminDTO.LoginRequest loginRequest) {
        Admin admin = adminRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new AdminException("Invalid username/email or password", HttpStatus.UNAUTHORIZED));

        if (!admin.getIsActive()) {
            throw new AdminException("Admin account is deactivated. Please contact system administrator.", HttpStatus.FORBIDDEN);
        }

        if (!admin.getPassword().equals(loginRequest.getPassword())) {
            throw new AdminException("Invalid username/email or password", HttpStatus.UNAUTHORIZED);
        }

        return AdminDTO.Response.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .role(admin.getRole())
                .isActive(admin.getIsActive())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .message("Admin logged in successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with ID: " + id, HttpStatus.NOT_FOUND));

        return mapToDTO(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDTO getAdminByUsername(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new AdminException("Admin not found with username: " + username, HttpStatus.NOT_FOUND));

        return mapToDTO(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public AdminDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with ID: " + id, HttpStatus.NOT_FOUND));

        if (adminDTO.getUsername() != null && !adminDTO.getUsername().equals(existingAdmin.getUsername())) {
            if (adminRepository.existsByUsername(adminDTO.getUsername())) {
                throw new AdminException("Username '" + adminDTO.getUsername() + "' is already taken", HttpStatus.CONFLICT);
            }
            existingAdmin.setUsername(adminDTO.getUsername());
        }

        if (adminDTO.getEmail() != null && !adminDTO.getEmail().equals(existingAdmin.getEmail())) {
            if (adminRepository.existsByEmail(adminDTO.getEmail())) {
                throw new AdminException("Email '" + adminDTO.getEmail() + "' is already registered", HttpStatus.CONFLICT);
            }
            existingAdmin.setEmail(adminDTO.getEmail());
        }

        if (adminDTO.getFullName() != null) {
            existingAdmin.setFullName(adminDTO.getFullName());
        }

        if (adminDTO.getPassword() != null && !adminDTO.getPassword().isBlank()) {
            existingAdmin.setPassword(adminDTO.getPassword());
        }

        Admin updatedAdmin = adminRepository.save(existingAdmin);
        return mapToDTO(updatedAdmin);
    }

    @Override
    public AdminDTO toggleAdminStatus(Long id, boolean isActive) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with ID: " + id, HttpStatus.NOT_FOUND));

        admin.setIsActive(isActive);
        Admin savedAdmin = adminRepository.save(admin);
        return mapToDTO(savedAdmin);
    }

    @Override
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new AdminException("Admin not found with ID: " + id, HttpStatus.NOT_FOUND);
        }
        adminRepository.deleteById(id);
    }

    private AdminDTO mapToDTO(Admin admin) {
        return AdminDTO.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .role(admin.getRole())
                .isActive(admin.getIsActive())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .build();
    }
}
