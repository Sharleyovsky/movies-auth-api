export enum MoviesError {
    NOT_FOUND = "Couldn't find a movie with a provided id",
    INVALID_ID = "Movie ID is invalid!",
    EXCEEDED_LIMIT = "You have exceeded your monthly limit of API calls",
    USER_DUPLICATE = "This movie was already added by this user!",
    API_TITLE = "Title is either empty or incorrect!",
    API_NOT_FOUND = "Movie that you are looking for wasn't found in the OMDB",
    INVALID_API_KEY = "Server is using invalid API key!",
}
