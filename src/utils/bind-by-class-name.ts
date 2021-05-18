import { interfaces } from "inversify";

const isClass = v => typeof v === 'function' && /^\s*class\s+/.test(`${v}`);
const className = cls => cls.toString().split(' ')[1];

/**
 * Try to bind every function in `classes` under original class name
 *
 * @param bind bind function
 * @param classes list of classes to filter and bind to
 */
export function bindByClassName(bind: interfaces.Bind, ...classes: any[]): void {
  for (const service of classes)
    if (isClass(service))
      bind(className(service)).to(service);
}
