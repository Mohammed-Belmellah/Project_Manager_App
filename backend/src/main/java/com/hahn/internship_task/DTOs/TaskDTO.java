package com.hahn.internship_task.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor@NoArgsConstructor
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean isCompleted;
}
