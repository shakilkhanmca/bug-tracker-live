package com.bugtracker.repository;

import com.bugtracker.model.EStatus;
import com.bugtracker.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByProjectId(Long projectId);

    List<Ticket> findByAssigneeId(Long assigneeId);

    @Query("SELECT t FROM Ticket t WHERE (:projectId IS NULL OR t.project.id = :projectId) " +
            "AND (:title IS NULL OR t.title LIKE %:title%) " +
            "AND (:status IS NULL OR t.status = :status)")
    List<Ticket> searchTickets(@Param("projectId") Long projectId,
            @Param("title") String title,
            @Param("status") EStatus status);
}
