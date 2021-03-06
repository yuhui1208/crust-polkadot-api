import { Constructor, InterfaceTypes, Registry } from '../../types';
/**
 * @description takes an input map of the form `{ [string]: string | Constructor }` and returns a map of `{ [string]: Constructor }`
 */
export default function mapToTypeMap(registry: Registry, input: Record<string, keyof InterfaceTypes | Constructor>): Record<string, Constructor>;
