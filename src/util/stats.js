import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

/**
 * Creates an array of timestamp intervals.
 *
 * @param {Array<object>} timestamps - An array of timestamp objects that belong to a task.
 * @returns {Array<object>} - An array of objects with activated and ended properties. if interval has no end time, ended is null.
 * @example createIntervalArray(getTimestamps(task, timestamps)) // task is a task object with id, timestamps contains all timestamps
 */
export const createIntervalArray = (timestamps) => {
  let intervalArray = [];
  for (let i = 0; i < timestamps.length; i += 2) {
    const interval = timestamps.slice(i, i + 2).map((stamp) => stamp.timestamp);
    intervalArray.push({ activated: interval[0], ended: interval[1] || null });
  }
  return intervalArray;
};

export const getTotalActiveTime = (intervalArray, rangeStart, rangeEnd) => {
  if (intervalArray.length === 0) {
    return 0;
  }
  const filteredIntervals = filterIntervals(
    intervalArray,
    rangeStart,
    rangeEnd
  );
  const totalActiveTime = filteredIntervals.reduce((acc, interval) => {
    let activatedTime = dayjs(interval.activated);
    activatedTime.isBefore(rangeStart) && (activatedTime = dayjs(rangeStart));
    let endedTime = interval.ended ? dayjs(interval.ended) : dayjs();
    endedTime.isAfter(rangeEnd) && (endedTime = dayjs(rangeEnd));
    acc += endedTime.diff(activatedTime, "second");
    return acc;
  }, 0);
  return totalActiveTime;
};

/**
 * Filters the intervals that are at least partially inside the selected range.
 *
 * @param {Array<object>} intervalArray - An array of objects with activated and ended properties
 * @param {string} rangeStart - A timestamp string in ISO format
 * @param {string} rangeEnd - A timestamp string in ISO format
 */
export const filterIntervals = (intervalArray, rangeStart, rangeEnd) => {
  return intervalArray.filter(({ activated, ended }) => {
    const activatedTime = dayjs(activated);
    const endedTime = ended ? dayjs(ended) : null;
    const selectedStart = dayjs(rangeStart);
    const selectedEnd = dayjs(rangeEnd);

    // Check 1: Activated time is fully inside the selected ranges
    const activatedInsideRange = activatedTime.isBetween(
      selectedStart,
      selectedEnd,
      "millisecond",
      "[]"
    );

    // Check 2: Activated time is before the selected range and ended time is inside or after the selected range
    const activatedBeforeAndEndedInsideOrAfterRange =
      activatedTime.isBefore(selectedStart) &&
      endedTime &&
      endedTime.isAfter(selectedStart);

    // Check 3: Activated time is before the selected range and ended time does not exist but current time is inside or after the selected range
    const activatedBeforeAndEndedDoesNotExist =
      activatedTime.isBefore(selectedStart) &&
      !endedTime &&
      dayjs().isAfter(selectedStart);

    // filter out the intervals where none of these cases are true
    return (
      activatedInsideRange ||
      activatedBeforeAndEndedInsideOrAfterRange ||
      activatedBeforeAndEndedDoesNotExist
    );
  });
};

/**
 * Formats a timestamp to Finnish format.
 *
 * @param {string} time - A timestamp string in ISO format
 * @returns {string} - A formatted timestamp string or an empty string if time does not exist
 */
export const formatToFinnishFormat = (time) => {
  const finnishFormat = "DD.MM.YYYY HH:mm:ss";
  return time ? dayjs(time).format(finnishFormat) : "";
};

/**
 * @param {number} totalTime - A total time in seconds
 * @returns {string} - A formatted string of the total time including hours, minutes and seconds
 */
export const formatTotalTime = (totalTime) => {
  if (totalTime === 60 * 60 * 24 - 1) { // dayjs() returns 23:59:59.999 so remove one second to get 24 hours
    return "24 tuntia";
  }
  const hours = Math.floor(totalTime / 3600); 
  const minutes = Math.floor((totalTime % 3600) / 60);
  const seconds = totalTime % 60;
  return `${hours} tuntia, ${minutes} minuuttia ja ${seconds.toFixed(0)} sekuntia`;
};
