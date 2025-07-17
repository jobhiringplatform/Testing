# Java Spring Boot Architecture - Service Ticket System

## Package Structure Diagram

```
com.serviceai.ticketsystem
├── ServiceTicketSystemApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── WebConfig.java
│   ├── DatabaseConfig.java
│   └── SwaggerConfig.java
├── controller/
│   ├── AuthController.java
│   ├── TicketController.java
│   ├── UserController.java
│   ├── EmployeeController.java
│   ├── AdminController.java
│   └── ReviewController.java
├── service/ (BLC - Business Logic Components)
│   ├── interfaces/
│   │   ├── AuthService.java
│   │   ├── TicketService.java
│   │   ├── UserService.java
│   │   ├── EmployeeService.java
│   │   ├── NotificationService.java
│   │   └── ReviewService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       ├── TicketServiceImpl.java
│       ├── UserServiceImpl.java
│       ├── EmployeeServiceImpl.java
│       ├── NotificationServiceImpl.java
│       └── ReviewServiceImpl.java
├── repository/ (Data Access Layer)
│   ├── UserRepository.java
│   ├── EmployeeRepository.java
│   ├── TicketRepository.java
│   ├── ReviewRepository.java
│   └── NotificationRepository.java
├── entity/ (ELC - Entity Logic Components)
│   ├── User.java
│   ├── Employee.java
│   ├── Ticket.java
│   ├── Review.java
│   ├── Notification.java
│   └── Location.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── TicketCreateRequest.java
│   │   ├── ReviewRequest.java
│   │   └── LocationUpdateRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── TicketResponse.java
│       ├── UserResponse.java
│       ├── EmployeeResponse.java
│       └── ReviewResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── ValidationException.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── UserPrincipal.java
│   └── CustomUserDetailsService.java
├── util/
│   ├── DateUtil.java
│   ├── ValidationUtil.java
│   └── LocationUtil.java
└── constants/
    ├── AppConstants.java
    ├── SecurityConstants.java
    └── MessageConstants.java
```

## Entity Logic Components (ELC) - Database Entities

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String phone;
    
    @Column
    private String department;
    
    @Enumerated(EnumType.STRING)
    private UserRole role; // USER, EMPLOYEE, ADMIN
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
    
    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL)
    private List<Review> reviewsGiven;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}
```

### Employee Entity
```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column
    private String specialization;
    
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status; // AVAILABLE, BUSY, ON_ROUTE, OFFLINE
    
    @OneToMany(mappedBy = "assignedEmployee", cascade = CascadeType.ALL)
    private List<Ticket> assignedTickets;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Review> reviews;
    
    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private Location currentLocation;
    
    @Column
    private Double averageRating;
    
    @Column
    private Integer totalReviews;
    
    // Constructors, getters, setters
}
```

### Ticket Entity
```java
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String ticketNumber;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TicketPriority priority; // LOW, MEDIUM, HIGH, CRITICAL
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status; // PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private String location;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Review> reviews;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime resolvedAt;
    
    // Constructors, getters, setters
}
```

### Review Entity
```java
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<ReviewCategory> categories;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
}
```

### Location Entity
```java
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column
    private String address;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}
```

## Business Logic Components (BLC) - Service Layer

### AuthService Interface & Implementation
```java
public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    void logout(String token);
    boolean validateToken(String token);
    UserPrincipal getCurrentUser();
}

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    public AuthResponse login(LoginRequest request) {
        // Business Logic:
        // 1. Validate user credentials
        // 2. Check user status and role
        // 3. Generate JWT token
        // 4. Update last login timestamp
        // 5. Return authentication response
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
            
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        String token = tokenProvider.generateToken(user);
        
        return AuthResponse.builder()
            .token(token)
            .user(UserResponse.fromEntity(user))
            .build();
    }
    
    @Override
    public AuthResponse register(RegisterRequest request) {
        // Business Logic:
        // 1. Validate registration data
        // 2. Check if user already exists
        // 3. Create new user with USER role
        // 4. Hash password
        // 5. Save user and generate token
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already exists");
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .phone(request.getPhone())
            .department(request.getDepartment())
            .role(UserRole.USER)
            .build();
            
        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user);
        
        return AuthResponse.builder()
            .token(token)
            .user(UserResponse.fromEntity(user))
            .build();
    }
}
```

### TicketService Interface & Implementation
```java
public interface TicketService {
    TicketResponse createTicket(TicketCreateRequest request);
    TicketResponse updateTicketStatus(Long ticketId, TicketStatus status);
    TicketResponse assignTicket(Long ticketId, Long employeeId);
    List<TicketResponse> getUserTickets(Long userId);
    List<TicketResponse> getEmployeeTickets(Long employeeId);
    List<TicketResponse> getAllTickets();
    TicketResponse getTicketById(Long ticketId);
    void deleteTicket(Long ticketId);
}

@Service
@Transactional
public class TicketServiceImpl implements TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Override
    public TicketResponse createTicket(TicketCreateRequest request) {
        // Business Logic:
        // 1. Validate ticket data
        // 2. Generate unique ticket number
        // 3. Set initial status as PENDING
        // 4. Auto-assign based on category and availability
        // 5. Send notifications
        
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        String ticketNumber = generateTicketNumber();
        
        Ticket ticket = Ticket.builder()
            .ticketNumber(ticketNumber)
            .title(request.getTitle())
            .description(request.getDescription())
            .priority(request.getPriority())
            .status(TicketStatus.PENDING)
            .category(request.getCategory())
            .location(request.getLocation())
            .user(user)
            .build();
            
        ticket = ticketRepository.save(ticket);
        
        // Auto-assign to available employee
        autoAssignTicket(ticket);
        
        // Send notification
        notificationService.sendTicketCreatedNotification(ticket);
        
        return TicketResponse.fromEntity(ticket);
    }
    
    @Override
    public TicketResponse assignTicket(Long ticketId, Long employeeId) {
        // Business Logic:
        // 1. Validate ticket and employee existence
        // 2. Check employee availability
        // 3. Update ticket assignment
        // 4. Update employee status
        // 5. Send notifications to all parties
        
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
            
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            
        if (employee.getStatus() != EmployeeStatus.AVAILABLE) {
            throw new ValidationException("Employee is not available");
        }
        
        ticket.setAssignedEmployee(employee);
        ticket.setStatus(TicketStatus.ASSIGNED);
        
        employee.setStatus(EmployeeStatus.BUSY);
        
        ticketRepository.save(ticket);
        employeeRepository.save(employee);
        
        // Send notifications
        notificationService.sendTicketAssignedNotification(ticket);
        
        return TicketResponse.fromEntity(ticket);
    }
    
    private void autoAssignTicket(Ticket ticket) {
        // Business Logic for auto-assignment:
        // 1. Find available employees in relevant department
        // 2. Consider workload and ratings
        // 3. Assign to best match
        
        List<Employee> availableEmployees = employeeRepository
            .findByStatusAndUserDepartment(EmployeeStatus.AVAILABLE, ticket.getCategory());
            
        if (!availableEmployees.isEmpty()) {
            Employee bestEmployee = availableEmployees.stream()
                .min(Comparator.comparing(emp -> emp.getAssignedTickets().size()))
                .orElse(availableEmployees.get(0));
                
            assignTicket(ticket.getId(), bestEmployee.getId());
        }
    }
}
```

### EmployeeService Interface & Implementation
```java
public interface EmployeeService {
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse getEmployeeById(Long employeeId);
    EmployeeResponse updateEmployeeStatus(Long employeeId, EmployeeStatus status);
    EmployeeResponse updateEmployeeLocation(Long employeeId, LocationUpdateRequest request);
    List<EmployeeResponse> getAvailableEmployees();
    EmployeeResponse getEmployeeStats(Long employeeId);
}

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private LocationService locationService;
    
    @Override
    public EmployeeResponse updateEmployeeLocation(Long employeeId, LocationUpdateRequest request) {
        // Business Logic:
        // 1. Validate employee existence
        // 2. Update location coordinates
        // 3. Reverse geocode address if needed
        // 4. Update timestamp
        // 5. Notify admin of location change
        
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            
        Location location = employee.getCurrentLocation();
        if (location == null) {
            location = new Location();
            location.setEmployee(employee);
        }
        
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setAddress(request.getAddress());
        
        employee.setCurrentLocation(location);
        employee = employeeRepository.save(employee);
        
        return EmployeeResponse.fromEntity(employee);
    }
    
    @Override
    public EmployeeResponse getEmployeeStats(Long employeeId) {
        // Business Logic:
        // 1. Calculate performance metrics
        // 2. Get review statistics
        // 3. Calculate completion rates
        // 4. Generate performance insights
        
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            
        // Calculate stats
        long totalTickets = employee.getAssignedTickets().size();
        long resolvedTickets = employee.getAssignedTickets().stream()
            .mapToLong(ticket -> ticket.getStatus() == TicketStatus.RESOLVED ? 1 : 0)
            .sum();
            
        double completionRate = totalTickets > 0 ? (double) resolvedTickets / totalTickets * 100 : 0;
        
        EmployeeResponse response = EmployeeResponse.fromEntity(employee);
        response.setCompletionRate(completionRate);
        response.setTotalTicketsHandled(totalTickets);
        
        return response;
    }
}
```

### ReviewService Interface & Implementation
```java
public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request);
    List<ReviewResponse> getEmployeeReviews(Long employeeId);
    List<ReviewResponse> getAllReviews();
    ReviewResponse getReviewById(Long reviewId);
    void deleteReview(Long reviewId);
    Double calculateEmployeeAverageRating(Long employeeId);
}

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        // Business Logic:
        // 1. Validate review data
        // 2. Check if ticket is completed
        // 3. Ensure user can review this employee
        // 4. Create review
        // 5. Update employee rating
        // 6. Send notification to employee
        
        Ticket ticket = ticketRepository.findById(request.getTicketId())
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
            
        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new ValidationException("Can only review completed tickets");
        }
        
        Employee employee = ticket.getAssignedEmployee();
        if (employee == null) {
            throw new ValidationException("No employee assigned to this ticket");
        }
        
        // Check if review already exists
        if (reviewRepository.existsByTicketAndReviewer(ticket, ticket.getUser())) {
            throw new ValidationException("Review already exists for this ticket");
        }
        
        Review review = Review.builder()
            .ticket(ticket)
            .employee(employee)
            .reviewer(ticket.getUser())
            .rating(request.getRating())
            .comment(request.getComment())
            .categories(request.getCategories())
            .build();
            
        review = reviewRepository.save(review);
        
        // Update employee average rating
        updateEmployeeRating(employee);
        
        return ReviewResponse.fromEntity(review);
    }
    
    private void updateEmployeeRating(Employee employee) {
        // Business Logic:
        // 1. Calculate new average rating
        // 2. Update total review count
        // 3. Save employee data
        
        List<Review> reviews = reviewRepository.findByEmployee(employee);
        
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
                
            employee.setAverageRating(averageRating);
            employee.setTotalReviews(reviews.size());
            
            employeeRepository.save(employee);
        }
    }
}
```

## Controller Layer (REST API Endpoints)

### TicketController
```java
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse response = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getUserTickets(@PathVariable Long userId) {
        List<TicketResponse> tickets = ticketService.getUserTickets(userId);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getEmployeeTickets(@PathVariable Long employeeId) {
        List<TicketResponse> tickets = ticketService.getEmployeeTickets(employeeId);
        return ResponseEntity.ok(tickets);
    }
    
    @PutMapping("/{ticketId}/assign/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Long ticketId, 
            @PathVariable Long employeeId) {
        TicketResponse response = ticketService.assignTicket(ticketId, employeeId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{ticketId}/status")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long ticketId, 
            @RequestParam TicketStatus status) {
        TicketResponse response = ticketService.updateTicketStatus(ticketId, status);
        return ResponseEntity.ok(response);
    }
}
```

## Data Flow Architecture

```
Frontend (React) 
    ↓ HTTP Requests
Controller Layer (REST API)
    ↓ Method Calls
Service Layer (BLC - Business Logic)
    ↓ Repository Calls
Repository Layer (Data Access)
    ↓ JPA/Hibernate
Database (PostgreSQL/MySQL)
```

## Key Design Patterns Used

1. **Repository Pattern**: Data access abstraction
2. **Service Layer Pattern**: Business logic encapsulation
3. **DTO Pattern**: Data transfer between layers
4. **Builder Pattern**: Object construction
5. **Strategy Pattern**: Different assignment strategies
6. **Observer Pattern**: Notification system
7. **Factory Pattern**: Token generation

## Security Architecture

```
JWT Authentication Filter
    ↓
Security Context
    ↓
Method-level Security (@PreAuthorize)
    ↓
Role-based Access Control
    ↓
Business Logic Validation
```

This architecture provides a robust, scalable, and maintainable Spring Boot application with clear separation of concerns between Entity Logic Components (ELC) and Business Logic Components (BLC).