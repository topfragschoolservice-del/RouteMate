/**
 * TrackingService
 * High-level service for bus tracking management
 * Manages GPS simulation, location updates, and real-time tracking data
 */

const RouteManager = require('./RouteManager');
const GPSSimulator = require('./GPSSimulator');

class TrackingService {
  #routeManager;
  #gpsSimulator;
  #busRouteAssignments;

  constructor() {
    this.#routeManager = new RouteManager();
    this.#gpsSimulator = new GPSSimulator(this.#routeManager);
    this.#busRouteAssignments = new Map();
  }

  /**
   * Initialize tracking for a bus
   */
  initializeTracking(busId) {
    const result = this.#gpsSimulator.initializeBusTracking(busId);
    if (result.success) {
      this.#busRouteAssignments.set(busId, true);
    }
    return result;
  }

  /**
   * Start bus movement simulation
   */
  startTracking(busId, speed = 40) {
    if (!this.#busRouteAssignments.has(busId)) {
      return {
        success: false,
        message: 'Bus tracking not initialized. Call initializeTracking first.'
      };
    }

    return this.#gpsSimulator.startMovement(busId, speed);
  }

  /**
   * Stop bus movement simulation
   */
  stopTracking(busId) {
    return this.#gpsSimulator.stopMovement(busId);
  }

  /**
   * Get current location of a bus
   */
  getBusLocation(busId) {
    return this.#gpsSimulator.getBusLocation(busId);
  }

  /**
   * Get detailed tracking status for a bus
   */
  getTrackingStatus(busId) {
    return this.#gpsSimulator.getBusTrackingStatus(busId);
  }

  /**
   * Get tracking data for driver dashboard
   */
  getDriverDashboardTracking(driverId, bus) {
    if (!bus) {
      return {
        success: false,
        message: 'Driver has no assigned bus'
      };
    }

    const busId = bus.getBusId();
    const locationData = this.#gpsSimulator.getBusLocation(busId);
    const trackingStatus = this.#gpsSimulator.getBusTrackingStatus(busId);

    if (!locationData.success) {
      return {
        success: false,
        message: 'Tracking data not available',
        busId: busId
      };
    }

    return {
      success: true,
      driver: {
        driverId: driverId
      },
      bus: {
        busId: busId,
        location: locationData.location,
        isMoving: locationData.isMoving,
        speed: locationData.speed,
        routeProgress: locationData.routeProgress,
        totalDistance: locationData.totalDistance,
        lastUpdated: locationData.lastUpdated
      },
      route: trackingStatus ? {
        routeName: trackingStatus.routeName,
        currentWaypoint: trackingStatus.currentWaypoint,
        totalWaypoints: trackingStatus.totalWaypoints,
        estimatedDistance: trackingStatus.estimatedDistance,
        nextWaypoint: trackingStatus.nextWaypoint
      } : null
    };
  }

  /**
   * Get tracking data for parent tracking page
   */
  getParentTrackingData(busId) {
    const locationData = this.#gpsSimulator.getBusLocation(busId);
    const trackingStatus = this.#gpsSimulator.getBusTrackingStatus(busId);

    if (!locationData.success) {
      return {
        success: false,
        message: 'Tracking data not available'
      };
    }

    return {
      success: true,
      busId: busId,
      location: locationData.location,
      isMoving: locationData.isMoving,
      speed: locationData.speed,
      routeProgress: locationData.routeProgress,
      lastUpdated: locationData.lastUpdated,
      eta: this.#estimateETA(trackingStatus)
    };
  }

  /**
   * Get all buses locations (for tracking page)
   */
  getAllBusesLocations() {
    const buses = [];
    for (let busId of this.#busRouteAssignments.keys()) {
      const locationData = this.#gpsSimulator.getBusLocation(busId);
      if (locationData.success) {
        buses.push({
          busId: busId,
          ...locationData
        });
      }
    }
    return buses;
  }

  /**
   * Update driver location (when driver manually updates)
   */
  updateDriverLocation(driverId, bus, latitude, longitude) {
    if (!bus) {
      return {
        success: false,
        message: 'Driver has no assigned bus'
      };
    }

    bus.updateLocation(latitude, longitude);
    return {
      success: true,
      message: 'Location updated by driver',
      driverId: driverId,
      busId: bus.getBusId(),
      location: {
        latitude: latitude,
        longitude: longitude
      },
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get route for a bus
   */
  getRoute(busId) {
    return this.#routeManager.getRouteByBusId(busId);
  }

  /**
   * Get all available routes
   */
  getAllRoutes() {
    return this.#routeManager.getAllRoutes();
  }

  /**
   * Update bus speed
   */
  updateBusSpeed(busId, speed) {
    return this.#gpsSimulator.updateBusSpeed(busId, speed);
  }

  /**
   * Get tracking statistics
   */
  getTrackingStatistics(busId) {
    const tracking = this.#gpsSimulator.getBusTrackingStatus(busId);
    if (!tracking) {
      return null;
    }

    return {
      busId: busId,
      routeName: tracking.routeName,
      statistics: {
        waypointsCompleted: tracking.currentWaypoint,
        totalWaypoints: tracking.totalWaypoints,
        distanceTraveled: tracking.totalDistance,
        estimatedTotalDistance: tracking.estimatedDistance,
        routeProgress: tracking.routeProgress,
        isMoving: tracking.isMoving,
        currentSpeed: tracking.speed
      }
    };
  }

  /**
   * Estimate ETA based on current progress
   */
  #estimateETA(trackingStatus) {
    if (!trackingStatus || trackingStatus.routeProgress >= 100) {
      return null;
    }

    const remainingProgress = 100 - trackingStatus.routeProgress;
    const estimatedTime = trackingStatus.estimatedDistance * (remainingProgress / 100) / trackingStatus.speed * 60;

    return {
      minutes: Math.round(estimatedTime),
      estimatedArrival: new Date(Date.now() + estimatedTime * 60000).toISOString()
    };
  }
}

module.exports = TrackingService;
