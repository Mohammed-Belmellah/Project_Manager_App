package com.hahn.internship_task.DTOs;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ProjectDTO {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}
