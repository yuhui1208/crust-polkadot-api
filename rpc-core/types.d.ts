import { Observable } from 'rxjs';
export * from './types.jsonrpc';
export interface RpcInterfaceMethod {
    (...params: any[]): Observable<any>;
    raw(...params: any[]): Observable<any>;
}
