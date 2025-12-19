package com.hahn.internship_task.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private UUID userId;
}