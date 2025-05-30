export interface ITest {
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
}

export interface IUserTest {
  id?: number;
  userId?: number;
  questionIds: number[];
  response: string;
  result: string;
  createdAt?: Date;
  updatedAt?: Date;
}