# Low-Level Design (LLD) - Service Ticket System

## 1. Detailed Component Design

### 1.1 Authentication Service (AuthService)

#### Class Structure
```java
@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    
    // Dependencies
    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private NotificationService notificationService;
    @Autowired private UserSettingsService userSettingsService;
    
    // Method implementations with detailed business logic
}
```

#### Method: login(LoginRequest request)
```java
public AuthResponse login(LoginRequest request) {
    // Step 1: Input validation
    validateLoginRequest(request);
    
    // Step 2: Find user by email and role
    User user = userRepository.findByEmailAndRole(request.getEmail(), request.getRole())
        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
    
    // Step 3: Account status validation
    if (!user.getIsActive()) {
        throw new UnauthorizedException("Account is deactivated");
    }
    
    // Step 4: Password verification
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        // Log failed attempt
        logFailedLoginAttempt(user, request.getIpAddress());
        throw new UnauthorizedException("Invalid credentials");
    }
    
    // Step 5: Update last login timestamp
    user.setLastLogin(LocalDateTime.now());
    userRepository.save(user);
    
    // Step 6: Generate JWT token with role-based claims
    String token = tokenProvider.generateToken(user);
    
    // Step 7: Create login notification
    notificationService.createLoginNotification(user, request.getIpAddress());
    
    // Step 8: Build response
    return AuthResponse.builder()
        .token(token)
        .user(UserResponse.fromEntity(user))
        .expiresIn(tokenProvider.getExpirationTime())
        .permissions(getRolePermissions(user.getRole()))
        .build();
}

private void validateLoginRequest(LoginRequest request) {
    if (StringUtils.isEmpty(request.getEmail())) {
        throw new ValidationException("Email is required");
    }
    if (StringUtils.isEmpty(request.getPassword())) {
        throw new ValidationException("Password is required");
    }
    if (request.getRole() == null) {
        throw new ValidationException("Role is required");
    }
}
```

### 1.2 Ticket Service (TicketService)

#### Auto-Assignment Algorithm
```java
private Employee calculateBestEmployeeForTicket(Ticket ticket, List<Employee> availableEmployees) {
    return availableEmployees.stream()
        .map(employee -> {
            double score = calculateEmployeeScore(employee, ticket);
            return new EmployeeScore(employee, score);
        })
        .max(Comparator.comparing(EmployeeScore::getScore))
        .map(EmployeeScore::getEmployee)
        .orElse(null);
}

private double calculateEmployeeScore(Employee employee, Ticket ticket) {
    double workloadScore = calculateWorkloadScore(employee);      // 30%
    double ratingScore = calculateRatingScore(employee);         // 25%
    double locationScore = calculateLocationScore(employee, ticket); // 20%
    double specializationScore = calculateSpecializationScore(employee, ticket); // 15%
    double responseTimeScore = calculateResponseTimeScore(employee); // 10%
    
    return (workloadScore * 0.30) + 
           (ratingScore * 0.25) + 
           (locationScore * 0.20) + 
           (specializationScore * 0.15) + 
           (responseTimeScore * 0.10);
}

private double calculateWorkloadScore(Employee employee) {
    int currentTickets = employee.getAssignedTickets().size();
    int maxCapacity = getEmployeeMaxCapacity(employee);
    
    // Higher score for lower workload
    return Math.max(0, (maxCapacity - currentTickets) / (double) maxCapacity);
}

private double calculateLocationScore(Employee employee, Ticket ticket) {
    if (employee.getCurrentLocation() == null) {
        return 0.5; // Neutral score if location unknown
    }
    
    double distance = LocationUtil.calculateDistance(
        employee.getCurrentLocation().getLatitude(),
        employee.getCurrentLocation().getLongitude(),
        ticket.getLocationLatitude(),
        ticket.getLocationLongitude()
    );
    
    // Closer employees get higher scores
    double maxDistance = 50.0; // 50 km max consideration
    return Math.max(0, (maxDistance - distance) / maxDistance);
}
```

#### Ticket Status Transition Logic
```java
public TicketResponse updateTicketStatus(Long ticketId, TicketStatus newStatus, String notes) {
    Ticket ticket = getTicketById(ticketId);
    TicketStatus oldStatus = ticket.getStatus();
    
    // Validate status transition
    validateStatusTransition(oldStatus, newStatus);
    
    // Update ticket
    ticket.setStatus(newStatus);
    updateTicketTimestamps(ticket, newStatus);
    
    // Handle status-specific logic
    switch (newStatus) {
        case ASSIGNED:
            handleTicketAssigned(ticket);
            break;
        case IN_PROGRESS:
            handleTicketInProgress(ticket);
            break;
        case RESOLVED:
            handleTicketResolved(ticket);
            break;
        case CLOSED:
            handleTicketClosed(ticket);
            break;
    }
    
    ticket = ticketRepository.save(ticket);
    
    // Create timeline entry
    createTimelineEntry(ticket, newStatus, notes, getCurrentUser());
    
    // Send notifications
    notificationService.sendTicketStatusUpdatedNotification(ticket, oldStatus, newStatus);
    
    // Update analytics
    analyticsService.recordTicketStatusChange(ticket, oldStatus, newStatus);
    
    return TicketResponse.fromEntity(ticket);
}

private void validateStatusTransition(TicketStatus from, TicketStatus to) {
    Map<TicketStatus, Set<TicketStatus>> validTransitions = Map.of(
        TicketStatus.PENDING, Set.of(TicketStatus.ASSIGNED, TicketStatus.CLOSED),
        TicketStatus.ASSIGNED, Set.of(TicketStatus.IN_PROGRESS, TicketStatus.PENDING, TicketStatus.CLOSED),
        TicketStatus.IN_PROGRESS, Set.of(TicketStatus.RESOLVED, TicketStatus.ASSIGNED),
        TicketStatus.RESOLVED, Set.of(TicketStatus.CLOSED, TicketStatus.IN_PROGRESS),
        TicketStatus.CLOSED, Set.of() // Terminal state
    );
    
    if (!validTransitions.get(from).contains(to)) {
        throw new ValidationException(
            String.format("Invalid status transition from %s to %s", from, to)
        );
    }
}
```

### 1.3 Location Service (LocationService)

#### Real-time Location Tracking
```java
@Service
@Transactional
public class LocationServiceImpl implements LocationService {
    
    @Autowired private LocationRepository locationRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private WebSocketHandler webSocketHandler;
    @Autowired private GeofencingService geofencingService;
    
    public LocationResponse updateEmployeeLocation(Long employeeId, LocationUpdateRequest request) {
        Employee employee = getEmployeeById(employeeId);
        
        // Validate location accuracy
        validateLocationAccuracy(request);
        
        // Get or create location record
        Location location = getOrCreateLocation(employee);
        Location previousLocation = cloneLocation(location);
        
        // Update location data
        updateLocationData(location, request);
        
        // Calculate movement metrics
        if (previousLocation != null) {
            calculateMovementMetrics(employee, previousLocation, location);
        }
        
        // Check geofencing rules
        checkGeofencingRules(employee, location);
        
        // Save location
        location = locationRepository.save(location);
        
        // Broadcast real-time update
        broadcastLocationUpdate(employee, location);
        
        // Update ticket ETAs
        updateTicketETAs(employee);
        
        return LocationResponse.fromEntity(location);
    }
    
    private void calculateMovementMetrics(Employee employee, Location from, Location to) {
        double distance = LocationUtil.calculateDistance(
            from.getLatitude(), from.getLongitude(),
            to.getLatitude(), to.getLongitude()
        );
        
        long timeDiff = Duration.between(from.getUpdatedAt(), to.getUpdatedAt()).toMinutes();
        
        if (timeDiff > 0) {
            double speed = distance / (timeDiff / 60.0); // km/h
            
            // Update employee movement statistics
            updateEmployeeMovementStats(employee, distance, speed);
            
            // Check for unusual movement patterns
            if (speed > SPEED_THRESHOLD) {
                notificationService.sendSpeedAlertNotification(employee, speed);
            }
        }
    }
    
    private void checkGeofencingRules(Employee employee, Location location) {
        List<GeofenceRule> rules = geofencingService.getActiveRulesForEmployee(employee);
        
        for (GeofenceRule rule : rules) {
            boolean isInside = geofencingService.isLocationInsideGeofence(location, rule.getGeofence());
            
            if (rule.getType() == GeofenceType.ENTRY && isInside && !rule.wasTriggered()) {
                handleGeofenceEntry(employee, rule);
            } else if (rule.getType() == GeofenceType.EXIT && !isInside && rule.wasTriggered()) {
                handleGeofenceExit(employee, rule);
            }
        }
    }
}
```

### 1.4 Review Service (ReviewService)

#### Review Analytics and Rating Calculation
```java
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    public ReviewResponse createReview(ReviewRequest request) {
        // Validate review eligibility
        validateReviewEligibility(request);
        
        // Create review entity
        Review review = buildReviewEntity(request);
        review = reviewRepository.save(review);
        
        // Update employee ratings
        updateEmployeeRatingMetrics(review.getEmployee());
        
        // Send notifications
        notificationService.sendReviewCreatedNotification(review);
        
        // Update analytics
        analyticsService.recordReviewCreated(review);
        
        return ReviewResponse.fromEntity(review);
    }
    
    private void updateEmployeeRatingMetrics(Employee employee) {
        List<Review> reviews = reviewRepository.findByEmployeeAndIsPublished(employee, true);
        
        if (reviews.isEmpty()) return;
        
        // Calculate overall metrics
        ReviewMetrics metrics = calculateReviewMetrics(reviews);
        
        // Update employee entity
        employee.setAverageRating(metrics.getAverageRating());
        employee.setTotalReviews(metrics.getTotalReviews());
        
        // Update performance metrics
        updatePerformanceMetrics(employee, metrics);
        
        // Check for achievements
        checkReviewAchievements(employee, metrics);
        
        employeeRepository.save(employee);
    }
    
    private ReviewMetrics calculateReviewMetrics(List<Review> reviews) {
        // Overall rating calculation
        double averageRating = reviews.stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0.0);
        
        // Rating distribution
        Map<Integer, Long> ratingDistribution = reviews.stream()
            .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
        
        // Category-wise ratings
        Map<ReviewCategory, Double> categoryRatings = calculateCategoryRatings(reviews);
        
        // Trend analysis (last 30 days vs previous 30 days)
        ReviewTrend trend = calculateReviewTrend(reviews);
        
        return ReviewMetrics.builder()
            .averageRating(averageRating)
            .totalReviews(reviews.size())
            .ratingDistribution(ratingDistribution)
            .categoryRatings(categoryRatings)
            .trend(trend)
            .build();
    }
    
    private Map<ReviewCategory, Double> calculateCategoryRatings(List<Review> reviews) {
        Map<ReviewCategory, List<Integer>> categoryScores = new HashMap<>();
        
        for (Review review : reviews) {
            for (ReviewCategory category : review.getCategories()) {
                categoryScores.computeIfAbsent(category, k -> new ArrayList<>())
                    .add(review.getRating());
            }
        }
        
        return categoryScores.entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                entry -> entry.getValue().stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0.0)
            ));
    }
}
```

### 1.5 Notification Service (NotificationService)

#### Multi-channel Notification System
```java
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private EmailService emailService;
    @Autowired private PushNotificationService pushService;
    @Autowired private WebSocketHandler webSocketHandler;
    @Autowired private UserSettingsService userSettingsService;
    
    public void sendTicketCreatedNotification(Ticket ticket) {
        // Create notifications for different stakeholders
        List<NotificationTarget> targets = determineNotificationTargets(ticket, NotificationType.TICKET_CREATED);
        
        for (NotificationTarget target : targets) {
            createAndSendNotification(target, ticket);
        }
    }
    
    private void createAndSendNotification(NotificationTarget target, Object relatedEntity) {
        // Create database notification
        Notification notification = buildNotification(target, relatedEntity);
        notification = notificationRepository.save(notification);
        
        // Send through multiple channels based on user preferences
        UserSettings settings = userSettingsService.getUserSettings(target.getUser());
        
        // Real-time WebSocket notification (always sent)
        sendWebSocketNotification(target.getUser(), notification);
        
        // Email notification (if enabled)
        if (shouldSendEmail(settings, target.getType())) {
            sendEmailNotification(target.getUser(), notification);
        }
        
        // Push notification (if enabled)
        if (shouldSendPush(settings, target.getType())) {
            sendPushNotification(target.getUser(), notification);
        }
        
        // SMS notification (for critical alerts only)
        if (shouldSendSMS(settings, target.getType())) {
            sendSMSNotification(target.getUser(), notification);
        }
    }
    
    private void sendWebSocketNotification(User user, Notification notification) {
        try {
            NotificationMessage message = NotificationMessage.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .timestamp(notification.getCreatedAt())
                .relatedEntityId(notification.getRelatedEntityId())
                .build();
                
            webSocketHandler.sendToUser(user.getId().toString(), "/notifications", message);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification to user {}: {}", user.getId(), e.getMessage());
        }
    }
    
    private boolean shouldSendEmail(UserSettings settings, NotificationType type) {
        if (!settings.getEmailNotifications()) return false;
        
        return switch (type) {
            case TICKET_CREATED, TICKET_ASSIGNED -> settings.getTicketUpdates();
            case TICKET_RESOLVED, TICKET_CLOSED -> settings.getTicketUpdates();
            case REVIEW_CREATED -> settings.getAssignments();
            case EMPLOYEE_LOCATION_UPDATED -> false; // Too frequent for email
            default -> true;
        };
    }
}
```

## 2. Database Schema Design

### 2.1 Core Tables with Indexes

```sql
-- Users table with optimized indexes
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    avatar VARCHAR(500),
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'EMPLOYEE', 'ADMIN')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_department ON users(department);

-- Tickets table with comprehensive indexing
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    category VARCHAR(100) NOT NULL,
    location VARCHAR(500) NOT NULL,
    estimated_time VARCHAR(50),
    user_id BIGINT NOT NULL REFERENCES users(id),
    assigned_employee_id BIGINT REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP,
    started_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- Performance indexes for tickets
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_assigned_employee_id ON tickets(assigned_employee_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_status_priority ON tickets(status, priority);
```

### 2.2 Advanced Queries and Stored Procedures

```sql
-- Stored procedure for auto-assignment algorithm
CREATE OR REPLACE FUNCTION auto_assign_ticket(ticket_id BIGINT)
RETURNS BIGINT AS $$
DECLARE
    ticket_category VARCHAR(100);
    best_employee_id BIGINT;
    employee_score DECIMAL;
    max_score DECIMAL := 0;
    emp_record RECORD;
BEGIN
    -- Get ticket category
    SELECT category INTO ticket_category FROM tickets WHERE id = ticket_id;
    
    -- Find best employee using scoring algorithm
    FOR emp_record IN 
        SELECT e.id, e.user_id, u.department, e.status, e.average_rating,
               COUNT(t.id) as current_workload,
               l.latitude, l.longitude
        FROM employees e
        JOIN users u ON e.user_id = u.id
        LEFT JOIN tickets t ON e.id = t.assigned_employee_id AND t.status IN ('ASSIGNED', 'IN_PROGRESS')
        LEFT JOIN locations l ON e.id = l.employee_id
        WHERE e.status = 'AVAILABLE' 
        AND u.department = ticket_category
        GROUP BY e.id, e.user_id, u.department, e.status, e.average_rating, l.latitude, l.longitude
    LOOP
        -- Calculate employee score
        employee_score := calculate_employee_score(
            emp_record.current_workload,
            emp_record.average_rating,
            emp_record.latitude,
            emp_record.longitude,
            ticket_id
        );
        
        IF employee_score > max_score THEN
            max_score := employee_score;
            best_employee_id := emp_record.id;
        END IF;
    END LOOP;
    
    -- Assign ticket to best employee
    IF best_employee_id IS NOT NULL THEN
        UPDATE tickets 
        SET assigned_employee_id = best_employee_id, 
            status = 'ASSIGNED',
            assigned_at = CURRENT_TIMESTAMP
        WHERE id = ticket_id;
        
        UPDATE employees 
        SET status = 'BUSY' 
        WHERE id = best_employee_id;
    END IF;
    
    RETURN best_employee_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate employee score
CREATE OR REPLACE FUNCTION calculate_employee_score(
    workload INTEGER,
    rating DECIMAL,
    emp_lat DECIMAL,
    emp_lng DECIMAL,
    ticket_id BIGINT
) RETURNS DECIMAL AS $$
DECLARE
    workload_score DECIMAL;
    rating_score DECIMAL;
    location_score DECIMAL;
    total_score DECIMAL;
    ticket_lat DECIMAL;
    ticket_lng DECIMAL;
    distance DECIMAL;
BEGIN
    -- Workload score (30% weight)
    workload_score := GREATEST(0, (10 - workload) / 10.0);
    
    -- Rating score (25% weight)
    rating_score := COALESCE(rating, 3.0) / 5.0;
    
    -- Location score (20% weight)
    IF emp_lat IS NOT NULL AND emp_lng IS NOT NULL THEN
        -- Get ticket location (simplified - in real implementation, parse from location string)
        SELECT 40.7128, -74.0060 INTO ticket_lat, ticket_lng; -- Example coordinates
        
        -- Calculate distance using Haversine formula
        distance := calculate_distance(emp_lat, emp_lng, ticket_lat, ticket_lng);
        location_score := GREATEST(0, (50 - distance) / 50.0); -- 50km max distance
    ELSE
        location_score := 0.5; -- Neutral score if location unknown
    END IF;
    
    -- Calculate weighted total score
    total_score := (workload_score * 0.30) + (rating_score * 0.25) + (location_score * 0.20);
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;
```

## 3. API Design Specifications

### 3.1 RESTful API Endpoints with Detailed Specifications

```yaml
# OpenAPI 3.0 Specification
openapi: 3.0.0
info:
  title: Service Ticket System API
  version: 1.0.0
  description: Comprehensive API for service ticket management

paths:
  /api/auth/login:
    post:
      summary: User authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 6
                role:
                  type: string
                  enum: [USER, EMPLOYEE, ADMIN]
                ipAddress:
                  type: string
              required: [email, password, role]
      responses:
        200:
          description: Successful authentication
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/UserResponse'
                  expiresIn:
                    type: integer
                  permissions:
                    type: array
                    items:
                      type: string
        401:
          description: Invalid credentials
        400:
          description: Validation error

  /api/tickets:
    get:
      summary: Get tickets with filtering and pagination
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          schema:
            type: integer
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED]
        - name: priority
          in: query
          schema:
            type: string
            enum: [LOW, MEDIUM, HIGH, CRITICAL]
        - name: category
          in: query
          schema:
            type: string
        - name: assignedEmployeeId
          in: query
          schema:
            type: integer
        - name: userId
          in: query
          schema:
            type: integer
        - name: search
          in: query
          schema:
            type: string
      responses:
        200:
          description: List of tickets
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: array
                    items:
                      $ref: '#/components/schemas/TicketResponse'
                  totalElements:
                    type: integer
                  totalPages:
                    type: integer
                  size:
                    type: integer
                  number:
                    type: integer

    post:
      summary: Create new ticket
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                title:
                  type: string
                  maxLength: 500
                description:
                  type: string
                priority:
                  type: string
                  enum: [LOW, MEDIUM, HIGH, CRITICAL]
                category:
                  type: string
                location:
                  type: string
                attachments:
                  type: array
                  items:
                    type: string
                    format: binary
              required: [title, description, priority, category, location]
      responses:
        201:
          description: Ticket created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TicketResponse'
        400:
          description: Validation error
        401:
          description: Unauthorized

components:
  schemas:
    UserResponse:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
        name:
          type: string
        phone:
          type: string
        department:
          type: string
        role:
          type: string
          enum: [USER, EMPLOYEE, ADMIN]
        avatar:
          type: string
        isActive:
          type: boolean
        lastLogin:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time

    TicketResponse:
      type: object
      properties:
        id:
          type: integer
        ticketNumber:
          type: string
        title:
          type: string
        description:
          type: string
        priority:
          type: string
          enum: [LOW, MEDIUM, HIGH, CRITICAL]
        status:
          type: string
          enum: [PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED]
        category:
          type: string
        location:
          type: string
        estimatedTime:
          type: string
        user:
          $ref: '#/components/schemas/UserResponse'
        assignedEmployee:
          $ref: '#/components/schemas/EmployeeResponse'
        attachments:
          type: array
          items:
            $ref: '#/components/schemas/FileAttachmentResponse'
        timeline:
          type: array
          items:
            $ref: '#/components/schemas/TimelineResponse'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        assignedAt:
          type: string
          format: date-time
        resolvedAt:
          type: string
          format: date-time

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### 3.2 WebSocket Message Protocols

```javascript
// WebSocket message types and structures

// Notification messages
const NotificationMessage = {
    type: 'NOTIFICATION',
    payload: {
        id: 'number',
        title: 'string',
        message: 'string',
        notificationType: 'TICKET_CREATED | TICKET_ASSIGNED | TICKET_RESOLVED | ...',
        relatedEntityId: 'string',
        timestamp: 'ISO string',
        isRead: 'boolean'
    }
};

// Location update messages
const LocationUpdateMessage = {
    type: 'LOCATION_UPDATE',
    payload: {
        employeeId: 'number',
        employeeName: 'string',
        latitude: 'number',
        longitude: 'number',
        address: 'string',
        accuracy: 'number',
        timestamp: 'ISO string',
        status: 'AVAILABLE | BUSY | ON_ROUTE | OFFLINE'
    }
};

// Chat messages
const ChatMessage = {
    type: 'CHAT_MESSAGE',
    payload: {
        id: 'number',
        ticketId: 'number',
        senderId: 'number',
        senderName: 'string',
        senderRole: 'USER | EMPLOYEE | ADMIN',
        message: 'string',
        messageType: 'text | image | file | voice',
        attachmentUrl: 'string | null',
        timestamp: 'ISO string',
        isRead: 'boolean'
    }
};

// Ticket status updates
const TicketStatusMessage = {
    type: 'TICKET_STATUS_UPDATE',
    payload: {
        ticketId: 'number',
        ticketNumber: 'string',
        oldStatus: 'TicketStatus',
        newStatus: 'TicketStatus',
        updatedBy: 'UserResponse',
        notes: 'string',
        timestamp: 'ISO string'
    }
};
```

## 4. Security Implementation Details

### 4.1 JWT Token Structure and Validation

```java
@Component
public class JwtTokenProvider {
    
    private final String jwtSecret = "mySecretKey";
    private final int jwtExpirationInMs = 604800000; // 7 days
    
    public String generateToken(User user) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("name", user.getName())
                .claim("department", user.getDepartment())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public UserPrincipal getUserPrincipalFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        Long userId = Long.parseLong(claims.getSubject());
        String email = claims.get("email", String.class);
        String role = claims.get("role", String.class);
        String name = claims.get("name", String.class);
        String department = claims.get("department", String.class);
        
        return UserPrincipal.builder()
                .id(userId)
                .email(email)
                .role(UserRole.valueOf(role))
                .name(name)
                .department(department)
                .build();
    }
    
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }
}
```

### 4.2 Method-Level Security Configuration

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling()
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tickets/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/employee/**").hasAnyRole("EMPLOYEE", "ADMIN")
                .requestMatchers("/api/user/**").hasAnyRole("USER", "EMPLOYEE", "ADMIN")
                .anyRequest().authenticated()
            );
        
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}

// Method-level security examples
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or " +
                 "(hasRole('USER') and @ticketService.isTicketOwner(#id, authentication.name)) or " +
                 "(hasRole('EMPLOYEE') and @ticketService.isTicketAssignedTo(#id, authentication.name))")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id) {
        // Implementation
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or " +
                 "(hasRole('EMPLOYEE') and @ticketService.isTicketAssignedTo(#id, authentication.name))")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id, 
            @RequestParam TicketStatus status) {
        // Implementation
    }
}
```

## 5. Performance Optimization Strategies

### 5.1 Database Query Optimization

```java
// Repository with optimized queries
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Optimized query with proper indexing
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.user " +
           "LEFT JOIN FETCH t.assignedEmployee e " +
           "LEFT JOIN FETCH e.user " +
           "WHERE t.status = :status " +
           "ORDER BY t.priority DESC, t.createdAt ASC")
    List<Ticket> findByStatusWithDetails(@Param("status") TicketStatus status);
    
    // Pagination with counting query optimization
    @Query(value = "SELECT t FROM Ticket t WHERE t.category = :category",
           countQuery = "SELECT COUNT(t) FROM Ticket t WHERE t.category = :category")
    Page<Ticket> findByCategory(@Param("category") String category, Pageable pageable);
    
    // Native query for complex analytics
    @Query(value = """
        SELECT 
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) as total_tickets,
            COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_tickets,
            AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
        FROM tickets 
        WHERE created_at >= :startDate AND created_at <= :endDate
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
        """, nativeQuery = true)
    List<Object[]> getTicketAnalytics(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);
}
```

### 5.2 Caching Strategy Implementation

```java
@Service
@CacheConfig(cacheNames = "tickets")
public class TicketServiceImpl implements TicketService {
    
    @Cacheable(key = "#id")
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return TicketResponse.fromEntity(ticket);
    }
    
    @Cacheable(key = "'user-tickets-' + #userId + '-' + #status")
    public List<TicketResponse> getUserTickets(Long userId, TicketStatus status) {
        List<Ticket> tickets = ticketRepository.findByUserIdAndStatus(userId, status);
        return tickets.stream()
            .map(TicketResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @CacheEvict(key = "#result.id")
    public TicketResponse updateTicketStatus(Long ticketId, TicketStatus status) {
        // Implementation that returns updated ticket
    }
    
    @CacheEvict(allEntries = true)
    public void clearTicketCache() {
        // Manual cache clearing if needed
    }
}

// Redis configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}
```

This comprehensive LLD provides detailed implementation specifications for all major components, ensuring a robust, scalable, and maintainable system architecture.