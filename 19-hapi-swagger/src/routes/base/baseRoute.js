class BaseRoute {
  static methods() {
    return Object.getOwnPropertyNames(this.prototype).filter(
      (methods) => methods !== 'constructor' && !methods.startsWith('_')
    );
  }
}

module.exports = BaseRoute;
