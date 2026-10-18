package com.bandhub.library.internal.application;

import org.springframework.web.multipart.MultipartFile;
import java.util.concurrent.CompletableFuture;

public interface MediaStorageService {
    CompletableFuture<String> uploadFileAsync(MultipartFile file, String prefix);
    String uploadFile(MultipartFile file, String prefix);
}
