/**
 * @fileOverview AWS Lambda Alexa Skill
 * @name index.js
 * @author Mo Kweon
 * @license MIT
 */

"use strict";

const Alexa = require("alexa-sdk");
const shuttlebus = require("./shuttlebus");

const APP_ID = "amzn1.ask.skill.22c8922c-21d3-4a41-891f-bddf14e34e89";

const messageBuilder = (message, time) => {
  return message + ` at ${time}`;
};

const messages = {
  HELP_MESSAGE: "You can say when is the next shuttle bus?",
};

const handlers = {
  LaunchRequest: function() {
    this.emit("GetShuttleBusSchedule");
  },

  GetShuttleBusSchedule: function() {
    const date = shuttlebus.getPacificTime(new Date());
    const schedule = shuttlebus.schedule;
    const response = shuttlebus.getNextSchedule(date, schedule);
    if (response.shuttle_bus) {
      const message = messageBuilder(response.message, response.shuttle_bus[0]);
      this.emit(":tell", message);
    } else {
      this.emit(":tell", response.message);
    }
  },

  "AMAZON.HelpIntent": function() {
    const speechOutput = messages.HELP_MESSAGE;
    const reprompt = messages.HELP_MESSAGE;
    this.emit(":ask", speechOutput, reprompt);
  },
  "AMAZON.CancelIntent": function() {
    this.emit(":tell", "Bye");
  },
  "AMAZON.StopIntent": function() {
    this.emit(":tell", "Good Bye");
  },
};

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
