package com.bandhub.library.internal.infrastructure.web;

import com.bandhub.library.internal.application.LibraryApplicationService;
import com.bandhub.library.internal.domain.AudioTrack;
import com.bandhub.library.internal.domain.SheetMusic;
import com.bandhub.library.internal.domain.Song;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/library/songs")
public class LibraryController {

    private final LibraryApplicationService libraryService;

    public LibraryController(LibraryApplicationService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<List<Song>> getSongs(@RequestParam(required = false) UUID bandId, 
                                               @RequestParam(required = false) UUID userId) {
        if (bandId != null) {
            return ResponseEntity.ok(libraryService.getSongsByBand(bandId));
        } else if (userId != null) {
            return ResponseEntity.ok(libraryService.getSongsByUser(userId));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping
    public ResponseEntity<Song> createSong(@RequestBody CreateSongRequest request) {
        Song song = libraryService.createSong(
            request.title(), 
            request.artist(), 
            request.genre(), 
            request.createdBy(), 
            request.bandId()
        );
        return ResponseEntity.ok(song);
    }

    @PostMapping("/{songId}/sheets")
    public ResponseEntity<SheetMusic> uploadSheetMusic(
            @PathVariable UUID songId,
            @RequestParam("instrument") String instrument,
            @RequestParam("formatType") String formatType,
            @RequestParam("uploadedBy") UUID uploadedBy,
            @RequestParam("file") MultipartFile file) {
        
        SheetMusic sheet = libraryService.uploadSheetMusic(songId, instrument, formatType, file, uploadedBy);
        return ResponseEntity.ok(sheet);
    }

    @PostMapping("/{songId}/audio")
    public ResponseEntity<AudioTrack> uploadAudioTrack(
            @PathVariable UUID songId,
            @RequestParam("trackType") String trackType,
            @RequestParam(value = "durationSeconds", required = false) Integer durationSeconds,
            @RequestParam("uploadedBy") UUID uploadedBy,
            @RequestParam("file") MultipartFile file) {
        
        AudioTrack track = libraryService.uploadAudioTrack(songId, trackType, durationSeconds, file, uploadedBy);
        return ResponseEntity.ok(track);
    }
}

record CreateSongRequest(String title, String artist, String genre, UUID createdBy, UUID bandId) {}
