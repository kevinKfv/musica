package com.bandhub.marketplace.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.util.UUID;
import java.time.ZonedDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "service_offerings", schema = "schema_marketplace")
public class ServiceOffering {

    @Id
    private UUID id;

    @Column(name = "provider_id", nullable = false)
    private UUID providerId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String currency;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    protected ServiceOffering() {}

    public ServiceOffering(UUID id, UUID providerId, String title, String description, String category, BigDecimal price, String currency) {
        this.id = id != null ? id : UUID.randomUUID();
        this.providerId = providerId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.currency = currency != null ? currency : "USD";
        this.isActive = true;
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public UUID getId() { return id; }
    public UUID getProviderId() { return providerId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public BigDecimal getPrice() { return price; }
    public String getCurrency() { return currency; }
    public boolean isActive() { return isActive; }
    
    public void deactivate() {
        this.isActive = false;
        this.updatedAt = ZonedDateTime.now();
    }
}
