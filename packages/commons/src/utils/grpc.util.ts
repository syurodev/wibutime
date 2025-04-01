import { catchError, lastValueFrom, Observable, retry, throwError } from 'rxjs';

export class GrpcUtil {
  public static async reTry<T>(source: Observable<T>) {
    return await lastValueFrom<T>(
      source.pipe(
        retry({ count: 3, delay: 1000 }),
        catchError((err) => {
          if (err.code === 14) {
            // Customize the error message for a specific gRPC error code
            return throwError(() => new Error('Service Unavailable'));
          }
          return throwError(() => err); // Rethrow other errors
        }),
      ),
    );
  }
}
