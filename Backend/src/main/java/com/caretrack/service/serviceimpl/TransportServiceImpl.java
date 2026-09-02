package com.caretrack.service.serviceimpl;

import com.caretrack.model.TransportRequest;
import com.caretrack.repository.TransportRequestRepository;
import com.caretrack.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransportServiceImpl implements TransportService {

    @Autowired
    private TransportRequestRepository repository;

    @Override
    public List<TransportRequest> getAllRequests() {
        return repository.findAll();
    }

    @Override
    public List<TransportRequest> getRequestsByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

    @Override
    public TransportRequest createRequest(TransportRequest request) {
        request.setStatus("Pending");
        return repository.save(request);
    }

    @Override
    public TransportRequest approveRequest(String id, double fareAmount, String driverDetails) {
        TransportRequest req = repository.findById(id).orElseThrow();
        req.setStatus("Accepted");
        req.setFareAmount(fareAmount);
        req.setDriverName(driverDetails);
        return repository.save(req);
    }

    @Override
    public TransportRequest payRequest(String id, String paymentId) {
        TransportRequest req = repository.findById(id).orElseThrow();
        req.setStatus("Paid");
        req.setPaymentId(paymentId);
        return repository.save(req);
    }
}
