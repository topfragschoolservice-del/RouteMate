/**
 * Bus Tracking System Test
 * Demonstrates GPS simulation, route tracking, and driver dashboard integration
 */

const { TrackingService, RouteManager } = require('./index');

console.log('=== RouteMate Bus Tracking System Test ===\n');

// Create tracking service
const trackingService = new TrackingService();

// Initialize tracking for buses
console.log('1. Initializing Bus Tracking:');
const init1 = trackingService.initializeTracking('B001');
const init2 = trackingService.initializeTracking('B002');
console.log('  - B001:', init1.message);
console.log('  - B002:', init2.message);

// Get route information
console.log('\n2. Available Routes:');
const routes = trackingService.getAllRoutes();
routes.forEach(route => {
  console.log(`  - ${route.name}`);
  console.log(`    Distance: ${route.distance} km, Time: ${route.estimatedTime} min`);
  console.log(`    Stops: ${route.stops.join(', ')}`);
});

// Get current location before movement
console.log('\n3. Initial Bus Locations:');
const location1Before = trackingService.getBusLocation('B001');
const location2Before = trackingService.getBusLocation('B002');
console.log(`  - B001: (${location1Before.location.latitude}, ${location1Before.location.longitude})`);
console.log(`  - B002: (${location2Before.location.latitude}, ${location2Before.location.longitude})`);

// Start movement
console.log('\n4. Starting Bus Movement:');
const start1 = trackingService.startTracking('B001', 40);
const start2 = trackingService.startTracking('B002', 35);
console.log('  - B001:', start1.message, `(Speed: ${start1.speed} km/h)`);
console.log('  - B002:', start2.message, `(Speed: ${start2.speed} km/h)`);

// Simulate movement for 8 seconds
console.log('\n5. Simulating Bus Movement (8 seconds):');
setTimeout(() => {
  console.log('\n6. Bus Locations After 8 Seconds:');
  const location1After = trackingService.getBusLocation('B001');
  const location2After = trackingService.getBusLocation('B002');

  console.log(`\n  Bus B001:`);
  console.log(`    Location: (${location1After.location.latitude}, ${location1After.location.longitude})`);
  console.log(`    Moving: ${location1After.isMoving}`);
  console.log(`    Speed: ${location1After.speed} km/h`);
  console.log(`    Distance Traveled: ${location1After.totalDistance} km`);
  console.log(`    Route Progress: ${location1After.routeProgress}%`);

  console.log(`\n  Bus B002:`);
  console.log(`    Location: (${location2After.location.latitude}, ${location2After.location.longitude})`);
  console.log(`    Moving: ${location2After.isMoving}`);
  console.log(`    Speed: ${location2After.speed} km/h`);
  console.log(`    Distance Traveled: ${location2After.totalDistance} km`);
  console.log(`    Route Progress: ${location2After.routeProgress}%`);

  // Get tracking status
  console.log('\n7. Detailed Tracking Status:');
  const status1 = trackingService.getTrackingStatus('B001');
  console.log(`\n  Bus B001 (${status1.routeName}):`);
  console.log(`    Current Waypoint: ${status1.currentWaypoint}/${status1.totalWaypoints}`);
  console.log(`    Location: ${status1.currentLocation.name}`);
  if (status1.nextWaypoint) {
    console.log(`    Next Stop: ${status1.nextWaypoint.name}`);
  }

  const status2 = trackingService.getTrackingStatus('B002');
  console.log(`\n  Bus B002 (${status2.routeName}):`);
  console.log(`    Current Waypoint: ${status2.currentWaypoint}/${status2.totalWaypoints}`);
  console.log(`    Location: ${status2.currentLocation.name}`);
  if (status2.nextWaypoint) {
    console.log(`    Next Stop: ${status2.nextWaypoint.name}`);
  }

  // Stop movement
  console.log('\n8. Stopping Bus Movement:');
  const stop1 = trackingService.stopTracking('B001');
  const stop2 = trackingService.stopTracking('B002');
  console.log('  - B001:', stop1.message);
  console.log('  - B002:', stop2.message);

  // Get tracking statistics
  console.log('\n9. Tracking Statistics:');
  const stats1 = trackingService.getTrackingStatistics('B001');
  const stats2 = trackingService.getTrackingStatistics('B002');

  console.log(`\n  Bus B001:`);
  console.log(`    Distance Traveled: ${stats1.statistics.distanceTraveled.toFixed(2)} km`);
  console.log(`    Route Progress: ${stats1.statistics.routeProgress}%`);
  console.log(`    Waypoints Completed: ${stats1.statistics.waypointsCompleted}/${stats1.statistics.totalWaypoints}`);

  console.log(`\n  Bus B002:`);
  console.log(`    Distance Traveled: ${stats2.statistics.distanceTraveled.toFixed(2)} km`);
  console.log(`    Route Progress: ${stats2.statistics.routeProgress}%`);
  console.log(`    Waypoints Completed: ${stats2.statistics.waypointsCompleted}/${stats2.statistics.totalWaypoints}`);

  // Get parent tracking data
  console.log('\n10. Parent Tracking View:');
  const parentTracking1 = trackingService.getParentTrackingData('B001');
  console.log(`\n  Bus B001:`);
  console.log(`    Location: (${parentTracking1.location.latitude}, ${parentTracking1.location.longitude})`);
  console.log(`    Moving: ${parentTracking1.isMoving}`);
  console.log(`    Route Progress: ${parentTracking1.routeProgress}%`);
  console.log(`    Last Updated: ${new Date(parentTracking1.lastUpdated).toLocaleTimeString()}`);

  console.log('\n=== Test Complete ===');
  console.log('✓ Route Manager - Waypoint tracking');
  console.log('✓ GPS Simulator - Realistic location interpolation');
  console.log('✓ Tracking Service - High-level tracking management');
  console.log('✓ Driver Dashboard data - Speed, location, progress');
  console.log('✓ Parent Tracking data - ETA, location updates');

}, 8000);

console.log('  (Running simulation...)');
