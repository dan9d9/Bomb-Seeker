/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getScores = /* GraphQL */ `
  query GetScores($id: ID!) {
    getScores(id: $id) {
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
export const listScoress = /* GraphQL */ `
  query ListScoress(
    $filter: ModelScoresFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScoress(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        country
        difficulty
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
