/// <reference types="vite/client" />

// Declare CSS imports as valid
declare module '*.css' {
  const content: string;
  export default content;
}
