package com.Patient_Risk_Management.Project.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AdminException extends RuntimeException {

    private final HttpStatus status;

    public AdminException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public AdminException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
