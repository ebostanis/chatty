# Lightweight image for production
FROM eclipse-temurin:24-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY target/chatty-1.0-SNAPSHOT.jar app.jar

# Expose default port
EXPOSE 8080

# Launch the spring boot app
ENTRYPOINT ["java", "-jar", "app.jar"]