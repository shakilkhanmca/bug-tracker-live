package com.bugtracker.controller;

import com.bugtracker.model.Ticket;
import com.bugtracker.payload.request.TicketRequest;
import com.bugtracker.payload.response.MessageResponse;
import com.bugtracker.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest ticketRequest) {
        // Validate projectId is present
        if (ticketRequest.getProjectId() == null) {
            throw new RuntimeException("Project ID is required");
        }
        return ResponseEntity.ok(ticketService.createTicket(ticketRequest));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Ticket>> getTicketsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ticketService.getTicketsByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody TicketRequest ticketRequest) {
        return ResponseEntity.ok(ticketService.updateTicket(id, ticketRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(new MessageResponse("Ticket deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ticket>> searchTickets(@RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ticketService.searchTickets(projectId, title, status));
    }
}
