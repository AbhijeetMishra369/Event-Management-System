package com.eventmanagement.service;

import com.eventmanagement.model.Ticket;
import com.eventmanagement.model.User;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendTicketConfirmationEmail(User user, Ticket ticket, byte[] qrCodeBytes) {
        // In a real application, this would send an email with the QR code as an attachment.
        // For this example, we'll just log to the console.
        System.out.println("Sending ticket confirmation to " + user.getEmail());
        System.out.println("Ticket ID: " + ticket.getId());
        System.out.println("Event: " + ticket.getEventName());
    }
}
