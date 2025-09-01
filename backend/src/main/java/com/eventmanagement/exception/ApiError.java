package com.eventmanagement.exception;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;

public class ApiError {
	private Instant timestamp = Instant.now();
	private int status;
	private String error;
	private String message;
	private String path;
	private List<String> details;

	public ApiError() {}

	public ApiError(HttpStatus status, String message, String path) {
		this.status = status.value();
		this.error = status.getReasonPhrase();
		this.message = message;
		this.path = path;
	}

	public ApiError(HttpStatus status, String message, String path, List<String> details) {
		this(status, message, path);
		this.details = details;
	}

	public Instant getTimestamp() { return timestamp; }
	public int getStatus() { return status; }
	public String getError() { return error; }
	public String getMessage() { return message; }
	public String getPath() { return path; }
	public List<String> getDetails() { return details; }

	public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
	public void setStatus(int status) { this.status = status; }
	public void setError(String error) { this.error = error; }
	public void setMessage(String message) { this.message = message; }
	public void setPath(String path) { this.path = path; }
	public void setDetails(List<String> details) { this.details = details; }
}