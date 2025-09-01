package com.eventmanagement.dto;

import java.time.LocalDate;

public class DailySales {
    private LocalDate date;
    private long ticketsSold;

    public DailySales(LocalDate date, long ticketsSold) {
        this.date = date;
        this.ticketsSold = ticketsSold;
    }

    // Getters and setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTicketsSold() {
        return ticketsSold;
    }

    public void setTicketsSold(long ticketsSold) {
        this.ticketsSold = ticketsSold;
    }
}
