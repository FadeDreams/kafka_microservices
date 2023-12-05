## Movie Ticket Microservices Architecture

Welcome to the Movie Ticket Microservices application, a cutting-edge system designed to revolutionize the ticketing process. This distributed architecture employs a set of microservices dedicated to handling various aspects of the ticketing workflow.

## Overview

### Ticket Microservice
The Ticket Microservice focuses on creating and managing tickets efficiently. It is responsible for handling the lifecycle of tickets, from creation to potential reservation.

### Order Microservice
The Order Microservice seamlessly manages the ticket ordering process. Upon receiving an order, it communicates with the Ticket Microservice using RabbitMQ, ensuring a decoupled and scalable system.

### Communication via RabbitMQ
To guarantee smooth communication between microservices, RabbitMQ is utilized as a message broker. This decoupling ensures flexibility and scalability in handling orders and tickets.

### Ticket Availability Management
A sophisticated mechanism is implemented to manage ticket availability. When a ticket is ordered, it is temporarily locked for a specific duration. Clients have the opportunity to reserve the ticket during this lock period. If not reserved within the allocated time, the Expire Microservice intervenes to unlock the ticket.

### Handling Race Conditions
To adeptly manage potential race conditions within the Order Microservice, we employ an Optimistic Concurrency Control (OCC) strategy. This approach ensures the integrity and consistency of data during concurrent operations without relying on the mongoose-update-if-current package. With OCC, we implement versioning to track changes, and when updates are requested, we verify that the version hasn't changed since the data was initially retrieved. If a concurrent update is detected, the system intelligently handles the situation to maintain data accuracy and reliability.

### Authentication and Session Management
Authentication processes are intricately designed to depend on RabbitMQ, eliminating direct calls and enhancing security. User sessions are stored in Redis for efficient session management, contributing to a resilient and performant application.

## Project Structure
```
/mov_ticket
|-- auth
|-- client
|-- common
|-- docker-compose.yml
|-- expiration
|-- orders
|-- tickets
|-- shared.env
|-- test-rabbitmq
```

## Getting Started
1. Clone the repository.
2. Run the Docker Compose configuration using `docker-compose up`.
3. Explore the various microservices and their functionalities.

Feel free to contribute, report issues, or provide feedback. Let's create a seamless and enjoyable movie ticketing experience!
