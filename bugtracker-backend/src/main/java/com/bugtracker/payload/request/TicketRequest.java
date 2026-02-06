package com.bugtracker.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TicketRequest {
    @NotBlank
    private String title;

    private String description;

    private String status; // String to be converted to Enum

    private String priority;

    private LocalDate dueDate;

    private Long projectId;

    private String assigneeUsername; // Optional for creation, can be used for update
}
