const assert = require("assert");
const shuttlebus = require("../shuttlebus");


describe("Time Schedule", function() {
    it("should 21 schedules every day", function() {
        assert.equal(shuttlebus.schedule.length, 21);
    });

    it("first element is [6, 10]", function() {
        assert.deepEqual(shuttlebus.schedule[0], [6, 10]);
    });

    it ("last element is [19, 5]", function() {
        assert.deepEqual(shuttlebus.schedule[shuttlebus.schedule.length - 1], [19, 5]);
    });

    it("Before 6am, possible schedule should return 21 schedules", function() {
        let before_6am = new Date();
        before_6am.setHours(6);
        before_6am.setMinutes(0);
        let pacific_time = shuttlebus.getPacificTime(before_6am);

        let schedules = shuttlebus.getAvailableList(shuttlebus.schedule, pacific_time);
        assert.equal(schedules.length, 21);
    });

    it("After 10 AM, there are only 10 schedules in the afternoon", function() {
        let after_10am = new Date();
        // PDT + 7 = UTC
        after_10am.setUTCHours(10 + 7);
        after_10am.setUTCMinutes(0);
        let pacific_time = shuttlebus.getPacificTime(after_10am);
        let schedules = shuttlebus.getAvailableList(shuttlebus.schedule, pacific_time);
        assert.equal(schedules.length, 10);
    });
});

describe("CompareDate", function() {
    it("A is earlier than B expects true", function() {
        let time1 = [6, 35];
        let time2 = [7, 35];
        assert.equal(shuttlebus.compareDate(time1, time2), true);
    });

    it("A is later than B expects false", function() {
        let time1 = [7, 40];
        let time2 = [7, 35];
        assert.equal(shuttlebus.compareDate(time1, time2), false);
    });

    it("Two equal time returns true", function() {
        let time1 = [7, 40];
        let time2 = [7, 40];
        assert.equal(shuttlebus.compareDate(time1, time2), true);
    });
});


describe("getTimeDiff", function() {
    describe("two equal time are given", function() {
        it("should return 0", function() {
            let time1 = [10, 10];
            let time2 = [10, 10];
            assert.equal(shuttlebus.getTimeDiff(time1, time2), 0);
        });
    });

    describe("A - 10:10 AM & B - 11:10AM", function() {
        it("should return -60", function() {
            let time1 = [10, 10];
            let time2 = [11, 10];
            assert.equal(shuttlebus.getTimeDiff(time1, time2), -60);
        });
    });
});


describe("getNextSchedule/2", function() {
    describe("after 7:05pm there is no shuttle bus", function() {
        it("should return the No shuttle bus message", function() {
            let date = new Date();
            date.setUTCHours(20 + 7);
            date.setUTCMinutes(0);
            date = shuttlebus.getPacificTime(date);
            let message = shuttlebus.getNextSchedule(date, shuttlebus.schedule);
            assert.equal(message.message, "No shuttle bus is available as of 8:00 PM");
            assert.equal(message.shuttle_bus, null);
        });
    });
    describe("before 6:05am the first bus is at 6:10am", function() {
        it("should return the correct shuttle bus message", function() {
            let date = new Date();
            date.setUTCHours(6 + 7);
            date.setUTCMinutes(5);
            date = shuttlebus.getPacificTime(date);
            let message = shuttlebus.getNextSchedule(date, shuttlebus.schedule);
            assert.equal(message.message, "Your next shuttle bus arrives in 5 minutes");
            assert.notEqual(message.shuttle_bus, null);
        });
    });
});
