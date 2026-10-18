package com.bandhub.library.internal.application;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class MockMediaStorageService implements MediaStorageService {

    @Override
    public CompletableFuture<String> uploadFileAsync(MultipartFile file, String prefix) {
        return CompletableFuture.completedFuture(uploadFile(file, prefix));
    }

    @Override
    public String uploadFile(MultipartFile file, String prefix) {
        // Mock implementation since AWS SDK is not in dependencies yet
        // In reality, this would upload to MinIO and return the URL
        String fakeUrl = "https://minio.local/bandhub/" + prefix + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        return fakeUrl;
    }
}
