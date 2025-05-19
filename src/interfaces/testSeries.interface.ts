export interface ITestSeries {
  id?: number;
  name: string;
  correctAttempted: number;
  wrongAttempted: number;
  notAttempted: number;
  partialAttempted?: number;
  partialNotAttempted?: number;
  partialWrongAttempted?: number;
  timeTaken: number;
  questionsSingle: number;
  questionsMultiple?: number;
  createdAt?: Date;
  updatedAt?: Date;
  questionIds: number[];
}

export interface IUserTestSeries {
  id?: number;
  userId?: number;
  testId: number;
  response: string;
  result: string;
  createdAt?: Date;
  updatedAt?: Date;
}