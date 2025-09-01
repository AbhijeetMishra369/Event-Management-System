package com.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@CrossOrigin
public class UploadController {
	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("file") MultipartFile file) throws IOException {
		String filename = StringUtils.cleanPath(file.getOriginalFilename());
		String ext = "";
		int idx = filename.lastIndexOf('.');
		if (idx >= 0) ext = filename.substring(idx);
		String stored = UUID.randomUUID().toString() + ext;
		Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
		Files.createDirectories(dir);
		Path target = dir.resolve(stored);
		Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
		String url = "/uploads/" + stored;
		return ResponseEntity.ok(Map.of("url", url));
	}
}