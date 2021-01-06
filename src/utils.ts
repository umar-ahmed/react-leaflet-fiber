export const is = {
  obj: (a: any) => a === Object(a) && !is.arr(a),
  fun: (a: any) => typeof a === "function",
  str: (a: any) => typeof a === "string",
  num: (a: any) => typeof a === "number",
  und: (a: any) => a === void 0,
  arr: (a: any) => Array.isArray(a),
  equ(a: any, b: any) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false;
    // Atomic, just compare a against b
    if (is.str(a) || is.num(a) || is.obj(a)) return a === b;
    // Array, shallow compare first to see if it's a match
    if (is.arr(a) && a == b) return true;
    // Last resort, go through keys
    let i;
    for (i in a) if (!(i in b)) return false;
    for (i in b) if (a[i] !== b[i]) return false;
    return is.und(i) ? a === b : true;
  },
};

const validateFormat =
  process.env.NODE_ENV !== "production"
    ? function (format: string) {
        if (format === undefined) {
          throw new Error("invariant(...): Second argument must be a string.");
        }
      }
    : function (format: string) {};

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments to provide
 * information about what broke and what you were expecting.
 *
 * The invariant message will be stripped in production, but the invariant will
 * remain to ensure logic does not differ in production.
 */
export function invariant(condition: any, format: string, ...args: Array<any>) {
  validateFormat(format);

  if (!condition) {
    let error;

    if (format === undefined) {
      error = new Error(
        "Minified exception occurred; use the non-minified dev environment " +
          "for the full error message and additional helpful warnings."
      );
    } else {
      let argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function () {
          return String(args[argIndex++]);
        })
      );
      error.name = "Invariant Violation";
    }

    throw error;
  }
}

// Event handlers begin with `on`
export const isEventHandlerProp = (prop: string) =>
  prop.startsWith("on") && prop !== "onEachFeature";

export const extractEventHandlers = (props: object) =>
  Object.fromEntries(
    Object.entries(props)
      .filter(([key, value]) => isEventHandlerProp(key))
      .map(([key, value]) => [key.slice(2).toLowerCase(), value])
  );
