/**
 * @fileOverview Shuttle Bus Helper Functions
 * @name shuttle-bus.js
 * @author Mo Kweon
 * @license MIT
 */

Date.prototype.addHours = function(h) {
    let hours_in_ms = h * 60 * 60 * 1000;
    this.setTime(this.getTime() + hours_in_ms);
    return this;
};

/**
 * Returns the current date with the time set to 00:00:00
 * @returns {Date} Date object.
 */
const get_date = () => {
    let today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};


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
].map(([hour, minutes], idx) => {
    let now = get_date();
    now.setUTCHours(hour + 7);
    now.setUTCMinutes(minutes);
    return now;
});

// Afternoon schedule
const afternoon_schedule = [
    [3, 43],
    [4, 03],
    [4, 39],
    [5, 07],
    [5, 29],
    [5, 47],
    [6, 06],
    [6, 27],
    [6, 45],
    [7, 05]
].map(([hour, minutes], idx) => {
    let now = get_date();
    now.setUTCHours(hour + 7 + 12);
    now.setUTCMinutes(minutes);
    return now;
});

const schedule = morning_schedule.concat(afternoon_schedule);

const get_current_time = () => {
    return new Date();
};

/**
 * Returns a shuttle bus list.
 * @param {Date} currentTime - Current Date object
 * @returns {Date[]} Return a list of shuttle bus that has not arrived yet.
 */
const get_possible_schedule = (currentTime) => {

    let possible = schedule.filter(function(x) {
        let timediff = x - currentTime;
        return timediff >= 0;
    });

    return possible;
};

/**
 * Returns the time difference in seconds between two Date objects.
 * @param {Date} current_time - Current Time.
 * @param {Date} shuttle_time - Shuttle Bus Arrival Time.
 * @returns {number} Time difference in minutes.
 */
const get_time_diff = (current_time, shuttle_time) => {
    let time_diff = shuttle_time - current_time;

    // Time difference in minutes
    return Math.floor(time_diff / 1000 / 60);
};

const get_message = (diff) => {
    let message = "";
    if (diff > 60) {
        hour_diff = Math.floor(diff / 60);
        min_diff = diff % 60;
        message = `Your next shuttle bus arrives in ${hour_diff} hour ${min_diff} minutes`;
    } else {
        message = `Your next shuttle bus arrives in ${diff} minutes`;
    }
    return message;
};

const timeFormat = (date) => {
    date.addHours(-7);
    let hour = date.getUTCHours();
    let minutes = date.getMinutes();
    let am_or_pm = hour >= 12 ? "PM" : "AM";
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return `${hour % 12}:${minutes} ${am_or_pm}`;
};

const get_next_shuttlebus = () => {
    let current_time = get_current_time();
    let possible_schedules = get_possible_schedule(current_time);


    if (possible_schedules.length > 0) {
        let time_diff = get_time_diff(current_time, possible_schedules[0]);
        return {
            message: get_message(time_diff),
            shuttle_bus: possible_schedules.map(timeFormat)
        };
    } else {
        return {
            message: "No shuttle bus is available as of " + timeFormat(current_time),
            shuttle_bus: null
        };
    }
};

module.exports = get_next_shuttlebus;
