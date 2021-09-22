/**
 * Compose a descriptible chain of functions within a pipe
 */
const pipeSync = (...fns: Function[]) => (argument: any) => fns.forEach(fn => fn(argument));

export {
	pipeSync
}