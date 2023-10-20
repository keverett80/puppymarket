/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDog = /* GraphQL */ `
  mutation CreateDog(
    $input: CreateDogInput!
    $condition: ModelDogConditionInput
  ) {
    createDog(input: $input, condition: $condition) {
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
export const updateDog = /* GraphQL */ `
  mutation UpdateDog(
    $input: UpdateDogInput!
    $condition: ModelDogConditionInput
  ) {
    updateDog(input: $input, condition: $condition) {
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
export const deleteDog = /* GraphQL */ `
  mutation DeleteDog(
    $input: DeleteDogInput!
    $condition: ModelDogConditionInput
  ) {
    deleteDog(input: $input, condition: $condition) {
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
