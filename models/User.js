class User {
  #id;
  #name;
  #email;
  #isLoggedIn;

  constructor(id, name, email) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#isLoggedIn = false;
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getEmail() {
    return this.#email;
  }

  setName(name) {
    this.#name = name;
  }

  setEmail(email) {
    this.#email = email;
  }

  isLoggedIn() {
    return this.#isLoggedIn;
  }

  login() {
    this.#isLoggedIn = true;
    return `${this.#name} logged in successfully.`;
  }

  logout() {
    this.#isLoggedIn = false;
    return `${this.#name} logged out successfully.`;
  }

  toString() {
    return `${this.constructor.name} - ID: ${this.#id}, Name: ${this.#name}, Email: ${this.#email}`;
  }
}

module.exports = User;
