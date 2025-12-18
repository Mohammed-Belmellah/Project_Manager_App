package com.hahn.internship_task.Controllers;

import com.hahn.internship_task.DTOs.CreateProjectRequest;
import com.hahn.internship_task.DTOs.CreateTaskRequest;
import com.hahn.internship_task.DTOs.ProjectDTO;
import com.hahn.internship_task.DTOs.TaskDTO;
import com.hahn.internship_task.entities.User;
import com.hahn.internship_task.repo.UserRepository;
import com.hahn.internship_task.services.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    // Get all projects for a specific user (Pass userId as param for now)
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getUserProjects(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(projectService.getProjectsByUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable UUID id, Authentication authentication) {
        // 1. Get the current user
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Pass the User ID to the service so we can check ownership
        return ResponseEntity.ok(projectService.getProjectByIdAndUser(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setUserId(user.getId());
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<TaskDTO> addTask(@PathVariable UUID projectId,
                                           @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(projectService.addTask(projectId, request));
    }

    @PatchMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable UUID taskId,
                                              @RequestParam boolean completed) {
        return ResponseEntity.ok(projectService.updateTaskStatus(taskId, completed));
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskDTO>> getProjectTasks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getTasksByProjectId(projectId));
    }

    // 2. Delete a task
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {
        projectService.deleteTask(taskId);
        return ResponseEntity.noContent().build(); // Returns 204 No Content
    }
}