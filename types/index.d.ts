export type RuntimeProfile = "node-24" | "web-worker";
export type RuntimeCapability =
  | "outbound-fetch"
  | "abort-signal"
  | "web-crypto"
  | "binary-response";

export type FetchHandler = (request: Request) => Promise<Response>;

export interface ScopedLogger {
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
}

export interface Clock {
  now(): number;
}

export interface HttpTransport {
  fetch(request: Request): Promise<Response>;
}

export interface ModuleDependencies {
  logger: ScopedLogger;
  clock: Clock;
  transport?: HttpTransport;
}

export type CreateHandler = (
  config: Readonly<Record<string, unknown>>,
  dependencies: ModuleDependencies
) => FetchHandler;
