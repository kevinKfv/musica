package com.bandhub.social.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocialRepository extends JpaRepository<Post, UUID> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findAllByOrderByUpvotesDescCreatedAtDesc();

    List<Post> findByCategoryOrderByCreatedAtDesc(String category);

    List<Post> findByCategoryOrderByUpvotesDescCreatedAtDesc(String category);

    List<Post> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
}
