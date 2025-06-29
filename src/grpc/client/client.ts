import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import Consul from 'consul';

const consul = new Consul({
  host: process.env.CONSUL_HOST || 'local_consul',
  port: 8500
});

// Helper to resolve gRPC service from Consul
async function resolveGrpcService(serviceName: string): Promise<string> {
  if (process.env.USE_CONSUL !== 'true') {
    return 'localhost:50051'; // fallback for local dev
  }
  const services = await consul.catalog.service.nodes(serviceName);
  if (!services.length) throw new Error(`No instances found for ${serviceName}`);
  const { Address, ServicePort } = services[0];
  return `${Address}:${ServicePort}`;
}


const AUTH_PROTO_PATH = path.join(__dirname, '../proto/auth.proto');
const USER_PROTO_PATH = path.join(__dirname, '../proto/user.proto');

const authPackageDefinition = protoLoader.loadSync(AUTH_PROTO_PATH);
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);

const authProto = grpc.loadPackageDefinition(authPackageDefinition).Authenticate as any;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).User as any;

let authClient: any;
let userClient: any;

async function initClients() {
  const serviceAddress = await resolveGrpcService('main-backend'); // service name in Consul

  authClient = new authProto.AuthService(serviceAddress, grpc.credentials.createInsecure());
  userClient = new userProto.UserService(serviceAddress, grpc.credentials.createInsecure());
}

let initialized = false;
async function ensureInit() {
  if (!initialized) {
    await initClients();
    initialized = true;
  }
}

export const getAuthToken = async (token: string): Promise<any> => {
  await ensureInit();
  return new Promise((resolve, reject) => {
    authClient.GetAuthToken({ token }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

export const getUserRating = async (userId: number): Promise<{ rating: number }> => {
  await ensureInit();
  return new Promise((resolve, reject) => {
    userClient.GetUserRating({ userId }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

export const updateUserRating = async (userId: number, rating: number): Promise<{ success: boolean }> => {
  await ensureInit();
  return new Promise((resolve, reject) => {
    userClient.UpdateUserRating({ userId, rating }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};