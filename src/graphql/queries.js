/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDog = /* GraphQL */ `
  query GetDog($id: ID!) {
    getDog(id: $id) {
      id
      name
      breed
      age
      description
      price
      owner
      imageUrl
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
        age
        description
        price
        owner
        imageUrl
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
