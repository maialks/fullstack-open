import { gql } from '@apollo/client'

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const GET_BOOKS = gql`
  query ($author: String, $genres: [String]) {
    allBooks(author: $author, genres: $genres) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

export const GET_GENRES = gql`
  query {
    genres
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        bookCount
        born
      }
      published
      genres
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
export const GET_USER_DATA = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`
export const GET_BOOKS_AND_USER_FAVORITE = gql`
  query ($author: String, $genres: [String]) {
    allBooks(author: $author, genres: $genres) {
      title
      published
      genres
      author {
        name
      }
    }
    me {
      favoriteGenre
    }
  }
`
