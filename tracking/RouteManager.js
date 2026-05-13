/**
 * RouteManager
 * Manages predefined bus routes with waypoints
 * Handles route planning and waypoint management for simulated GPS movement
 */

class RouteManager {
  #routes;

  constructor() {
    this.#routes = new Map();
    this.#initializePredefinedRoutes();
  }

  /**
   * Initialize predefined bus routes with waypoints
   */
  #initializePredefinedRoutes() {
    // Route 1: Downtown to School A
    this.#routes.set('ROUTE_B001', {
      routeId: 'ROUTE_B001',
      busId: 'B001',
      name: 'Downtown - Government School Route',
      waypoints: [
        { latitude: 31.5204, longitude: 74.3587, name: 'Starting Point (Depot)' },
        { latitude: 31.5250, longitude: 74.3600, name: 'Waypoint 1 - Main Street' },
        { latitude: 31.5300, longitude: 74.3620, name: 'Waypoint 2 - Market Area' },
        { latitude: 31.5350, longitude: 74.3640, name: 'Waypoint 3 - Park Road' },
        { latitude: 31.5400, longitude: 74.3660, name: 'School A - Government School' },
        { latitude: 31.5350, longitude: 74.3640, name: 'Waypoint 3 - Park Road' },
        { latitude: 31.5300, longitude: 74.3620, name: 'Waypoint 2 - Market Area' },
        { latitude: 31.5250, longitude: 74.3600, name: 'Waypoint 1 - Main Street' },
        { latitude: 31.5204, longitude: 74.3587, name: 'Return to Depot' }
      ],
      distance: 8.5,
      estimatedTime: 25,
      stops: ['S001', 'S002']
    });

    // Route 2: North to School B
    this.#routes.set('ROUTE_B002', {
      routeId: 'ROUTE_B002',
      busId: 'B002',
      name: 'North - Private Academy Route',
      waypoints: [
        { latitude: 31.5500, longitude: 74.3500, name: 'Starting Point (Depot)' },
        { latitude: 31.5550, longitude: 74.3480, name: 'Waypoint 1 - North Avenue' },
        { latitude: 31.5600, longitude: 74.3450, name: 'Waypoint 2 - University Road' },
        { latitude: 31.5650, longitude: 74.3420, name: 'School B - Private Academy' },
        { latitude: 31.5600, longitude: 74.3450, name: 'Waypoint 2 - University Road' },
        { latitude: 31.5550, longitude: 74.3480, name: 'Waypoint 1 - North Avenue' },
        { latitude: 31.5500, longitude: 74.3500, name: 'Return to Depot' }
      ],
      distance: 6.2,
      estimatedTime: 20,
      stops: ['S003']
    });
  }

  /**
   * Get route by ID
   */
  getRoute(routeId) {
    return this.#routes.get(routeId);
  }

  /**
   * Get route by bus ID
   */
  getRouteByBusId(busId) {
    for (let route of this.#routes.values()) {
      if (route.busId === busId) {
        return route;
      }
    }
    return null;
  }

  /**
   * Get all routes
   */
  getAllRoutes() {
    return Array.from(this.#routes.values());
  }

  /**
   * Get waypoints for a route
   */
  getWaypoints(routeId) {
    const route = this.#routes.get(routeId);
    return route ? route.waypoints : [];
  }

  /**
   * Get next waypoint in sequence
   */
  getNextWaypoint(routeId, currentWaypointIndex) {
    const route = this.#routes.get(routeId);
    if (!route) return null;

    const nextIndex = currentWaypointIndex + 1;
    return nextIndex < route.waypoints.length ? route.waypoints[nextIndex] : null;
  }

  /**
   * Calculate distance between two coordinates (simple approximation)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get route progress percentage
   */
  getRouteProgress(routeId, currentWaypointIndex) {
    const route = this.#routes.get(routeId);
    if (!route) return 0;
    return Math.round((currentWaypointIndex / (route.waypoints.length - 1)) * 100);
  }
}

module.exports = RouteManager;
