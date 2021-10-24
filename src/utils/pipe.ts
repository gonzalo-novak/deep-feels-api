/**
 * Compose a descriptible chain of functions within a pipe
 */
const pipeSync = (...fns: Function[]) => (...args: any) => fns.forEach(fn => fn(...args));

export {
	pipeSync
}