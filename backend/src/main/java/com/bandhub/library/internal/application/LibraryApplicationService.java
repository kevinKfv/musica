package com.bandhub.library.internal.application;

import com.bandhub.library.internal.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class LibraryApplicationService {

    private final SongRepository songRepository;
    private final SheetMusicRepository sheetMusicRepository;
    private final AudioTrackRepository audioTrackRepository;
    private final MediaStorageService mediaStorageService;
    private final EventPublisher eventPublisher;

    public LibraryApplicationService(SongRepository songRepository, 
                                     SheetMusicRepository sheetMusicRepository,
                                     AudioTrackRepository audioTrackRepository,
                                     MediaStorageService mediaStorageService,
                                     EventPublisher eventPublisher) {
        this.songRepository = songRepository;
        this.sheetMusicRepository = sheetMusicRepository;
        this.audioTrackRepository = audioTrackRepository;
        this.mediaStorageService = mediaStorageService;
        this.eventPublisher = eventPublisher;
    }

    public List<Song> getAllSongs() {
        return songRepository.findByDeletedAtIsNull();
    }

    public List<Song> getSongsByBand(UUID bandId) {
        return songRepository.findByBandIdAndDeletedAtIsNull(bandId);
    }

    public List<Song> getSongsByUser(UUID userId) {
        return songRepository.findByCreatedByAndDeletedAtIsNull(userId);
    }

    public Song createSong(String title, String artist, String genre, UUID createdBy, UUID bandId) {
        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setGenre(genre);
        song.setCreatedBy(createdBy);
        song.setBandId(bandId);
        return songRepository.save(song);
    }

    public SheetMusic uploadSheetMusic(UUID songId, String instrument, String formatType, MultipartFile file, UUID uploadedBy) {
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        String fileUrl = mediaStorageService.uploadFile(file, "sheets");

        SheetMusic sheet = new SheetMusic();
        sheet.setSong(song);
        sheet.setInstrument(instrument);
        sheet.setFormatType(formatType);
        sheet.setFileUrl(fileUrl);
        sheet.setCreatedBy(uploadedBy);

        SheetMusic saved = sheetMusicRepository.save(sheet);
        eventPublisher.publishResourceUploaded(saved.getId(), "SHEET_MUSIC", songId, uploadedBy);
        
        return saved;
    }

    public AudioTrack uploadAudioTrack(UUID songId, String trackType, Integer durationSeconds, MultipartFile file, UUID uploadedBy) {
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        String fileUrl = mediaStorageService.uploadFile(file, "audio");

        AudioTrack track = new AudioTrack();
        track.setSong(song);
        track.setTrackType(trackType);
        track.setDurationSeconds(durationSeconds);
        track.setFileUrl(fileUrl);
        track.setCreatedBy(uploadedBy);

        AudioTrack saved = audioTrackRepository.save(track);
        eventPublisher.publishResourceUploaded(saved.getId(), "AUDIO_TRACK", songId, uploadedBy);
        
        return saved;
    }
}
