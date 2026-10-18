package com.bandhub.marketplace.internal.web;

import com.bandhub.marketplace.internal.application.MarketplaceService;
import com.bandhub.marketplace.internal.domain.Booking;
import com.bandhub.marketplace.internal.domain.Review;
import com.bandhub.marketplace.internal.domain.ServiceOffering;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/marketplace")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    public record PublishServiceRequest(UUID providerId, String title, String description, String category, BigDecimal price, String currency) {}
    public record RequestBookingRequest(UUID clientId, ZonedDateTime bookingDate, String notes) {}
    public record ReviewRequest(UUID reviewerId, int rating, String comment) {}

    @PostMapping("/services")
    public ResponseEntity<ServiceOffering> publishService(@RequestBody PublishServiceRequest request) {
        ServiceOffering offering = marketplaceService.publishService(
                request.providerId(), request.title(), request.description(),
                request.category(), request.price(), request.currency());
        return ResponseEntity.ok(offering);
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceOffering>> searchServices(@RequestParam String category) {
        return ResponseEntity.ok(marketplaceService.searchServicesByCategory(category));
    }

    @PostMapping("/services/{serviceId}/bookings")
    public ResponseEntity<Booking> requestBooking(@PathVariable UUID serviceId, @RequestBody RequestBookingRequest request) {
        Booking booking = marketplaceService.requestBooking(
                serviceId, request.clientId(), request.bookingDate(), request.notes());
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<Void> acceptBooking(@PathVariable UUID bookingId) {
        marketplaceService.acceptBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<Void> rejectBooking(@PathVariable UUID bookingId) {
        marketplaceService.rejectBooking(bookingId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<Void> completeBooking(@PathVariable UUID bookingId) {
        marketplaceService.completeBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bookings/{bookingId}/reviews")
    public ResponseEntity<Review> leaveReview(@PathVariable UUID bookingId, @RequestBody ReviewRequest request) {
        Review review = marketplaceService.leaveReview(
                bookingId, request.reviewerId(), request.rating(), request.comment());
        return ResponseEntity.ok(review);
    }
}
