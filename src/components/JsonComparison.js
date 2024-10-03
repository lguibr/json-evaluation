import React, { useState } from 'react';
import ResultTable from './ResultTable';

function JsonComparison({
  weightConfig,
  abbreviations,
  flattenedData,
  setFlattenedData,
  onBack,
}) {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');

  const isNullLike = (value) => {
    if (value === null) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      return trimmed === '' || trimmed === 'null' || trimmed === 'none';
    }
    return false;
  };

  const toDecimal = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Try to parse as a number
      const num = parseFloat(value);
      if (!isNaN(num)) return num;

      // Try to parse as a date
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date.getTime();
    }
    return null; // If conversion is not possible
  };



  const calculateSimilarity = (val1, val2) => {
    if (isNullLike(val1) && isNullLike(val2)) {
      return 1;
    }
    if (isNullLike(val1) || isNullLike(val2)) {
      return 0;
    }

    const num1 = toDecimal(val1);
    const num2 = toDecimal(val2);

    if (num1 !== null && num2 !== null) {
      const diff = Math.abs(num1 - num2);
      const max = Math.max(Math.abs(num1), Math.abs(num2));
      return max === 0 ? 1 : 1 - diff / max;
    }

    const str1 = String(val1);
    const str2 = String(val2);

    for (const [key, values] of Object.entries(abbreviations)) {
      if (
        (values.includes(str1) && values.includes(str2)) ||
        (key === str1 && values.includes(str2)) ||
        (key === str2 && values.includes(str1))
      ) {
        return 1;
      }
    }

    const distance = levenshteinDistance(
      str1.toLowerCase(),
      str2.toLowerCase()
    );
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  };

  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(obj[key])) {
        return [
          ...acc,
          ...obj[key].flatMap((item, index) =>
            typeof item === 'object' && item !== null
              ? flattenObject(item, `${newKey}[${index}]`)
              : { key: `${newKey}[${index}]`, value: item }
          ),
        ];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        return [...acc, ...flattenObject(obj[key], newKey)];
      }
      return [...acc, { key: newKey, value: obj[key] }];
    }, []);
  };

  const getApplicableWeight = (key) => {
    const parts = key.split('.');
    while (parts.length > 0) {
      const currentKey = parts.join('.');
      if (weightConfig.hasOwnProperty(currentKey)) {
        return weightConfig[currentKey];
      }
      parts.pop();
    }
    return 1; // Default weight if no match found
  };

  const compareJsons = () => {
    try {
      const parsedJson1 = JSON.parse(json1);
      const parsedJson2 = JSON.parse(json2);

      const flattened1 = flattenObject(parsedJson1);
      const flattened2 = flattenObject(parsedJson2);

      const combinedKeys = Array.from(
        new Set([...flattened1.map((item) => item.key), ...flattened2.map((item) => item.key)])
      );

      const data = combinedKeys.map((key) => {
        const item1 = flattened1.find((item) => item.key === key);
        const item2 = flattened2.find((item) => item.key === key);
        const value1 = item1 ? item1.value : null;
        const value2 = item2 ? item2.value : null;
        const similarity = calculateSimilarity(value1, value2);
        return { key, value1, value2, similarity };
      });

      setFlattenedData(data);
    } catch (err) {
      alert('Error parsing JSON. Please check your input.');
    }
  };

  return (
    <div id="jsonComparison">
      <h2>JSON Comparison</h2>
      <textarea
        value={json1}
        onChange={(e) => setJson1(e.target.value)}
        placeholder="Enter first JSON here"
      ></textarea>
      <textarea
        value={json2}
        onChange={(e) => setJson2(e.target.value)}
        placeholder="Enter second JSON here"
      ></textarea>
      <button onClick={compareJsons}>Compare JSONs</button>
      <button onClick={onBack}>Back to Weight Config</button>
      {flattenedData.length > 0 && (
        <ResultTable
          data={flattenedData}
          weightConfig={weightConfig}
          getApplicableWeight={getApplicableWeight}
        />
      )}
    </div>
  );
}

export default JsonComparison;
