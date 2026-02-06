package com.bugtracker.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank
    private String name;

    private String description;

    private java.util.Set<String> members;
}
