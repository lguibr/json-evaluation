// src/utils/SemanticDistance.js

import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} vecA - First vector.
 * @param {number[]} vecB - Second vector.
 * @returns {number} - Cosine similarity between vecA and vecB.
 */
const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length to compute cosine similarity.");
  }

  const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error("One of the vectors is zero, cannot compute cosine similarity.");
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Computes the normalized cosine distance between two strings using LangChain's OpenAI Embeddings.
 * @param {string} text1 - The first input string.
 * @param {string} text2 - The second input string.
 * @returns {Promise<number>} - The normalized cosine distance between the two embeddings, ranging from 0 (identical) to 1 (completely dissimilar).
 */
export const calculateSemanticSimilarity = async (text1, text2) => {
  // Input Validation
  if (typeof text1 !== "string" || typeof text2 !== "string") {
    throw new TypeError("Both inputs must be strings.");
  }

  // Retrieve the API key from local storage
  const OPENAI_API_KEY = localStorage.getItem('openai_api_key');

  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API Key not found. Please enter it in the Settings.");
  }

  // Initialize OpenAI Embeddings with the retrieved API key
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    model: "text-embedding-3-small",
  });

  try {
    // Generate embeddings for both texts in parallel
    const [embedding1, embedding2] = await Promise.all([
      embeddings.embedQuery(text1),
      embeddings.embedQuery(text2),
    ]);

    // Calculate cosine similarity
    const similarity = cosineSimilarity(embedding1, embedding2);

    // Clamp similarity to [0, 1] to ensure valid distance calculation
    const clampedSimilarity = Math.min(Math.max(similarity, 0), 1);

    // Calculate normalized cosine distance
    const normalizedDistance = clampedSimilarity;

    return normalizedDistance;
  } catch (error) {
    console.error("Error computing normalized cosine distance:", error);
    throw error;
  }
};

export const levenshteinDistance = (a, b) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

export const getLevenshteinSimilarity = (str1, str2) => {
  const distance = weightedLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = 1 - distance / maxLength;
  return similarity > 0.5 ? similarity : 0;
};

export const weightedLevenshteinDistance = (a, b, weights = { insert: 1, delete: 1, substitute: 1 }) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i * weights.delete];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j * weights.insert;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + weights.substitute, // substitution
          matrix[i][j - 1] + weights.insert,         // insertion
          matrix[i - 1][j] + weights.delete          // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};
