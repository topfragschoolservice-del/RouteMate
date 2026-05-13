class Location {
  #latitude;
  #longitude;

  constructor(latitude, longitude) {
    this.#latitude = latitude;
    this.#longitude = longitude;
  }

  getLatitude() {
    return this.#latitude;
  }

  getLongitude() {
    return this.#longitude;
  }

  setLatitude(latitude) {
    this.#latitude = latitude;
  }

  setLongitude(longitude) {
    this.#longitude = longitude;
  }

  updateLocation(latitude, longitude) {
    this.#latitude = latitude;
    this.#longitude = longitude;
  }

  toString() {
    return `(${this.#latitude}, ${this.#longitude})`;
  }
}

module.exports = Location;
