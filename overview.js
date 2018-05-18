/**
 * Fun with ES6 Proxies
 *
 * Proxy object was a new feature that was introduced in ES6. They allow you to
 * intercept and customise operations performed on objects. E.g., function invocation,
 * assignment, property lookup, enumeration, etc. We use proxies for blocking direct
 * access to the target function or object.
 *
 * There are three principal terms that you need to know before we move ahead.
 *
 * Handler – Placeholder object which contains traps. More info here
 * Traps – The methods that provide property access.
 * Target – Object/Function which the proxy virtualises.
 *
 * Example Applications of Proxies:
 * - Security: Placing validity checks on the parameters of a function or the values
 *      of an object.
 * - Data persistence: We add a proxy backup function to each object that is fired
 *      when modifying its content.
 * - Statistics: We add statistical calculations to objects when they are concerned
 *      by the actions of users of an application.
 * - Contextual programming: We use different proxies for different processing
 *      contexts. For example a context of debugging a production context. For
 *      debugging, proxies present the values of variables and allow to edit the
 *      content of objects directly.
 * - Mediator pattern: Proxies are mediators between objects that interact through
 *      them. We do not need to define relationships between this or that object.
 * - Conditional access: When accessing an object through a proxy, it is possible to
 *      block access to all users or a group at any time, by direct command or
 *      automatically according to conditions.
 */

/**
 * The following are utility functions used strictly for demo purposes:
 */
function multiply(a, b) {
  return a * b;
}

function formatCurrency(format) {
  this.format = format;
}
// END UTILITY FUNCTIONS

/**
 * Test for Proxy compatibility
 */
let proxyTest = new Proxy({}, {});
proxyTest instanceof Object
  ?
  document.write('Proxy supported!') :
  document.write('Proxy not supported :(');

const handler = {
  /**
   * The get trap executes when you try to access a property of an object using the
   * proxy. Get method accepts target (the object we are trying to access) and the
   * property (the property that we try to access).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   get: function(target, property, receiver) { }
   * });
   * ```
   *
   * @param target: The target object.
   * @param property: The property name to get.
   * @param receiver: Either the proxy or an object that inherits from the proxy.
   *
   * Example:
   * In the following example, we will try to manipulate the value before we display
   * it in the console using get trap.
   */
  get: function (target, name) {
    return name in target ? target[name] * 10 : 'Key does not exist';
  },
  /**
   * The set trap is executed when you try to set a property of an object using the
   * proxy. The set method accepts target (the object we are trying to access),
   * property (the property that we try to access) and value (the value of the
   * property we are trying to set).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   set: function(target, property, value, receiver) { }
   * });
   * ```
   *
   * @param target: The target object.
   * @param property: The property name to set.
   * @param value: The new value of the property to set.
   * @param receiver: The object to which the assignment was originally directed.
   *   This is usually the proxy itself. But a set handler can also be called
   *   indirectly, via the prototype chain or various other ways.
   *
   * Example:
   * In the following example, we will add some properties with value to the object
   * before defining the proxyObj. You will notice that after we define the proxyObj
   * and try to set a new property, it will execute the trap and store the modified
   * value.
   */
  set: function (target, name, value) {
    target[name] = value * 10;
  },
  /**
   * The has trap is executed when an in operator is executed. The has method accepts
   * target (the object we are trying to access) and property (the property we are
   * trying to access).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   has: function(target, property) { }
   * });
   * ```
   * @param target: The target object.
   * @param property: The property name to check for existence.
   *
   * Example:
   * In the following example, we will check if the key includes the substring “ar”.
   * First of all, we will check if the key exists and if it is true, we will check
   * if it contains the substring. If both the conditions are matched we will return
   * the boolean value true or else we will return the boolean value false.
   */
  has: function (target, key) {
    if (key in target && key.includes('ar')) {
      return true;
    }
    return false;
  },
  /**
   * The apply trap allows you to call proxy with parameters. It overrides the default
   * function. The apply method accepts target (the object/function we want to access),
   * thisArg (the this argument for the call) and argumentsList (the list of all the
   * arguments in the form of an array).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   apply: function(target, thisArg, argumentsList) { }
   * });
   * ```
   * @param target: The target object.
   * @param thisArg: The this argument for the call.
   * @param argumentsList: The list of arguments for the call.
   *
   * Example:
   * In the following example, we will override the function to multiply two numbers
   * with a proxy that will add “1” to the multiplication.
   */
  apply: function (target, thisArg, argumentsList) {
    return target(argumentsList[0], argumentsList[1]) + 1;
  },
  /**
   * The construct trap is executed when new operator is called. In order for this
   * trap to be valid, the target on which the construct trap will be called should
   * itself have a construct method (i.e. new Target() should be valid).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   construct: function(target, argumentsList, newTarget) { }
   * });
   * ```
   *
   * @param target: The target object.
   * @param argumentsList: The list of arguments for the constructor.
   * @param newTarget: The constructor originally called.
   *
   * Example:
   * In the following example, we will pass the amount value through proxy and add a
   * currency symbol to it.
   */
  construct: function (target, args) {
    return new target('$' + args[0]);
  },
  /**
   * The deleteProperty trap is executed when delete method is triggered. It accepts
   * target (the object/function we want to access) and property (the property we are
   * trying to access).
   *
   * Syntax:
   * ```
   * var p = new Proxy(target, {
   *   deleteProperty: function(target, property) { }
   * });
   * ```
   * @param target: The target object
   * @param property: The property name to delete.
   *
   * Example:
   * The following example demonstrates how we can trigger a function and perform
   * manipulations when the property of an object is deleted.
   */
  deleteProperty: function (target, prop) {
    if (prop in target) {
      document.write(`${prop} has been removed <br>`);
      delete target[prop];
    }
  }
};

let obj = {
  a: 1,
  b: 2
};

let proxyObj = new Proxy(obj, handler);