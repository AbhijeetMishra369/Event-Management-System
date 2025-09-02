package com.eventmanagement.dto;

import java.time.LocalDate;

public class DailySales {
    private LocalDate date;
    private double totalSales;

    public DailySales(LocalDate date, double totalSales) {
        this.date = date;
        this.totalSales = totalSales;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }
}
