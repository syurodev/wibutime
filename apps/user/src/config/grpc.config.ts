import { GrpcOptions } from '@nestjs/microservices';

export const retryOptions = {
  max_retries: 3, // Set the maximum number of retries
  initial_backoff_ms: 1000, // Initial backoff time in milliseconds
  max_backoff_ms: 5000, // Maximum backoff time in milliseconds
  backoff_multiplier: 1.5, // Backoff multiplier
  retryable_status_codes: [14], // Status codes to retry
};

export const loader: GrpcOptions['options']['loader'] = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

export const keepalive: GrpcOptions['options']['keepalive'] = {
  keepaliveTimeMs: 5000,
  keepaliveTimeoutMs: 20000,
  keepalivePermitWithoutCalls: 1,
  ...(retryOptions && { retry: retryOptions }),
};

export const channelOptions: GrpcOptions['options']['channelOptions'] = {
  'grpc.max_receive_message_length': 10 * 1024 * 1024, // 10mb
  'grpc.max_send_message_length': 10 * 1024 * 1024, // 10mb
  'grpc.default_deadline_ms': 2000,
  'grpc.initial_reconnect_backoff_ms': 2000,
  grpcOptions: {
    'grpc.http2.max_frame_size': 1024 * 1024 * 10, // Set the maximum frame size if needed
  },
  methodConfig: [
    {
      name: [],
      timeout: { seconds: 10, nanos: 0 },
      retryPolicy: {
        maxAttempts: 5,
        initialBackoff: '0.1s',
        maxBackoff: '30s',
        backoffMultiplier: 3,
        retryableStatusCodes: ['UNAVAILABLE'],
      },
    },
  ],
};
