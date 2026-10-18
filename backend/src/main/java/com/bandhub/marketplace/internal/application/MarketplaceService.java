package com.bandhub.marketplace.internal.application;

import com.bandhub.marketplace.BookingRequestedEvent;
import com.bandhub.marketplace.BookingStatusChangedEvent;
import com.bandhub.marketplace.internal.domain.Booking;
import com.bandhub.marketplace.internal.domain.Review;
import com.bandhub.marketplace.internal.domain.ServiceOffering;
import com.bandhub.marketplace.internal.infrastructure.BookingRepository;
import com.bandhub.marketplace.internal.infrastructure.ReviewRepository;
import com.bandhub.marketplace.internal.infrastructure.ServiceOfferingRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MarketplaceService {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MarketplaceService(ServiceOfferingRepository serviceOfferingRepository,
                              BookingRepository bookingRepository,
                              ReviewRepository reviewRepository,
                              ApplicationEventPublisher eventPublisher) {
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.eventPublisher = eventPublisher;
    }

    public ServiceOffering publishService(UUID providerId, String title, String description, String category, BigDecimal price, String currency) {
        ServiceOffering offering = new ServiceOffering(null, providerId, title, description, category, price, currency);
        return serviceOfferingRepository.save(offering);
    }

    @Transactional(readOnly = true)
    public List<ServiceOffering> searchServicesByCategory(String category) {
        return serviceOfferingRepository.findByCategoryAndIsActiveTrueAndDeletedAtIsNull(category);
    }

    public Booking requestBooking(UUID serviceOfferingId, UUID clientId, ZonedDateTime bookingDate, String notes) {
        ServiceOffering offering = serviceOfferingRepository.findById(serviceOfferingId)
                .orElseThrow(() -> new IllegalArgumentException("Service offering not found"));
        
        if (!offering.isActive()) {
            throw new IllegalStateException("Service offering is not active");
        }

        Booking booking = new Booking(null, serviceOfferingId, clientId, bookingDate, notes);
        booking = bookingRepository.save(booking);

        eventPublisher.publishEvent(new BookingRequestedEvent(
                booking.getId(),
                offering.getId(),
                clientId,
                offering.getProviderId(),
                bookingDate
        ));

        return booking;
    }

    public void acceptBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.accept();
        bookingRepository.save(booking);
        
        eventPublisher.publishEvent(new BookingStatusChangedEvent(booking.getId(), booking.getStatus().name()));
    }
    
    public void rejectBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.reject();
        bookingRepository.save(booking);
        
        eventPublisher.publishEvent(new BookingStatusChangedEvent(booking.getId(), booking.getStatus().name()));
    }

    public void completeBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.complete();
        bookingRepository.save(booking);
        
        eventPublisher.publishEvent(new BookingStatusChangedEvent(booking.getId(), booking.getStatus().name()));
    }

    public Review leaveReview(UUID bookingId, UUID reviewerId, int rating, String comment) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        
        if (booking.getStatus() != com.bandhub.marketplace.internal.domain.BookingStatus.COMPLETED) {
            throw new IllegalStateException("Can only review COMPLETED bookings");
        }
        
        Review review = new Review(null, bookingId, reviewerId, rating, comment);
        return reviewRepository.save(review);
    }
}
