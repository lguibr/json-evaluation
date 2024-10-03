import React, { useEffect, useState } from 'react';
import CollapsibleComparison from './CollapsibleComparison';
import { calculateSemanticSimilarity, getLevenshteinSimilarity } from '../utils/SemanticDistance';
import { parseDateTime, compareDateTime } from '../utils/timedate';

function MatchedFileComparison({ matchedFiles, setMatchedFiles, weightConfig, abbreviations }) {
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false); // Add a processed state

  useEffect(() => {
    // Only proceed if not already processed
    if (!processed) {
      const compareAllFiles = async () => {
        setLoading(true); // Start loading
        const updatedFiles = await Promise.all(
          matchedFiles.map(async (filePair) => {
            if (!filePair.flattenedData || filePair.flattenedData.length === 0) {
              const newFilePair = await compareFiles(filePair);
              return newFilePair;
            }
            return filePair;
          })
        );
        setMatchedFiles(updatedFiles);
        setLoading(false); // End loading
        setProcessed(true); // Mark as processed
      };

      compareAllFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  const compareFiles = async (filePair) => {
    return new Promise((resolve, reject) => {
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.onload = (e1) => {
        const content1 = e1.target.result;
        reader2.onload = async (e2) => {
          const content2 = e2.target.result;
          try {
            const json1 = JSON.parse(content1);
            const json2 = JSON.parse(content2);

            const flattened1 = flattenObject(json1);
            const flattened2 = flattenObject(json2);

            const combinedKeys = Array.from(
              new Set([
                ...flattened1.map((item) => item.key),
                ...flattened2.map((item) => item.key),
              ])
            );

            const dataPromises = combinedKeys.map(async (key) => {
              const item1 = flattened1.find((item) => item.key === key);
              const item2 = flattened2.find((item) => item.key === key);
              const value1 = normalizeValue(item1 ? item1.value : null);
              const value2 = normalizeValue(item2 ? item2.value : null);
              const { similarity, reason } = await calculateSimilarity(
                value1,
                value2,
                abbreviations
              );
              return { key, value1, value2, similarity, reason };
            });

            const data = await Promise.all(dataPromises);

            resolve({ ...filePair, flattenedData: data });
          } catch (error) {
            alert(
              `Error parsing JSON in files ${filePair.file1.name} or ${filePair.file2.name}`
            );
            reject(error);
          }
        };
        reader2.readAsText(filePair.file2);
      };
      reader1.readAsText(filePair.file1);
    });
  };

  // Helper functions
  const normalizeValue = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === '' || trimmed === 'null' || trimmed === 'none') {
        return null;
      }
    }
    return value;
  };

  const isNullLike = (value) => {
    return value === null;
  };

  const toDecimal = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!isNaN(num)) return num;
    }
    return null;
  };

  const calculateSimilarity = async (val1, val2, abbreviations) => {
    if (isNullLike(val1) && isNullLike(val2)) {
      return { similarity: 1, reason: 'Both values are null-like' };
    }
    if (isNullLike(val1) || isNullLike(val2)) {
      return { similarity: 0, reason: 'One value is null-like' };
    }



    const str1 = String(val1);
    const str2 = String(val2);

    for (const [key, values] of Object.entries(abbreviations)) {
      if (
        (values.includes(str1) && values.includes(str2)) ||
        (key === str1 && values.includes(str2)) ||
        (key === str2 && values.includes(str1))
      ) {
        return { similarity: 1, reason: 'Match found in abbreviations' };
      }
    }
    if (str1 === str2) {
      return { similarity: 1, reason: 'String match' };
    }

    const dateTimeResult = compareDateTime(str1, str2);
    if (dateTimeResult !== null) return dateTimeResult;

    const num1 = toDecimal(str1);
    const num2 = toDecimal(str2);

    if (num1 !== null && num2 !== null && !isNaN(num1) && !isNaN(num2)) {
      return { similarity: num1 === num2 ? 1 : 0, reason: 'Numeric match' };
    }

    try {
      const semanticDistance = await calculateSemanticSimilarity(
        str1.toLowerCase(),
        str2.toLowerCase()
      );
      const levenshteinDist = getLevenshteinSimilarity(str1, str2);
      console.log({str1, str2, semanticDistance, levenshteinDist});
      
      
      
      return { similarity: levenshteinDist > semanticDistance ? levenshteinDist : semanticDistance, reason: `${levenshteinDist > semanticDistance ? 'Levenshtein' : "Semantic"} distance` };

    } catch (error) {
      console.error('Error computing semantic distance:', error);
      return { similarity: 0, reason: 'Error computing semantic distance' };
    }
  };

  const flattenObject = (obj, prefix = '') => {
    let result = [];
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item !== 'object' || item === null) {
              // Primitive in array, include key
              result.push({ key: `${newKey}[${index}]`, value: normalizeValue(item) });
            } else {
              // Nested object in array, recurse
              result = result.concat(flattenObject(item, `${newKey}[${index}]`));
            }
          });
        } else {
          // Recurse into nested objects
          result = result.concat(flattenObject(value, newKey));
        }
      } else {
        // Include primitive fields
        result.push({ key: newKey, value: normalizeValue(value) });
      }
    });
    return result;
  };

  return (
    <div id="comparisons">
      <h2>JSON Comparisons</h2>
      {loading ? (
        <p>Loading comparisons...</p>
      ) : (
        matchedFiles.map((filePair, index) => (
          <CollapsibleComparison
            key={index}
            filePair={filePair}
            weightConfig={weightConfig}
            abbreviations={abbreviations}
            onUpdateFlattenedData={(newData) => {
              const updatedMatchedFiles = [...matchedFiles];
              updatedMatchedFiles[index] = { ...filePair, flattenedData: newData };
              setMatchedFiles(updatedMatchedFiles);
            }}
          />
        ))
      )}
    </div>
  );
}

export default MatchedFileComparison;
