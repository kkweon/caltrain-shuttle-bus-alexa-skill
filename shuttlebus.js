/**
 * @fileOverview Shuttle Bus Helper Functions
 * @name shuttle-bus.js
 * @author Mo Kweon
 * @license MIT
 */

"use strict";

/**
 * Get a Pacific Time regardless of the server location.
 * @param {Date} date - Date object
 * @returns {number[]} Returns [Hour, Minute]
 */
function getPacificTime(date) {
  // PDT + 7 = UTC => PDT = UTC - 7;
  // PST + 8 = UTF => PDT = UTC - 8;
  date.setTime(date.getTime() - 8 * 60 * 60 * 1000);

  return [date.getUTCHours(), date.getUTCMinutes()];
}

// Morning Shuttle Bus Schedule
// [[hour, minutes]] in PST
const morning_schedule = [
  [6, 10],
  [6, 26],
  [6, 38],
  [6, 52],
  [7, 20],
  [7, 37],
  [7, 52],
  [8, 17],
  [8, 35],
  [8, 52],
  [9, 12]
];

// Afternoon schedule
const afternoon_schedule = [
  [3, 43],
  [4, 3],
  [4, 39],
  [5, 7],
  [5, 29],
  [5, 47],
  [6, 6],
  [6, 27],
  [6, 45],
  [7, 5]
].map(([hour, minutes]) => [hour + 12, minutes]);

const schedule = morning_schedule.concat(afternoon_schedule);

/**
 * Compares Two Dates.
 * @param {number[]} [h_x, m_x] - [Hour, Minute]
 * @param {number[]} [h_y, m_y] - [Hour, Minute]
 * @returns {Bool} IF time_x < time_y, then TRUE
 */
function compareDate([h_x, m_x], [h_y, m_y]) {
  if (h_x < h_y) {
    return true;
  } else if (h_x == h_y && m_x <= m_y) {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns available shuttle bus list.
 * @param {number[][]} schedule - [[h_1, m_1], [h_2, m_2], ...]
 * @param {number[]} current_time - [hour, min]
 * @returns {number[][]} Available schedules [[h_x, m_x], ...].
 */
function getAvailableList(schedule, current_time) {
  return schedule.filter(time => compareDate(current_time, time));
}

/**
 * Gets Time Difference in Minutes.
 * @param {number[]} [h_x, m_x] - First Hour Minute
 * @param {number[]} [h_y, m_y] - Second Hour Minute
 * @returns {number} Time difference in Minutes
 */
function getTimeDiff([h_x, m_x], [h_y, m_y]) {
  let time1 = h_x * 60 + m_x;
  let time2 = h_y * 60 + m_y;
  return time1 - time2;
}

/**
 * Get Message given Diff.
 * @param {number} diff - Time Difference in Minutes.
 * @returns {string} Return description.
 */
function getMessage(diff) {
  let message = "";
  if (diff > 60) {
    let hour_diff = Math.floor(diff / 60);
    let min_diff = diff % 60;
    message = `Your next shuttle bus arrives in ${hour_diff} hour ${min_diff} minutes`;
  } else {
    message = `Your next shuttle bus arrives in ${diff} minutes`;
  }
  return message;
}

function timeFormat([hour, minutes]) {
  let am_or_pm = hour >= 12 ? "PM" : "AM";
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return `${hour % 12}:${minutes} ${am_or_pm}`;
}

function getNextSchedule(current_time, schedule) {
  let available_list = getAvailableList(schedule, current_time);
  if (available_list.length > 0) {
    let time_diff = getTimeDiff(available_list[0], current_time);
    return {
      message: getMessage(time_diff),
      shuttle_bus: available_list.map(timeFormat)
    };
  } else {
    return {
      message: "No shuttle bus is available as of " + timeFormat(current_time),
      shuttle_bus: null
    };
  }
}

module.exports = {
  schedule: schedule,
  compareDate: compareDate,
  getPacificTime: getPacificTime,
  getAvailableList: getAvailableList,
  getTimeDiff: getTimeDiff,
  getNextSchedule: getNextSchedule
};
