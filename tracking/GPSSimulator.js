/**
 * GPSSimulator
 * Simulates realistic GPS movement along predefined routes
 * Handles bus movement, speed control, and location updates
 */

class GPSSimulator {
  #busLocationMap;
  #routeManager;
  #simulationIntervals;

  constructor(routeManager) {
    this.#routeManager = routeManager;
    this.#busLocationMap = new Map();
    this.#simulationIntervals = new Map();
  }

  /**
   * Initialize GPS tracking for a bus
   */
  initializeBusTracking(busId) {
    const route = this.#routeManager.getRouteByBusId(busId);
    if (!route) {
      return {
        success: false,
        message: 'No route found for bus'
      };
    }

    this.#busLocationMap.set(busId, {
      busId: busId,
      routeId: route.routeId,
      currentWaypointIndex: 0,
      currentLocation: route.waypoints[0],
      lastUpdated: new Date(),
      isMoving: false,
      speed: 40, // km/h
      totalDistance: 0,
      routeProgress: 0
    });

    return {
      success: true,
      message: 'Bus tracking initialized',
      busId: busId,
      startLocation: route.waypoints[0]
    };
  }

  /**
   * Start simulated movement for a bus
   */
  startMovement(busId, speedKmh = 40) {
    const busTracking = this.#busLocationMap.get(busId);
    if (!busTracking) {
      return {
        success: false,
        message: 'Bus tracking not initialized'
      };
    }

    if (busTracking.isMoving) {
      return {
        success: false,
        message: 'Bus is already moving'
      };
    }

    busTracking.isMoving = true;
    busTracking.speed = speedKmh;

    // Simulate movement every 2 seconds
    const interval = setInterval(() => {
      this.#simulateMovement(busId);
    }, 2000);

    this.#simulationIntervals.set(busId, interval);

    return {
      success: true,
      message: 'Bus movement started',
      busId: busId,
      speed: speedKmh
    };
  }

  /**
   * Stop simulated movement for a bus
   */
  stopMovement(busId) {
    const busTracking = this.#busLocationMap.get(busId);
    if (!busTracking) {
      return {
        success: false,
        message: 'Bus tracking not found'
      };
    }

    busTracking.isMoving = false;

    const interval = this.#simulationIntervals.get(busId);
    if (interval) {
      clearInterval(interval);
      this.#simulationIntervals.delete(busId);
    }

    return {
      success: true,
      message: 'Bus movement stopped',
      busId: busId
    };
  }

  /**
   * Simulate bus movement to next waypoint
   */
  #simulateMovement(busId) {
    const busTracking = this.#busLocationMap.get(busId);
    const route = this.#routeManager.getRoute(busTracking.routeId);

    if (!busTracking || !route) return;

    const currentWaypoint = route.waypoints[busTracking.currentWaypointIndex];
    const nextWaypoint = this.#routeManager.getNextWaypoint(
      busTracking.routeId,
      busTracking.currentWaypointIndex
    );

    if (!nextWaypoint) {
      // Route completed, loop back to start
      busTracking.currentWaypointIndex = 0;
      busTracking.currentLocation = route.waypoints[0];
      return;
    }

    // Calculate interpolation step (move towards next waypoint)
    const distance = this.#routeManager.calculateDistance(
      currentWaypoint.latitude,
      currentWaypoint.longitude,
      nextWaypoint.latitude,
      nextWaypoint.longitude
    );

    // Speed: 40 km/h = 0.666 km per 2 seconds
    const moveDistance = (busTracking.speed / 3600) * 2; // distance per 2 seconds
    const progress = moveDistance / distance;

    if (progress >= 1) {
      // Reached waypoint, move to next
      busTracking.currentWaypointIndex += 1;
      busTracking.currentLocation = nextWaypoint;
      busTracking.totalDistance += distance;
    } else {
      // Interpolate position between waypoints
      const newLat = currentWaypoint.latitude +
        (nextWaypoint.latitude - currentWaypoint.latitude) * progress;
      const newLon = currentWaypoint.longitude +
        (nextWaypoint.longitude - currentWaypoint.longitude) * progress;

      busTracking.currentLocation = {
        latitude: parseFloat(newLat.toFixed(6)),
        longitude: parseFloat(newLon.toFixed(6)),
        name: `Moving towards ${nextWaypoint.name}`
      };
      busTracking.totalDistance += moveDistance;
    }

    busTracking.lastUpdated = new Date();
    busTracking.routeProgress = this.#routeManager.getRouteProgress(
      busTracking.routeId,
      busTracking.currentWaypointIndex
    );
  }

  /**
   * Get current location of a bus
   */
  getBusLocation(busId) {
    const busTracking = this.#busLocationMap.get(busId);
    if (!busTracking) {
      return {
        success: false,
        message: 'Bus tracking not found'
      };
    }

    return {
      success: true,
      busId: busId,
      location: {
        latitude: busTracking.currentLocation.latitude,
        longitude: busTracking.currentLocation.longitude,
        name: busTracking.currentLocation.name
      },
      isMoving: busTracking.isMoving,
      speed: busTracking.speed,
      totalDistance: parseFloat(busTracking.totalDistance.toFixed(2)),
      routeProgress: busTracking.routeProgress,
      lastUpdated: busTracking.lastUpdated
    };
  }

  /**
   * Get bus tracking status
   */
  getBusTrackingStatus(busId) {
    const busTracking = this.#busLocationMap.get(busId);
    if (!busTracking) {
      return null;
    }

    const route = this.#routeManager.getRoute(busTracking.routeId);
    return {
      busId: busId,
      routeId: busTracking.routeId,
      routeName: route.name,
      currentWaypoint: busTracking.currentWaypointIndex,
      totalWaypoints: route.waypoints.length,
      currentLocation: busTracking.currentLocation,
      isMoving: busTracking.isMoving,
      speed: busTracking.speed,
      totalDistance: parseFloat(busTracking.totalDistance.toFixed(2)),
      estimatedDistance: route.distance,
      routeProgress: busTracking.routeProgress,
      nextWaypoint: this.#routeManager.getNextWaypoint(
        busTracking.routeId,
        busTracking.currentWaypointIndex
      )
    };
  }

  /**
   * Get all bus locations
   */
  getAllBusLocations() {
    const locations = [];
    for (let [busId, tracking] of this.#busLocationMap) {
      locations.push(this.getBusLocation(busId).location);
    }
    return locations;
  }

  /**
   * Update bus speed
   */
  updateBusSpeed(busId, newSpeed) {
    const busTracking = this.#busLocationMap.get(busId);
    if (!busTracking) {
      return {
        success: false,
        message: 'Bus tracking not found'
      };
    }

    if (newSpeed <= 0 || newSpeed > 100) {
      return {
        success: false,
        message: 'Speed must be between 1 and 100 km/h'
      };
    }

    busTracking.speed = newSpeed;
    return {
      success: true,
      message: 'Bus speed updated',
      busId: busId,
      newSpeed: newSpeed
    };
  }
}

module.exports = GPSSimulator;
