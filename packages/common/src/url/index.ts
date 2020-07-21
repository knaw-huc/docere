// Generic functions for programatically creating URL paths 
export * from './get-path'

// Navigate hook which takes a payload and changes the page to a new URL path
export * from './navigate'

// Query hook to convert the URL path's search query to an internal UrlQuery object
// To get the projectId and documentId from URL path we can use default hooks from react-router-dom
export * from './query'
