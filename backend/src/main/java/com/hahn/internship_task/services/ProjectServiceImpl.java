package com.hahn.internship_task.services;

import com.hahn.internship_task.DTOs.CreateProjectRequest;
import com.hahn.internship_task.DTOs.CreateTaskRequest;
import com.hahn.internship_task.DTOs.ProjectDTO;
import com.hahn.internship_task.DTOs.TaskDTO;
import com.hahn.internship_task.entities.Project;
import com.hahn.internship_task.entities.Task;
import com.hahn.internship_task.entities.User;
import com.hahn.internship_task.repo.ProjectRepository;
import com.hahn.internship_task.repo.TaskRepository;
import com.hahn.internship_task.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<ProjectDTO> getProjectsByUser(UUID userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(this::mapToProjectDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        return mapToProjectDTO(project);
    }

    // --- CREATE ---
    public ProjectDTO createProject(CreateProjectRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);

        return mapToProjectDTO(projectRepository.save(project));
    }

    public ProjectDTO getProjectByIdAndUser(UUID projectId, UUID userId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));


        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("ACCESS DENIED: You do not own this project.");
        }


        return mapToProjectDTO(project);
    }


    private double calculateProgress(Project project) {
        if (project.getTasks() == null || project.getTasks().isEmpty()) {
            return 0.0;
        }
        long completedCount = project.getTasks().stream().filter(t -> t.isCompleted()).count();
        return (double) completedCount / project.getTasks().size() * 100;
    }


    @Transactional
    public TaskDTO addTask(UUID projectId, CreateTaskRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);
        task.setProject(project);

        return mapToTaskDTO(taskRepository.save(task));
    }

    public List<TaskDTO> getTasksByProjectId(UUID projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(task -> new TaskDTO(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate(),
                        task.isCompleted()
                ))
                .collect(Collectors.toList());
    }

    public void deleteTask(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found"); // Or specific exception
        }
        taskRepository.deleteById(taskId);
    }

    public TaskDTO updateTaskStatus(UUID taskId, boolean isCompleted) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setCompleted(isCompleted);
        return mapToTaskDTO(taskRepository.save(task));
    }


    private ProjectDTO mapToProjectDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());

        // REQUIREMENT: Calculate Progress
        List<Task> tasks = project.getTasks();
        int total = tasks.size();
        int completed = (int) tasks.stream().filter(Task::isCompleted).count();

        dto.setTotalTasks(total);
        dto.setCompletedTasks(completed);
        dto.setProgressPercentage(total == 0 ? 0 : ((double) completed / total) * 100);

        return dto;
    }

    private TaskDTO mapToTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setCompleted(task.isCompleted());
        return dto;
    }
}
