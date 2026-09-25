FROM maven:4.0.0-rc-5-eclipse-temurin-21-noble

WORKDIR /app

COPY . .

RUN mvn package -DskipTests

# TODO Adicionar as variáveis de ambiente em um .env pra não ter como commitar sem querer

EXPOSE 8080

CMD ["java", "-jar", "target/budgie-backend-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]