FROM openjdk:11-jdk AS builder
WORKDIR /build-dir/

COPY gradle gradle
COPY gradlew gradlew
COPY settings.gradle settings.gradle
COPY gradle.properties gradle.properties
RUN echo "\norg.gradle.daemon=false" >> gradle.properties
RUN ./gradlew

COPY build.gradle build.gradle
COPY src src
RUN ./gradlew jar

FROM openjdk:11-jre-slim
WORKDIR /app/
COPY --from=builder  /build-dir/build/libs/SecretSantaBackend-1.0.jar .
CMD java -jar SecretSantaBackend-1.0.jar
