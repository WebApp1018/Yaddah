import moment from "moment-timezone";

const CreateNextTwoWeekArray = () => {
  const dateArray = [];
  for (var i = 1; i < 15; i++) {
    dateArray.push({
      date: moment().add(i, "day").format(),
      day: moment().add(i, "day").format("dddd"),
    });
  }
  return dateArray;
};

const createTimeChunk = (interval = 15) => {
  let times = []; // time array
  let tt = 0; // start time

  let ap = ["AM", "PM"]; // AM-PM

  //loop to increment the time and push results in array 12hour format
  for (let i = 0; tt < 24 * 60; i++) {
    let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    let mm = tt % 60; // getting minutes of the hour in 0-55 format
    if (hh == 12 || hh == 0) {
      times[i] = {
        time: 12 + ":" + ("0" + mm).slice(-2) + " " + ap[Math.floor(hh / 12)], // pushing data in array in [00:00 - 12:00 AM/PM format]
        status: "empty", // defualt status
      };
    } else {
      times[i] = {
        time:
          ("0" + (hh % 12)).slice(-2) +
          ":" +
          ("0" + mm).slice(-2) +
          " " +
          ap[Math.floor(hh / 12)], // pushing data in array in [00:00 - 12:00 AM/PM format]
        status: "empty", // defualt status
      };
    }
    tt = tt + interval;
  }
  return times;
};

const CreateWeekSchedular = (timeChunk = []) => {
  const dateArray = [
    {
      day: "Sunday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Monday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Tuesday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Wednesday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Thursday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Friday",
      timeSlot: [...timeChunk],
    },
    {
      day: "Saturday",
      timeSlot: [...timeChunk],
    },
  ];

  return dateArray;
};
const CheckSlotAvailability = (timeSlots, slotIndex, maxTime) => {
  const totalSlots = maxTime / 30;

  let isAvailable = false;
  for (let i = 0; i < totalSlots; i++) {
    if (
      !["available", "currentBooking"].includes(
        timeSlots[slotIndex + i]?.status
      )
    ) {
      isAvailable = false;
    } else {
      isAvailable = true;
    }
  }

  return isAvailable;
};


console.log("moment().format() ", moment().format())

const initialScheduleDateRange = {
  startDate: moment().startOf("week").format(),
  endDate: moment().endOf("week").format(),
  // startDate: moment().format(),
  // endDate: moment().add(6, "days").format(),
};

export {
  CreateNextTwoWeekArray,
  createTimeChunk,
  CreateWeekSchedular,
  CheckSlotAvailability,
  initialScheduleDateRange,
};
