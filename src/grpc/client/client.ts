import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const AUTH_PROTO_PATH = path.join(__dirname, '../proto/auth.proto');
const USER_PROTO_PATH = path.join(__dirname, '../proto/user.proto');

const authPackageDefinition = protoLoader.loadSync(AUTH_PROTO_PATH);
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);

const authProto = grpc.loadPackageDefinition(authPackageDefinition).Authenticate as any;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).User as any;

// AuthService client
const authClient = new authProto.AuthService('local_app:50051', grpc.credentials.createInsecure());

// UserData service client
const userClient = new userProto.UserService('local_app:50051', grpc.credentials.createInsecure());

export const getAuthToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authClient.GetAuthToken({ token }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

export const getUserRating = (userId: number): Promise<{ rating: number }> => {
  return new Promise((resolve, reject) => {
    userClient.GetUserRating({ userId }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

export const updateUserRating = (userId: number, rating: number): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    userClient.UpdateUserRating({ userId, rating }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};