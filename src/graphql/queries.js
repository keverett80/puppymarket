/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDog = /* GraphQL */ `
  query GetDog($id: ID!) {
    getDog(id: $id) {
      id
      name
      breed
      birthDate
      description
      price
      owner
      imageUrls
      dateListed
      gender
      location
      state
      verified
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDogs = /* GraphQL */ `
  query ListDogs(
    $filter: ModelDogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        breed
        birthDate
        description
        price
        owner
        imageUrls
        dateListed
        gender
        location
        state
        verified
        type
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const dogByDate = /* GraphQL */ `
  query DogByDate(
    $type: String!
    $dateListed: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dogByDate(
      type: $type
      dateListed: $dateListed
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        breed
        birthDate
        description
        price
        owner
        imageUrls
        dateListed
        gender
        location
        state
        verified
        type
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
