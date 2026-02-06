package com.bugtracker.service;

import com.bugtracker.model.*;
import com.bugtracker.payload.request.TicketRequest;
import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.TicketRepository;
import com.bugtracker.repository.UserRepository;
import com.bugtracker.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    public Ticket createTicket(TicketRequest ticketRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User reporter = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(ticketRequest.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(ticketRequest.getTitle());
        ticket.setDescription(ticketRequest.getDescription());
        ticket.setProject(project);
        ticket.setReporter(reporter);

        if (ticketRequest.getPriority() != null) {
            ticket.setPriority(EPriority.valueOf(ticketRequest.getPriority().toUpperCase()));
        }

        if (ticketRequest.getStatus() != null) {
            ticket.setStatus(EStatus.valueOf(ticketRequest.getStatus().toUpperCase()));
        }

        if (ticketRequest.getDueDate() != null) {
            ticket.setDueDate(ticketRequest.getDueDate());
        }

        if (ticketRequest.getAssigneeUsername() != null && !ticketRequest.getAssigneeUsername().isEmpty()) {
            User assignee = userRepository.findByUsername(ticketRequest.getAssigneeUsername())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            ticket.setAssignee(assignee);
        }

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByProject(Long projectId) {
        return ticketRepository.findByProjectId(projectId);
    }

    public Ticket updateTicket(Long id, TicketRequest ticketRequest) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticketRequest.getTitle() != null)
            ticket.setTitle(ticketRequest.getTitle());
        if (ticketRequest.getDescription() != null)
            ticket.setDescription(ticketRequest.getDescription());
        if (ticketRequest.getStatus() != null)
            ticket.setStatus(EStatus.valueOf(ticketRequest.getStatus().toUpperCase()));
        if (ticketRequest.getPriority() != null)
            ticket.setPriority(EPriority.valueOf(ticketRequest.getPriority().toUpperCase()));
        if (ticketRequest.getDueDate() != null)
            ticket.setDueDate(ticketRequest.getDueDate());

        if (ticketRequest.getAssigneeUsername() != null) {
            User assignee = userRepository.findByUsername(ticketRequest.getAssigneeUsername())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            ticket.setAssignee(assignee);
        }

        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getReporter().getId().equals(userDetails.getId())
                && !ticket.getProject().getOwner().getId().equals(userDetails.getId())) {
            throw new RuntimeException("You remain unauthorized to delete this ticket");
        }
        ticketRepository.deleteById(id);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<Ticket> searchTickets(Long projectId, String title, String status) {
        EStatus eStatus = (status != null && !status.isEmpty()) ? EStatus.valueOf(status.toUpperCase()) : null;
        return ticketRepository.searchTickets(projectId, title, eStatus);
    }
}
