# Member 4: Bus Tracking System - Technical Documentation

## Overview

The Bus Tracking System provides real-time GPS simulation and location tracking for school buses in RouteMate. It enables drivers to view live tracking data and parents to monitor bus locations with ETA estimates.

---

## Architecture

### Three-Layer Design

```
TrackingService (High-Level API)
        ↓
    Uses
        ↓
GPSSimulator + RouteManager (Low-Level Implementation)
        ↓
    Uses
        ↓
OOP Models (Bus, Location, Driver, Parent)
```

---

## Core Components

### 1. RouteManager

**Purpose**: Define and manage bus routes with waypoints

**Key Responsibilities**:
- Define predefined routes
- Store waypoint information
- Calculate distances between locations
- Track route progress

**Usage**:
```javascript
const routeManager = new RouteManager();

// Get route by ID
const route = routeManager.getRoute('ROUTE_B001');
console.log(route.name); // "Downtown - Government School Route"

// Calculate distance
const dist = routeManager.calculateDistance(31.52, 74.35, 31.53, 74.36);
console.log(dist); // distance in km

// Get waypoints
const waypoints = routeManager.getWaypoints('ROUTE_B001');
```

**Routes Defined**:

#### Route B001: Downtown to Government School
- Distance: 8.5 km
- Estimated Time: 25 minutes
- Waypoints: 9 locations
- Stops: S001, S002

Waypoints:
1. Starting Point (Depot) - (31.5204, 74.3587)
2. Waypoint 1 - Main Street - (31.5250, 74.3600)
3. Waypoint 2 - Market Area - (31.5300, 74.3620)
4. Waypoint 3 - Park Road - (31.5350, 74.3640)
5. School A - Government School - (31.5400, 74.3660)
6-9. Return path (reverse)

#### Route B002: North to Private Academy
- Distance: 6.2 km
- Estimated Time: 20 minutes
- Waypoints: 7 locations
- Stops: S003

Waypoints:
1. Starting Point (Depot) - (31.5500, 74.3500)
2. Waypoint 1 - North Avenue - (31.5550, 74.3480)
3. Waypoint 2 - University Road - (31.5600, 74.3450)
4. School B - Private Academy - (31.5650, 74.3420)
5-7. Return path (reverse)

---

### 2. GPSSimulator

**Purpose**: Simulate realistic GPS movement along routes

**Key Responsibilities**:
- Manage bus movement state
- Interpolate positions between waypoints
- Update locations based on speed
- Track total distance traveled

**How It Works**:

```
Initialize Bus Tracking
    ↓
Start Movement (Set speed, start timer)
    ↓
Every 2 seconds:
    - Calculate distance to next waypoint
    - Move fractional step (based on speed)
    - Interpolate new position
    - Check if waypoint reached
    - Update total distance
    ↓
Stop Movement (Clear timer)
```

**Speed Calculation**:
- Speed: 40 km/h (default)
- Update interval: 2 seconds
- Distance per update: 40 km/h ÷ 3600 sec × 2 sec = 0.0222 km

**Position Interpolation**:
```javascript
// Linear interpolation between waypoints
newLat = currentLat + (nextLat - currentLat) × progress
newLon = currentLon + (nextLon - currentLon) × progress

where progress = (distanceMoved / totalDistance)
```

**Usage**:
```javascript
const gpsSimulator = new GPSSimulator(routeManager);

// Initialize
gpsSimulator.initializeBusTracking('B001');

// Start movement at 40 km/h
gpsSimulator.startMovement('B001', 40);

// Get current location
const location = gpsSimulator.getBusLocation('B001');
console.log(location.location); // { latitude, longitude, name }

// Update speed
gpsSimulator.updateBusSpeed('B001', 50);

// Stop movement
gpsSimulator.stopMovement('B001');
```

---

### 3. TrackingService

**Purpose**: High-level API for tracking management

**Key Responsibilities**:
- Initialize tracking for buses
- Start/stop movement simulation
- Format data for driver dashboard
- Format data for parent tracking page
- Calculate ETA
- Manage tracking lifecycle

**Usage**:
```javascript
const trackingService = new TrackingService();

// Initialize tracking
trackingService.initializeTracking('B001');

// Start simulation
trackingService.startTracking('B001', 40); // 40 km/h

// Get location
const location = trackingService.getBusLocation('B001');

// Get driver dashboard data
const driverData = trackingService.getDriverDashboardTracking(
  'D001',
  busObject
);

// Get parent tracking data
const parentData = trackingService.getParentTrackingData('B001');

// Stop tracking
trackingService.stopTracking('B001');
```

---

## Data Structures

### BusTracking Object (Internal)
```javascript
{
  busId: 'B001',
  routeId: 'ROUTE_B001',
  currentWaypointIndex: 2,
  currentLocation: {
    latitude: 31.5280,
    longitude: 74.3610,
    name: 'Moving towards Waypoint 2 - Market Area'
  },
  lastUpdated: 2026-05-13T15:35:00Z,
  isMoving: true,
  speed: 40,           // km/h
  totalDistance: 0.45, // km
  routeProgress: 22    // %
}
```

### Location Response
```javascript
{
  success: true,
  busId: 'B001',
  location: {
    latitude: 31.5280,
    longitude: 74.3610,
    name: 'Moving towards Waypoint 2'
  },
  isMoving: true,
  speed: 40,
  totalDistance: 0.45,
  routeProgress: 22,
  lastUpdated: 2026-05-13T15:35:00Z
}
```

### Driver Dashboard Data
```javascript
{
  success: true,
  driver: { driverId: 'D001' },
  bus: {
    busId: 'B001',
    location: { latitude, longitude, name },
    isMoving: true,
    speed: 40,
    routeProgress: 22,
    totalDistance: 0.45,
    lastUpdated: 2026-05-13T15:35:00Z
  },
  route: {
    routeName: 'Downtown - Government School Route',
    currentWaypoint: 2,
    totalWaypoints: 9,
    estimatedDistance: 8.5,
    nextWaypoint: { latitude, longitude, name }
  }
}
```

### Parent Tracking Data
```javascript
{
  success: true,
  busId: 'B001',
  location: { latitude, longitude, name },
  isMoving: true,
  speed: 40,
  routeProgress: 22,
  lastUpdated: 2026-05-13T15:35:00Z,
  eta: {
    minutes: 18,
    estimatedArrival: 2026-05-13T15:53:00Z
  }
}
```

---

## API Methods

### TrackingService Methods

#### Initialize Tracking
```javascript
trackingService.initializeTracking(busId)
// Returns: { success: true/false, message: string, busId: string, startLocation: object }
```

#### Start Tracking
```javascript
trackingService.startTracking(busId, speed)
// Returns: { success: true/false, message: string, busId: string, speed: number }
```

#### Stop Tracking
```javascript
trackingService.stopTracking(busId)
// Returns: { success: true/false, message: string, busId: string }
```

#### Get Bus Location
```javascript
trackingService.getBusLocation(busId)
// Returns: { success: true/false, location: object, isMoving: boolean, ... }
```

#### Get Tracking Status
```javascript
trackingService.getTrackingStatus(busId)
// Returns: { busId, routeId, routeName, currentWaypoint, ... }
```

#### Get Driver Dashboard Data
```javascript
trackingService.getDriverDashboardTracking(driverId, bus)
// Returns: { success, driver, bus, route }
```

#### Get Parent Tracking Data
```javascript
trackingService.getParentTrackingData(busId)
// Returns: { success, busId, location, isMoving, speed, eta, ... }
```

#### Update Bus Speed
```javascript
trackingService.updateBusSpeed(busId, newSpeed)
// Returns: { success, message, busId, newSpeed }
```

#### Get All Routes
```javascript
trackingService.getAllRoutes()
// Returns: Array of route objects
```

#### Get Tracking Statistics
```javascript
trackingService.getTrackingStatistics(busId)
// Returns: { busId, routeName, statistics: { ... } }
```

---

## Integration Examples

### With Backend API (app.js)

```javascript
const { TrackingService } = require('./tracking');
const trackingService = new TrackingService();

// On server startup, initialize tracking for buses
app.listen(3000, () => {
  trackingService.initializeTracking('B001');
  trackingService.initializeTracking('B002');
});

// Get live location
app.get('/tracking/location/:busId', (req, res) => {
  const data = trackingService.getBusLocation(req.params.busId);
  res.json(data);
});

// Get driver dashboard
app.get('/tracking/driver/:driverId/:busId', (req, res) => {
  const driver = findDriverById(req.params.driverId);
  const bus = driver.getAssignedBus();
  const data = trackingService.getDriverDashboardTracking(
    req.params.driverId,
    bus
  );
  res.json(data);
});

// Get parent tracking
app.get('/tracking/parent/:busId', (req, res) => {
  const data = trackingService.getParentTrackingData(req.params.busId);
  res.json(data);
});

// Start bus movement
app.post('/tracking/start/:busId', (req, res) => {
  const { speed = 40 } = req.body;
  const data = trackingService.startTracking(req.params.busId, speed);
  res.json(data);
});

// Stop bus movement
app.post('/tracking/stop/:busId', (req, res) => {
  const data = trackingService.stopTracking(req.params.busId);
  res.json(data);
});
```

### With Frontend (JavaScript)

```javascript
// Auto-refresh driver location
setInterval(() => {
  fetch(`/tracking/driver/${driverId}/${busId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Update speed display
        document.getElementById('speed').textContent = data.bus.speed + ' km/h';
        
        // Update location
        document.getElementById('lat').textContent = data.bus.location.latitude;
        document.getElementById('lon').textContent = data.bus.location.longitude;
        
        // Update progress
        document.getElementById('progress').style.width = 
          data.bus.routeProgress + '%';
      }
    });
}, 2000); // Update every 2 seconds

// Start bus movement
document.getElementById('startBtn').addEventListener('click', () => {
  fetch(`/tracking/start/${busId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speed: 40 })
  })
  .then(res => res.json())
  .then(data => console.log(data.message));
});

// Stop bus movement
document.getElementById('stopBtn').addEventListener('click', () => {
  fetch(`/tracking/stop/${busId}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => console.log(data.message));
});
```

---

## Testing

### Run Test Suite
```bash
node tracking/test.js
```

### Manual Testing
```javascript
const { TrackingService } = require('./tracking');
const service = new TrackingService();

// Initialize
service.initializeTracking('B001');

// Start movement
service.startTracking('B001', 40);

// Check location after 4 seconds
setTimeout(() => {
  const location = service.getBusLocation('B001');
  console.log(location);
  
  service.stopTracking('B001');
}, 4000);
```

---

## Performance Considerations

### Memory Usage
- Per bus: ~500 bytes for tracking data
- 2 buses = ~1 KB
- Scalable to dozens of buses

### CPU Usage
- 1 interval per moving bus (2 second update)
- Minimal computation (interpolation only)
- Can handle 50+ buses simultaneously

### Network Usage
- ~100 bytes per location update
- Every 2 seconds = ~50 bytes/second per bus
- For 2 buses: ~100 bytes/second

---

## Future Enhancements

1. **WebSocket Integration**: Real-time updates instead of polling
2. **Speed Optimization**: Configurable update intervals
3. **Route Variations**: Handle alternate routes, detours
4. **Traffic Simulation**: Variable speeds based on time
5. **ETA Accuracy**: Machine learning-based predictions
6. **Waypoint POI**: Gas stations, restrooms, etc.
7. **Multi-Route Support**: Buses changing routes mid-journey
8. **Geofencing**: Alert when bus enters/exits zones

---

**Status**: ✅ Production Ready
