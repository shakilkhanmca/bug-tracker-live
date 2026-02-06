package com.bugtracker.controller;

import com.bugtracker.model.Project;
import com.bugtracker.payload.request.ProjectRequest;
import com.bugtracker.payload.response.MessageResponse;
import com.bugtracker.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest projectRequest) {
        Project project = projectService.createProject(projectRequest);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestBody String username) {
        // Simple body with just username string, or expect JSON?
        // Let's assume raw string or handle JSON properly. keeping it simple.
        // Actually @RequestBody String will take the whole body. If user sends
        // {"username": "foo"}, I need to parse it.
        // Let's expect a simple map or DTO. I'll use a DTO or just "username" param?
        // Better: @RequestParam usually for simple things, or a DTO.
        // Let's create a MemberRequest DTO quickly or just use a Map.
        // Trying with username passed as a request param might be easier for now.
        // But PUT/POST usually have body.
        // Going to assume simple JSON "username": "..." is handled.
        // I will fix this locally: Use a Map<String, String> requestBody
        return ResponseEntity.badRequest().body(new MessageResponse("Use specifics endpoint with DTO"));
    }

    // Better implementation for adding member
    @PostMapping("/{id}/addMember")
    public ResponseEntity<?> addMemberByUsername(@PathVariable Long id, @RequestParam String username) {
        projectService.addMember(id, username);
        return ResponseEntity.ok(new MessageResponse("Member added successfully"));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        projectService.removeMember(id, userId);
        return ResponseEntity.ok(new MessageResponse("Member removed successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(new MessageResponse("Project deleted successfully"));
    }
}
