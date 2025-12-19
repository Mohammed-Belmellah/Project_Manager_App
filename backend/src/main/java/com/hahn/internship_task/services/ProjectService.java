package com.hahn.internship_task.services;

import com.hahn.internship_task.DTOs.CreateProjectRequest;
import com.hahn.internship_task.DTOs.CreateTaskRequest;
import com.hahn.internship_task.DTOs.ProjectDTO;
import com.hahn.internship_task.DTOs.TaskDTO;

import java.util.List;
import java.util.UUID;

public interface ProjectService {
    List<ProjectDTO> getProjectsByUser(UUID userId);
    ProjectDTO getProjectById(UUID projectId);
    ProjectDTO createProject(CreateProjectRequest request);
    ProjectDTO getProjectByIdAndUser(UUID projectId, UUID userId);
    TaskDTO addTask(UUID projectId, CreateTaskRequest request);
    TaskDTO updateTaskStatus(UUID taskId, boolean isCompleted);
    void deleteTask(UUID taskId);
    List<TaskDTO> getTasksByProjectId(UUID projectId);
}
