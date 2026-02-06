package com.bugtracker.repository;

import com.bugtracker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE m.id = :userId OR p.owner.id = :userId")
    List<Project> findByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
