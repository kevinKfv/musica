package com.bandhub.collab.internal.web;

import com.bandhub.collab.internal.application.CollabApplicationService;
import com.bandhub.collab.internal.domain.AudioStem;
import com.bandhub.collab.internal.domain.CollabProject;
import com.bandhub.collab.internal.domain.TimelineComment;
import com.bandhub.collab.internal.web.dto.AddTimelineCommentRequest;
import com.bandhub.collab.internal.web.dto.CreateProjectRequest;
import com.bandhub.collab.internal.web.dto.UploadStemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/collab")
@RequiredArgsConstructor
public class CollabController {

    private final CollabApplicationService collabService;

    @PostMapping("/projects")
    public ResponseEntity<CollabProject> createProject(@AuthenticationPrincipal Jwt jwt, @RequestBody CreateProjectRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(collabService.createProject(userId, request));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<CollabProject>> getProjects(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(collabService.getUserProjects(userId));
    }
    
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<CollabProject> getProjectDetails(@PathVariable UUID projectId) {
        return ResponseEntity.ok(collabService.getProjectDetails(projectId));
    }

    @PostMapping("/projects/{projectId}/stems")
    public ResponseEntity<AudioStem> uploadStem(@AuthenticationPrincipal Jwt jwt, 
                                                @PathVariable UUID projectId, 
                                                @RequestBody UploadStemRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(collabService.addStem(projectId, userId, request));
    }

    @PostMapping("/stems/{stemId}/comments")
    public ResponseEntity<TimelineComment> addComment(@AuthenticationPrincipal Jwt jwt,
                                                      @PathVariable UUID stemId,
                                                      @RequestBody AddTimelineCommentRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(collabService.addTimelineComment(stemId, userId, request.getTimestampSeconds(), request.getContent()));
    }
}
