package com.eventmanagement.service;

import com.eventmanagement.model.Ticket;
import com.eventmanagement.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTicketConfirmationEmail(User user, Ticket ticket, byte[] qrCodeBytes) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Your Ticket for " + ticket.getEventName());

            String htmlContent = "<html>"
                + "<body>"
                + "<h1>Thank you for your purchase, " + user.getFirstName() + "!</h1>"
                + "<p>Here is your ticket for the event: <strong>" + ticket.getEventName() + "</strong>.</p>"
                + "<p><strong>Date:</strong> " + ticket.getEventDate() + "</p>"
                + "<p><strong>Venue:</strong> " + ticket.getEventVenue() + "</p>"
                + "<p><strong>Ticket Type:</strong> " + ticket.getTicketTypeName() + "</p>"
                + "<p><strong>Ticket Number:</strong> " + ticket.getTicketNumber() + "</p>"
                + "<p>Please present the QR code below at the entrance:</p>"
                + "<img src='cid:qrCodeImage' alt='QR Code' />"
                + "<hr>"
                + "<p>We look forward to seeing you there!</p>"
                + "</body>"
                + "</html>";

            helper.setText(htmlContent, true);

            // Add the QR code as an inline image
            ByteArrayResource qrCodeResource = new ByteArrayResource(qrCodeBytes);
            helper.addInline("qrCodeImage", qrCodeResource, "image/png");

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            // In a real app, you'd want more robust error handling, maybe a retry mechanism or logging to an alert system.
            throw new RuntimeException("Failed to send ticket confirmation email", e);
        }
    }
}
