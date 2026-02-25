"use strict";
// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// import path from 'path';
// const PROTO_PATH = path.resolve(__dirname, '../proto/service1.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH);
// const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
// const service1Package = grpcObject.service1;
// function service1Method(call: any, callback: any) {
//   callback(null, { message: 'Hello from Service1' });
// }
// const server = new grpc.Server();
// server.addService(service1Package.Service1.service, { Service1Method: service1Method });
// const port = 50051;
// server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
//   console.log(`Service1 gRPC server running on port ${port}`);
//   server.start();
// });
