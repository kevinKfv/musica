# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy gradle wrapper and configuration files first for Docker layer caching
COPY gradle/ gradle/
COPY gradlew build.gradle settings.gradle ./

# Fix Windows CRLF line endings if present and ensure execution permissions
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

# Pre-fetch dependencies
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build jar
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create non-root user for security
RUN useradd -m bandhub && chown -R bandhub:bandhub /app
USER bandhub

COPY --from=builder --chown=bandhub:bandhub /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
