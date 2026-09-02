package com.caretrack.service;

import com.caretrack.model.TransportRequest;

import java.util.List;

public interface TransportService {
    List<TransportRequest> getAllRequests();
    List<TransportRequest> getRequestsByPatientId(String patientId);
    TransportRequest createRequest(TransportRequest request);
    TransportRequest approveRequest(String id, double fareAmount, String driverDetails);
    TransportRequest payRequest(String id, String paymentId);
}
