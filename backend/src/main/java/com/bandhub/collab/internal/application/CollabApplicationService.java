package com.bandhub.collab.internal.application;

import com.bandhub.collab.internal.domain.*;
import com.bandhub.collab.internal.web.dto.CreateProjectRequest;
import com.bandhub.collab.internal.web.dto.UploadStemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollabApplicationService {

    private final CollabProjectRepository projectRepository;
    private final AudioStemRepository stemRepository;
    private final TimelineCommentRepository commentRepository;

    @Transactional
    public CollabProject createProject(UUID ownerId, CreateProjectRequest request) {
        CollabProject project = new CollabProject();
        project.setOwnerId(ownerId);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<CollabProject> getUserProjects(UUID ownerId) {
        return projectRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }
    
    @Transactional(readOnly = true)
    public CollabProject getProjectDetails(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    @Transactional
    public AudioStem addStem(UUID projectId, UUID uploaderId, UploadStemRequest request) {
        CollabProject project = getProjectDetails(projectId);
        
        AudioStem stem = new AudioStem();
        stem.setUploaderId(uploaderId);
        stem.setName(request.getName());
        stem.setFileUrl(request.getFileUrl());
        
        project.addStem(stem);
        projectRepository.save(project);
        
        return stem;
    }

    @Transactional
    public TimelineComment addTimelineComment(UUID stemId, UUID authorId, Integer timestamp, String content) {
        AudioStem stem = stemRepository.findById(stemId)
                .orElseThrow(() -> new IllegalArgumentException("Stem not found"));
                
        TimelineComment comment = new TimelineComment();
        comment.setAuthorId(authorId);
        comment.setTimestampSeconds(timestamp);
        comment.setContent(content);
        
        stem.addComment(comment);
        stemRepository.save(stem);
        
        return comment;
    }
}
