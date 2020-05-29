/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createScores = /* GraphQL */ `
  mutation CreateScores(
    $input: CreateScoresInput!
    $condition: ModelScoresConditionInput
  ) {
    createScores(input: $input, condition: $condition) {
      id
      name
      country
      difficulty
      score
      createdAt
      updatedAt
    }
  }
`;
export const updateScores = /* GraphQL */ `
  mutation UpdateScores(
    $input: UpdateScoresInput!
    $condition: ModelScoresConditionInput
  ) {
    updateScores(input: $input, condition: $condition) {
      id
      name
      country
      difficulty
      score
      createdAt
      updatedAt
    }
  }
`;
export const deleteScores = /* GraphQL */ `
  mutation DeleteScores(
    $input: DeleteScoresInput!
    $condition: ModelScoresConditionInput
  ) {
    deleteScores(input: $input, condition: $condition) {
      id
      name
      country
      difficulty
      score
      createdAt
      updatedAt
    }
  }
`;
