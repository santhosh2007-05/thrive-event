package com.Patient_Risk_Management.Project.Controller;

import com.Patient_Risk_Management.Project.DTO.AdminDTO;
import com.Patient_Risk_Management.Project.Service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<AdminDTO.Response> registerAdmin(@Valid @RequestBody AdminDTO.RegistrationRequest registrationRequest) {
        AdminDTO.Response response = adminService.registerAdmin(registrationRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AdminDTO.Response> loginAdmin(@Valid @RequestBody AdminDTO.LoginRequest loginRequest) {
        AdminDTO.Response response = adminService.loginAdmin(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminDTO> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Long id) {
        AdminDTO admin = adminService.getAdminById(id);
        return ResponseEntity.ok(admin);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<AdminDTO> getAdminByUsername(@PathVariable String username) {
        AdminDTO admin = adminService.getAdminByUsername(username);
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long id, @RequestBody AdminDTO adminDTO) {
        AdminDTO updatedAdmin = adminService.updateAdmin(id, adminDTO);
        return ResponseEntity.ok(updatedAdmin);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminDTO> toggleAdminStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        AdminDTO updatedAdmin = adminService.toggleAdminStatus(id, isActive);
        return ResponseEntity.ok(updatedAdmin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin with ID " + id + " deleted successfully");
        return ResponseEntity.ok(response);
    }
}
