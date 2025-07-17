# System Architecture Diagrams - Service Ticket System

## 1. Overall System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser<br/>React/TypeScript]
        MOBILE[Mobile App<br/>React Native]
        ADMIN[Admin Dashboard<br/>React]
    end
    
    subgraph "Load Balancer"
        LB[Nginx/AWS ALB<br/>Load Balancer]
    end
    
    subgraph "Application Layer"
        API1[Spring Boot App 1<br/>Port 8080]
        API2[Spring Boot App 2<br/>Port 8081]
        API3[Spring Boot App 3<br/>Port 8082]
    end
    
    subgraph "WebSocket Layer"
        WS1[WebSocket Server 1]
        WS2[WebSocket Server 2]
    end
    
    subgraph "Cache Layer"
        REDIS[(Redis Cache<br/>Session & Data)]
    end
    
    subgraph "Message Queue"
        MQ[RabbitMQ/Apache Kafka<br/>Async Processing]
    end
    
    subgraph "Database Layer"
        DB[(PostgreSQL<br/>Primary Database)]
        REPLICA[(PostgreSQL<br/>Read Replica)]
    end
    
    subgraph "File Storage"
        S3[AWS S3/MinIO<br/>File Storage]
    end
    
    subgraph "External Services"
        EMAIL[Email Service<br/>SMTP/SES]
        SMS[SMS Service<br/>Twilio]
        MAPS[Maps API<br/>Google Maps]
        PUSH[Push Notifications<br/>Firebase]
    end
    
    WEB --> LB
    MOBILE --> LB
    ADMIN --> LB
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> WS1
    API2 --> WS2
    
    API1 --> REDIS
    API2 --> REDIS
    API3 --> REDIS
    
    API1 --> MQ
    API2 --> MQ
    API3 --> MQ
    
    API1 --> DB
    API2 --> REPLICA
    API3 --> DB
    
    API1 --> S3
    API2 --> S3
    API3 --> S3
    
    MQ --> EMAIL
    MQ --> SMS
    API1 --> MAPS
    MQ --> PUSH
```

## 2. Microservices Architecture (Future State)

```mermaid
graph TB
    subgraph "API Gateway"
        GATEWAY[Spring Cloud Gateway<br/>Routing & Security]
    end
    
    subgraph "Authentication Service"
        AUTH[Auth Service<br/>JWT & User Management]
        AUTH_DB[(Auth Database)]
    end
    
    subgraph "Ticket Service"
        TICKET[Ticket Service<br/>CRUD & Assignment]
        TICKET_DB[(Ticket Database)]
    end
    
    subgraph "Employee Service"
        EMP[Employee Service<br/>Management & Tracking]
        EMP_DB[(Employee Database)]
    end
    
    subgraph "Location Service"
        LOC[Location Service<br/>Real-time Tracking]
        LOC_DB[(Location Database)]
    end
    
    subgraph "Notification Service"
        NOTIF[Notification Service<br/>Multi-channel Alerts]
        NOTIF_DB[(Notification Database)]
    end
    
    subgraph "Review Service"
        REVIEW[Review Service<br/>Rating & Analytics]
        REVIEW_DB[(Review Database)]
    end
    
    subgraph "File Service"
        FILE[File Service<br/>Upload & Management]
        FILE_STORAGE[(File Storage)]
    end
    
    subgraph "Analytics Service"
        ANALYTICS[Analytics Service<br/>Reports & Insights]
        ANALYTICS_DB[(Analytics Database)]
    end
    
    subgraph "Service Discovery"
        EUREKA[Eureka Server<br/>Service Registry]
    end
    
    GATEWAY --> AUTH
    GATEWAY --> TICKET
    GATEWAY --> EMP
    GATEWAY --> LOC
    GATEWAY --> NOTIF
    GATEWAY --> REVIEW
    GATEWAY --> FILE
    GATEWAY --> ANALYTICS
    
    AUTH --> AUTH_DB
    TICKET --> TICKET_DB
    EMP --> EMP_DB
    LOC --> LOC_DB
    NOTIF --> NOTIF_DB
    REVIEW --> REVIEW_DB
    FILE --> FILE_STORAGE
    ANALYTICS --> ANALYTICS_DB
    
    AUTH --> EUREKA
    TICKET --> EUREKA
    EMP --> EUREKA
    LOC --> EUREKA
    NOTIF --> EUREKA
    REVIEW --> EUREKA
    FILE --> EUREKA
    ANALYTICS --> EUREKA
```

## 3. Database Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar email UK
        varchar password
        varchar name
        varchar phone
        varchar department
        varchar avatar
        enum role
        boolean is_active
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }
    
    EMPLOYEES {
        bigint id PK
        bigint user_id FK
        varchar employee_id UK
        varchar specialization
        enum status
        decimal average_rating
        int total_reviews
        int completed_tickets
        decimal completion_rate
        varchar current_ticket_id
        timestamp hired_at
        timestamp updated_at
    }
    
    DEPARTMENTS {
        bigint id PK
        varchar name UK
        varchar description
        varchar code
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    TICKETS {
        bigint id PK
        varchar ticket_number UK
        varchar title
        text description
        enum priority
        enum status
        varchar category
        varchar location
        varchar estimated_time
        bigint user_id FK
        bigint assigned_employee_id FK
        timestamp created_at
        timestamp updated_at
        timestamp assigned_at
        timestamp started_at
        timestamp resolved_at
        timestamp closed_at
    }
    
    REVIEWS {
        bigint id PK
        bigint ticket_id FK
        bigint employee_id FK
        bigint reviewer_id FK
        int rating
        text comment
        json categories
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }
    
    LOCATIONS {
        bigint id PK
        bigint employee_id FK
        decimal latitude
        decimal longitude
        varchar address
        varchar building
        varchar floor
        decimal accuracy
        boolean is_active
        timestamp updated_at
        timestamp created_at
    }
    
    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar title
        text message
        enum type
        varchar related_entity_id
        boolean is_read
        boolean is_email_sent
        boolean is_push_sent
        timestamp created_at
        timestamp read_at
    }
    
    CHAT_MESSAGES {
        bigint id PK
        bigint ticket_id FK
        bigint sender_id FK
        text message
        varchar message_type
        varchar attachment_url
        boolean is_read
        timestamp created_at
        timestamp read_at
    }
    
    FILE_ATTACHMENTS {
        bigint id PK
        bigint ticket_id FK
        varchar file_name
        varchar original_file_name
        varchar file_path
        varchar file_type
        bigint file_size
        varchar content_type
        bigint uploaded_by FK
        timestamp uploaded_at
    }
    
    TICKET_TIMELINE {
        bigint id PK
        bigint ticket_id FK
        enum status
        varchar description
        bigint updated_by FK
        varchar notes
        timestamp created_at
    }
    
    USER_SETTINGS {
        bigint id PK
        bigint user_id FK
        boolean email_notifications
        boolean push_notifications
        boolean sms_notifications
        boolean ticket_updates
        boolean assignments
        boolean deadlines
        boolean marketing
        varchar theme
        varchar accent_color
        boolean animations
        boolean compact_mode
        varchar language
        boolean location_tracking
        boolean data_collection
        boolean analytics
        boolean public_profile
        boolean two_factor
        timestamp updated_at
    }
    
    PERFORMANCE_METRICS {
        bigint id PK
        bigint employee_id FK
        int total_tickets_assigned
        int total_tickets_completed
        decimal average_response_time
        decimal average_resolution_time
        decimal completion_rate
        decimal customer_satisfaction_score
        int total_reviews
        decimal average_rating
        int current_month_tickets
        int last_month_tickets
        timestamp updated_at
        timestamp created_at
    }
    
    VOICE_NOTES {
        bigint id PK
        bigint employee_id FK
        bigint ticket_id FK
        varchar audio_file_path
        text transcription
        int duration
        varchar file_format
        bigint file_size
        timestamp created_at
    }
    
    %% Relationships
    USERS ||--o| EMPLOYEES : "has"
    USERS ||--o| USER_SETTINGS : "has"
    USERS ||--o{ TICKETS : "creates"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ CHAT_MESSAGES : "sends"
    
    EMPLOYEES ||--o{ TICKETS : "assigned_to"
    EMPLOYEES ||--o{ REVIEWS : "receives"
    EMPLOYEES ||--o| LOCATIONS : "has"
    EMPLOYEES ||--o| PERFORMANCE_METRICS : "has"
    EMPLOYEES ||--o{ VOICE_NOTES : "creates"
    EMPLOYEES }o--|| DEPARTMENTS : "belongs_to"
    
    TICKETS ||--o{ REVIEWS : "has"
    TICKETS ||--o{ FILE_ATTACHMENTS : "has"
    TICKETS ||--o{ TICKET_TIMELINE : "has"
    TICKETS ||--o{ CHAT_MESSAGES : "has"
    TICKETS ||--o{ VOICE_NOTES : "has"
```

## 4. Application Layer Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        CONTROLLER[Controllers<br/>REST Endpoints]
        WEBSOCKET[WebSocket Handlers<br/>Real-time Communication]
    end
    
    subgraph "Security Layer"
        JWT[JWT Filter<br/>Authentication]
        AUTHZ[Authorization<br/>Role-based Access]
    end
    
    subgraph "Business Logic Layer"
        AUTH_SERVICE[AuthService<br/>Login/Register]
        TICKET_SERVICE[TicketService<br/>CRUD/Assignment]
        EMP_SERVICE[EmployeeService<br/>Management/Tracking]
        REVIEW_SERVICE[ReviewService<br/>Rating/Analytics]
        LOC_SERVICE[LocationService<br/>Real-time Tracking]
        NOTIF_SERVICE[NotificationService<br/>Multi-channel Alerts]
        CHAT_SERVICE[ChatService<br/>Messaging]
        FILE_SERVICE[FileService<br/>Upload/Management]
        ANALYTICS_SERVICE[AnalyticsService<br/>Reports/Insights]
        SETTINGS_SERVICE[SettingsService<br/>User Preferences]
        AI_SERVICE[AIService<br/>Smart Suggestions]
        VOICE_SERVICE[VoiceService<br/>Voice Processing]
        EMAIL_SERVICE[EmailService<br/>Email Communication]
    end
    
    subgraph "Data Access Layer"
        USER_REPO[UserRepository]
        EMP_REPO[EmployeeRepository]
        TICKET_REPO[TicketRepository]
        REVIEW_REPO[ReviewRepository]
        LOC_REPO[LocationRepository]
        NOTIF_REPO[NotificationRepository]
        CHAT_REPO[ChatRepository]
        FILE_REPO[FileRepository]
        TIMELINE_REPO[TimelineRepository]
        SETTINGS_REPO[SettingsRepository]
        DEPT_REPO[DepartmentRepository]
        PERF_REPO[PerformanceRepository]
    end
    
    subgraph "External Integrations"
        EMAIL_PROVIDER[Email Provider<br/>SMTP/SES]
        SMS_PROVIDER[SMS Provider<br/>Twilio]
        MAPS_API[Maps API<br/>Google Maps]
        PUSH_PROVIDER[Push Provider<br/>Firebase]
        FILE_STORAGE[File Storage<br/>AWS S3/MinIO]
    end
    
    CONTROLLER --> JWT
    WEBSOCKET --> JWT
    JWT --> AUTHZ
    
    AUTHZ --> AUTH_SERVICE
    AUTHZ --> TICKET_SERVICE
    AUTHZ --> EMP_SERVICE
    AUTHZ --> REVIEW_SERVICE
    AUTHZ --> LOC_SERVICE
    AUTHZ --> NOTIF_SERVICE
    AUTHZ --> CHAT_SERVICE
    AUTHZ --> FILE_SERVICE
    AUTHZ --> ANALYTICS_SERVICE
    AUTHZ --> SETTINGS_SERVICE
    AUTHZ --> AI_SERVICE
    AUTHZ --> VOICE_SERVICE
    AUTHZ --> EMAIL_SERVICE
    
    AUTH_SERVICE --> USER_REPO
    TICKET_SERVICE --> TICKET_REPO
    EMP_SERVICE --> EMP_REPO
    REVIEW_SERVICE --> REVIEW_REPO
    LOC_SERVICE --> LOC_REPO
    NOTIF_SERVICE --> NOTIF_REPO
    CHAT_SERVICE --> CHAT_REPO
    FILE_SERVICE --> FILE_REPO
    ANALYTICS_SERVICE --> PERF_REPO
    SETTINGS_SERVICE --> SETTINGS_REPO
    
    EMAIL_SERVICE --> EMAIL_PROVIDER
    NOTIF_SERVICE --> SMS_PROVIDER
    LOC_SERVICE --> MAPS_API
    NOTIF_SERVICE --> PUSH_PROVIDER
    FILE_SERVICE --> FILE_STORAGE
```

## 5. Real-time Communication Flow

```mermaid
sequenceDiagram
    participant User as User Browser
    participant Employee as Employee App
    participant WebSocket as WebSocket Server
    participant TicketService as Ticket Service
    participant NotificationService as Notification Service
    participant Database as Database
    
    User->>TicketService: Create Ticket
    TicketService->>Database: Save Ticket
    TicketService->>NotificationService: Send Notifications
    
    NotificationService->>WebSocket: Broadcast to Admin
    WebSocket->>Employee: Real-time Notification
    
    Employee->>TicketService: Accept Ticket
    TicketService->>Database: Update Status
    TicketService->>NotificationService: Status Update
    
    NotificationService->>WebSocket: Broadcast Update
    WebSocket->>User: Status Change Notification
    
    Employee->>WebSocket: Location Update
    WebSocket->>Database: Save Location
    WebSocket->>User: Employee Location
    
    User->>WebSocket: Send Chat Message
    WebSocket->>Database: Save Message
    WebSocket->>Employee: New Message
    
    Employee->>WebSocket: Reply Message
    WebSocket->>Database: Save Reply
    WebSocket->>User: Employee Reply
```

## 6. Security Architecture Diagram

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS[HTTPS/TLS 1.3<br/>Encrypted Communication]
        CSP[Content Security Policy<br/>XSS Protection]
        CORS[CORS Configuration<br/>Cross-Origin Control]
    end
    
    subgraph "API Gateway Security"
        RATE_LIMIT[Rate Limiting<br/>DDoS Protection]
        API_KEY[API Key Validation<br/>Client Authentication]
        WAF[Web Application Firewall<br/>Attack Prevention]
    end
    
    subgraph "Application Security"
        JWT_AUTH[JWT Authentication<br/>Stateless Tokens]
        RBAC[Role-Based Access Control<br/>Permission Management]
        INPUT_VAL[Input Validation<br/>SQL Injection Prevention]
        AUDIT[Audit Logging<br/>Security Monitoring]
    end
    
    subgraph "Data Security"
        ENCRYPTION[Data Encryption<br/>AES-256]
        HASHING[Password Hashing<br/>BCrypt]
        BACKUP_ENC[Backup Encryption<br/>Secure Storage]
        PII_MASK[PII Masking<br/>Data Privacy]
    end
    
    subgraph "Infrastructure Security"
        VPC[Virtual Private Cloud<br/>Network Isolation]
        FIREWALL[Network Firewall<br/>Traffic Control]
        MONITORING[Security Monitoring<br/>Threat Detection]
        COMPLIANCE[Compliance<br/>GDPR/SOC2]
    end
    
    HTTPS --> RATE_LIMIT
    CSP --> API_KEY
    CORS --> WAF
    
    RATE_LIMIT --> JWT_AUTH
    API_KEY --> RBAC
    WAF --> INPUT_VAL
    
    JWT_AUTH --> ENCRYPTION
    RBAC --> HASHING
    INPUT_VAL --> BACKUP_ENC
    AUDIT --> PII_MASK
    
    ENCRYPTION --> VPC
    HASHING --> FIREWALL
    BACKUP_ENC --> MONITORING
    PII_MASK --> COMPLIANCE
```

## 7. Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Load Balancer Tier"
            ALB[Application Load Balancer<br/>AWS ALB/Nginx]
        end
        
        subgraph "Application Tier"
            APP1[Spring Boot App 1<br/>Auto Scaling Group]
            APP2[Spring Boot App 2<br/>Auto Scaling Group]
            APP3[Spring Boot App 3<br/>Auto Scaling Group]
        end
        
        subgraph "Database Tier"
            DB_MASTER[(PostgreSQL Master<br/>RDS/Self-hosted)]
            DB_REPLICA[(PostgreSQL Replica<br/>Read-only)]
        end
        
        subgraph "Cache Tier"
            REDIS_CLUSTER[Redis Cluster<br/>ElastiCache/Self-hosted]
        end
        
        subgraph "File Storage"
            S3_BUCKET[S3 Bucket<br/>File Storage]
        end
        
        subgraph "Monitoring"
            PROMETHEUS[Prometheus<br/>Metrics Collection]
            GRAFANA[Grafana<br/>Visualization]
            ELK[ELK Stack<br/>Log Analysis]
        end
    end
    
    subgraph "CI/CD Pipeline"
        GIT[Git Repository<br/>Source Code]
        JENKINS[Jenkins/GitHub Actions<br/>Build Pipeline]
        DOCKER[Docker Registry<br/>Container Images]
        K8S[Kubernetes<br/>Container Orchestration]
    end
    
    ALB --> APP1
    ALB --> APP2
    ALB --> APP3
    
    APP1 --> DB_MASTER
    APP2 --> DB_REPLICA
    APP3 --> DB_MASTER
    
    APP1 --> REDIS_CLUSTER
    APP2 --> REDIS_CLUSTER
    APP3 --> REDIS_CLUSTER
    
    APP1 --> S3_BUCKET
    APP2 --> S3_BUCKET
    APP3 --> S3_BUCKET
    
    APP1 --> PROMETHEUS
    APP2 --> PROMETHEUS
    APP3 --> PROMETHEUS
    
    PROMETHEUS --> GRAFANA
    APP1 --> ELK
    APP2 --> ELK
    APP3 --> ELK
    
    GIT --> JENKINS
    JENKINS --> DOCKER
    DOCKER --> K8S
    K8S --> APP1
    K8S --> APP2
    K8S --> APP3
```

## 8. Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend Layer"
        REACT[React Application<br/>TypeScript]
    end
    
    subgraph "API Layer"
        REST[REST API<br/>Spring Boot]
        WEBSOCKET[WebSocket API<br/>Real-time]
    end
    
    subgraph "Business Logic"
        SERVICE[Service Layer<br/>Business Rules]
    end
    
    subgraph "Data Access"
        REPOSITORY[Repository Layer<br/>JPA/Hibernate]
    end
    
    subgraph "Data Storage"
        DATABASE[(PostgreSQL<br/>Primary Data)]
        CACHE[(Redis<br/>Session/Cache)]
        FILES[(S3/MinIO<br/>File Storage)]
    end
    
    subgraph "External APIs"
        EMAIL[Email Service]
        SMS[SMS Service]
        MAPS[Maps API]
        PUSH[Push Notifications]
    end
    
    REACT -->|HTTP/HTTPS| REST
    REACT -->|WebSocket| WEBSOCKET
    
    REST --> SERVICE
    WEBSOCKET --> SERVICE
    
    SERVICE --> REPOSITORY
    SERVICE --> EMAIL
    SERVICE --> SMS
    SERVICE --> MAPS
    SERVICE --> PUSH
    
    REPOSITORY --> DATABASE
    REPOSITORY --> CACHE
    SERVICE --> FILES
```

These comprehensive diagrams provide a complete visual representation of the system architecture, covering all aspects from high-level system design to detailed component interactions, security layers, and deployment strategies.