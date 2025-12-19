package com.hahn.internship_task.repo;

import com.hahn.internship_task.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByUserId(UUID userId);
}
