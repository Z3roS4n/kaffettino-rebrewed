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
