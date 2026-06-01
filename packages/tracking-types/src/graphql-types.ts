export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDate: { input: string; output: string; }
  AWSDateTime: { input: string; output: string; }
  AWSEmail: { input: string; output: string; }
  AWSIPAddress: { input: string; output: string; }
  AWSJSON: { input: string; output: string; }
  AWSPhone: { input: string; output: string; }
  AWSTime: { input: string; output: string; }
  AWSTimestamp: { input: number; output: number; }
  AWSURL: { input: string; output: string; }
};

export type Location = {
  __typename?: 'Location';
  postCode?: Maybe<Scalars['String']['output']>;
  town?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getTracking?: Maybe<TrackingData>;
};


export type QueryGetTrackingArgs = {
  token: Scalars['String']['input'];
};

export type TrackingData = {
  __typename?: 'TrackingData';
  cancelTime?: Maybe<Scalars['AWSDateTime']['output']>;
  dropOffLocation?: Maybe<Location>;
  dropOffTime?: Maybe<Scalars['AWSDateTime']['output']>;
  id: Scalars['ID']['output'];
  pickUpLocation?: Maybe<Location>;
  pickUpTime?: Maybe<Scalars['AWSDateTime']['output']>;
  rejectTime?: Maybe<Scalars['AWSDateTime']['output']>;
  tenantName?: Maybe<Scalars['String']['output']>;
  tenantWebsite?: Maybe<Scalars['AWSURL']['output']>;
};
