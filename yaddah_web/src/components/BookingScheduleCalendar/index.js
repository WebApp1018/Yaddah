import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckSlotAvailability } from "../../Helper/scheduler";
import classes from "./BookingScheduleCalendar.module.css";

export default function BookingScheduleCalendar(props) {
  const { DateArray, timesSlotArray, slotTime, setSelectedData } = props;

  const [dateArray, setDateArray] = useState(
    JSON.parse(JSON.stringify(DateArray))
  );
  const slotSelectionTime = slotTime

  const HandleScheduleClick = (mainIndex, slotIndex, status) => {
    const AllBookedIndex = Array(slotSelectionTime / 30)
      .fill("")
      .map((item, index) => index + slotIndex);
    let dateArrayNew = JSON.parse(JSON.stringify(DateArray));

    // check if selected date is in the past or present
    if (
      moment(dateArrayNew[mainIndex].day).format("x") <= moment().format("x")
    ) {
      return toast.info("You can't select past date and current date");
    }

    let selectedDataNew = {
      date: dateArrayNew[mainIndex].day,
      slot: [],
    };
    AllBookedIndex.map((item) => {
      dateArrayNew[mainIndex].timeSlot[item].status = status;
      selectedDataNew.slot.push({
        ...dateArrayNew[mainIndex].timeSlot[item],
        status: "booked",
      });
    });
    setSelectedData(selectedDataNew);
    setDateArray(dateArrayNew);
  };

  useEffect(() => {
    setDateArray(JSON.parse(JSON.stringify(DateArray)));
  }, [DateArray]);

  return (
    <div className={[classes.MainCalanderConatiner].join(" ")}>
      <div className={[classes?.dateAndTimeContainer].join(" ")}>
        <span className={[classes?.headerDateSpan].join(" ")} />
        {timesSlotArray.map((item, timesIndex) => {
          return (
            <span
              className={[classes?.timeSpan].join(" ")}
              style={{
                borderRight: "1px solid #d7d7d7",
              }}
              key={`timeSlots-${timesIndex}`}
            >
              {item?.time}
            </span>
          );
        })}
      </div>
      {dateArray.map((item, index) => {
        return (
          <div className={[classes?.dateAndTimeContainer].join(" ")} key={index}>
            <span className={[classes?.headerDateSpan].join(" ")}>
              {moment(item?.day).format("ddd, MMM DD")}
            </span>
            <div>
              {item?.timeSlot?.map((innerItem, innerIndex) => {
                return (
                  <div
                    key={innerIndex}
                    onClick={() => {
                      const isAvailable = CheckSlotAvailability(
                        item?.timeSlot,
                        innerIndex,
                        slotSelectionTime
                      );

                      innerItem?.status == "available" &&
                        isAvailable &&
                        HandleScheduleClick(
                          index,
                          innerIndex,
                          "currentBooking"
                        );
                    }}
                    className={[
                      classes?.timeSpan,
                      classes?.timeSchedularContainer,
                      classes[innerItem?.status],
                    ].join(" ")}
                  ></div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
