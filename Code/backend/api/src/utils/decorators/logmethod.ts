/**
 * Method decorator that logs the invocation and result of the decorated method.
 *
 * Logs the class and method name, input arguments, and the returned value.
 * If the method throws an error, it logs the error as well.
 *
 * @param target - The prototype of the class.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The property descriptor for the method.
 * @returns The modified property descriptor with logging functionality.
 */
export function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor | void {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const className = target.constructor?.name ?? "UnknownClass";
    console.log(`[${className}.${propertyKey}] Called with:`, args);

    try {
      const out = await original.apply(this, args);
      console.log(`[${className}.${propertyKey}] Returned:`, out);
      return out;
    } catch (e) {
      console.error(`[${className}.${propertyKey}] ERROR`, e);
      throw e;
    }
  };

  return descriptor;
}
