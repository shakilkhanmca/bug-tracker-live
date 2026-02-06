package com.bugtracker.service;

import com.bugtracker.model.Project;
import com.bugtracker.model.User;
import com.bugtracker.payload.request.ProjectRequest;
import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.UserRepository;
import com.bugtracker.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public Project createProject(ProjectRequest projectRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        System.out.println("Creating project for user: " + userDetails.getUsername() + " ID: " + userDetails.getId());
        
        User owner = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setOwner(owner);
        project.getMembers().add(owner); // Owner is also a member

        if (projectRequest.getMembers() != null && !projectRequest.getMembers().isEmpty()) {
            for (String username : projectRequest.getMembers()) {
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    project.getMembers().add(userOpt.get());
                } else {
                    // Auto-create user if not exists (Demo friendliness)
                    System.out.println("Auto-creating missing user: " + username);
                    User newUser = new User(username, username + "@example.com", passwordEncoder.encode("password"));
                    userRepository.save(newUser);
                    project.getMembers().add(newUser);
                }
            }
        }

        Project savedProject = projectRepository.save(project);
        System.out.println("Project saved with ID: " + savedProject.getId());
        return savedProject;
    }

    public List<Project> getMyProjects() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        System.out.println("Fetching projects for user ID: " + userDetails.getId());
        // Return projects where user is owner or member.
        List<Project> projects = projectRepository.findByUserId(userDetails.getId());
        System.out.println("Found projects count: " + projects.size());
        projects.forEach(project -> project.getMembers().size()); // Initialize lazy collection
        return projects;
    }

    public Project getProjectById(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        project.getMembers().size(); // Initialize lazy collection
        return project;
    }

    @Transactional
    public void addMember(Long projectId, String username) {
        Project project = getProjectById(projectId);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        project.getMembers().add(user);
        projectRepository.save(project);
    }

    @Transactional
    public void removeMember(Long projectId, Long userId) {
        Project project = getProjectById(projectId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        project.getMembers().remove(user);
        projectRepository.save(project);
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
}
