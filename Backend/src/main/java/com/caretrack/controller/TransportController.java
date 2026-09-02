package com.caretrack.controller;

import com.caretrack.model.TransportRequest;
import com.caretrack.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport")
@CrossOrigin(origins = "*")
public class TransportController {

    @Autowired
    private TransportService transportService;

    @GetMapping
    public ResponseEntity<List<TransportRequest>> getAllRequests() {
        return ResponseEntity.ok(transportService.getAllRequests());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<TransportRequest>> getRequestsByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(transportService.getRequestsByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<TransportRequest> createRequest(@RequestBody TransportRequest request) {
        return ResponseEntity.ok(transportService.createRequest(request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<TransportRequest> approveRequest(
            @PathVariable String id,
            @RequestParam double fareAmount,
            @RequestParam String driverDetails) {
        return ResponseEntity.ok(transportService.approveRequest(id, fareAmount, driverDetails));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<TransportRequest> payRequest(
            @PathVariable String id,
            @RequestParam String paymentId) {
        return ResponseEntity.ok(transportService.payRequest(id, paymentId));
    }
}
