import * as chrono from 'chrono-node';

/**
 * Parses the input text using multiple language parsers.
 * Returns the parse results in the order of Spanish, English, then Portuguese.
 *
 * @param {string} text - The text to parse.
 * @returns {chrono.ParseResult[]|null} - An array of parse results or null if parsing fails.
 */
export const parseDateTime = (text) => {
  // Corrected language assignments
  const spanishResults = chrono.es.strict.parse(text);
  const englishResults = chrono.en.strict.parse(text);
  const portugueseResults = chrono.pt.strict.parse(text);

  // Return the first successful parse results based on language priority
  if (spanishResults.length > 0) {
    return spanishResults;
  } else if (englishResults.length > 0) {
    return englishResults;
  } else if (portugueseResults.length > 0) {
    return portugueseResults;
  } else {
    return null;
  }
};

/**
 * Compares two date-time texts and determines their similarity based on known and implied values.
 *
 * @param {string} text1 - The first date-time string.
 * @param {string} text2 - The second date-time string.
 * @returns {Object|null} - An object containing similarity score and reason, or null if no match.
 */
export const compareDateTime = (text1, text2) => {
  const date1Results = parseDateTime(text1);
  const date2Results = parseDateTime(text2);
  const hasDateTime1 = date1Results?.length > 0;
  const hasDateTime2 = date2Results?.length > 0;
  if (!hasDateTime1 || !hasDateTime2) {
    return null;
  }

  const [date1] = date1Results;
  const [date2] = date2Results;

  const knownValues1 = date1?.start?.knownValues || {};
  const knownValues2 = date2?.start?.knownValues || {};

  const impliedValues1 = date1?.start?.impliedValues || {};
  const impliedValues2 = date2?.start?.impliedValues || {};

  /**
   * Helper function to compare two objects for exact key-value equality.
   *
   * @param {Object} objA - First object.
   * @param {Object} objB - Second object.
   * @returns {boolean} - True if objects are equal, false otherwise.
   */
  const areObjectsEqual = (objA, objB) => {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => objB.hasOwnProperty(key) && objA[key] === objB[key]);
  };

  // Check if knownValues are equal in both directions
  const knownValuesEqual = areObjectsEqual(knownValues1, knownValues2);

  if (knownValuesEqual) {
    // If knownValues match, check impliedValues
    if (areObjectsEqual(impliedValues1, impliedValues2)) {
      return { similarity: 1, reason: 'DateTime Known and implied values match' };
    } else {
      return { similarity: 1, reason: 'DateTime known values match' };
    }
  } else {
    const hasDate1 = ['year', 'month', 'day'].some(key => knownValues1.hasOwnProperty(key));
    const hasDate2 = ['year', 'month', 'day'].some(key => knownValues2.hasOwnProperty(key));
    const hasTime1 = ['hour', 'minute'].some(key => knownValues1.hasOwnProperty(key));
    const hasTime2 = ['hour', 'minute'].some(key => knownValues2.hasOwnProperty(key));

    // Case 1: Both have complete dates
    const isDate1Complete = ['month', 'day'].every(key => knownValues1.hasOwnProperty(key));
    const isDate2Complete = ['month', 'day'].every(key => knownValues2.hasOwnProperty(key));

    if (isDate1Complete && isDate2Complete) {
      // Compare the date components
      const datePartsEqual =
        knownValues1.month === knownValues2.month &&
        knownValues1.day === knownValues2.day;

      if (datePartsEqual) {
        // If dates are equal, further check time if available
        const isTime1Complete = ['hour', 'minute'].every(key => knownValues1.hasOwnProperty(key));
        const isTime2Complete = ['hour', 'minute'].every(key => knownValues2.hasOwnProperty(key));

        if (isTime1Complete && isTime2Complete) {
          const timePartsEqual =
            knownValues1.hour === knownValues2.hour &&
            knownValues1.minute === knownValues2.minute;

          if (timePartsEqual) {
            return { similarity: 1, reason: 'Both date and time match' };
          } else {
            return { similarity: 0, reason: 'Different Time' };
          }
        } else {
          return { similarity: 1, reason: 'Date matches' };
        }
      } else {
        return { similarity: 0, reason: 'Different Date' };
      }
    }

    // Case 2: Both have time components but no date components
    const hasOnlyTime1 = hasTime1 && !hasDate1;
    const hasOnlyTime2 = hasTime2 && !hasDate2;

    if (hasOnlyTime1 && hasOnlyTime2) {
      // Compare the time components
      const timePartsEqual =
        knownValues1.hour === knownValues2.hour &&
        knownValues1.minute === knownValues2.minute;

      if (timePartsEqual) {
        return { similarity: 1, reason: 'Time Matches' };
      } else {
        return { similarity: 0, reason: 'Different Time' };
      }
    }

    // Case 3: One has date and the other has time
    if ((hasDate1 && hasTime2) || (hasDate2 && hasTime1)) {
      return { similarity: 0, reason: 'One has Date and the other has Time' };
    }

    // Additional cases can be handled here as needed

    return null;
  }
};
