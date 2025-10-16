export interface LambdaEvent {
  graphQLEndpoint: string;
  userId: string;
  userPoolId: string;
  retryCount: number;
}

export interface LambdaReturn {
  graphQLEndpoint: string;
  userId: string;
  userPoolId: string;
  retryCount: number;
}
