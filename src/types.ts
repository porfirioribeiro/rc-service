import { Service } from './service';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type ServiceListener<State> = (state: State) => void;

export interface ServiceType<
  State extends {},
  InitOptions extends any,
  Se extends Service<State, InitOptions> = Service<State, InitOptions>,
> {
  new (...args: any[]): Se;
  serviceName: string;
}

export interface ServiceCtx {
  readonly services: Record<string, Service<any> | undefined>;
  /**
   * Get or create and inject a Service in this context
   * @param serviceType Service class to inject
   * @param key Service key to use as modifier
   * @param initOptions Options passed to the Service when it is creating it
   */
  get<State, InitOptions, Svc extends Service<State, InitOptions>>(
    serviceType: ServiceType<State, InitOptions, Svc>,
    key?: string | null,
    initOptions?: InitOptions,
  ): Svc;
  dispose(serviceName: string): void;
}
