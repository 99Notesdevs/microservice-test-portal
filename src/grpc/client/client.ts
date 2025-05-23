import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

const client = new userProto.UserService('local_app:50051', grpc.credentials.createInsecure());

export const getUserDetails = (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetUserDetails({ userId }, (error: any, response: any) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};