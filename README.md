## Kafka Microservices Application

The Kafka Microservices application is a robust system built on microservices architecture, comprising five distinct components that play crucial roles in ensuring a seamless and efficient workflow.

## Overview

### Authentication Microservice (Django and PyJWT)
Ensures secure authentication and authorization processes. Implemented with Django and PyJWT, this microservice plays a crucial role in safeguarding user interactions.

### Order Node Microservice (Node.js)
Manages order creation and storage in its local database. This microservice triggers Kafka events upon order submission, contributing to the event-driven nature of the system.

### Order Reader Django Microservice
Reads and processes order events from Kafka, providing real-time updates. This Django-based microservice enhances the responsiveness of the application by staying in sync with order-related events.

### Buy Go Microservice (Golang)
Follows the SAGA pattern for seamless purchase processes. Developed in Golang, this microservice allows for compensation in case of failures, ensuring the reliability of the application.

### VueUI Microservice (Vue3 & Vuex)
Responsible for orchestrating the user interface, this microservice, developed with Vue3 and Vuex, facilitates the placement of orders into the relevant microservices. It keeps itself updated using socket.io, providing a dynamic and responsive user experience.

## Project Structure
```plaintext
/kafka_microservices
|-- auth
|-- buy_go
|-- docker-compose.yml
|-- order_node
|-- order_reader_django
|-- temp
|-- vueui
```

## Getting Started
1. Clone the repository.
2. Run the Docker Compose configuration using `docker-compose up`.
3. Explore the various microservices and their functionalities.

Feel free to contribute, report issues, or provide feedback. Let's enhance and optimize the Kafka Microservices application together!
