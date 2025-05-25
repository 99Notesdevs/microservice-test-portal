import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).Authenticate as any;

const client = new userProto.AuthService('local_app:50051', grpc.credentials.createInsecure());

export const getAuthToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetAuthToken({ token }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};