package com.hahn.internship_task.services;

import com.hahn.internship_task.DTOs.RegisterRequest;
import com.hahn.internship_task.DTOs.UserDTO;
import com.hahn.internship_task.entities.User;

import java.util.UUID;

public interface UserService {
    UserDTO registerUser(RegisterRequest request);
    User getUserById(UUID id);

}
