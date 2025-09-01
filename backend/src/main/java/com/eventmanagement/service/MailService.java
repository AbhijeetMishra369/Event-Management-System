package com.eventmanagement.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {
	private final JavaMailSender mailSender;

	@Value("${spring.mail.username:}")
	private String fromAddress;

	public MailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public void sendPlainText(String to, String subject, String body) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, false);
		helper.setTo(to);
		helper.setFrom(fromAddress);
		helper.setSubject(subject);
		helper.setText(body, false);
		mailSender.send(message);
	}

	public void sendHtml(String to, String subject, String html) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		helper.setTo(to);
		helper.setFrom(fromAddress);
		helper.setSubject(subject);
		helper.setText(html, true);
		mailSender.send(message);
	}
}