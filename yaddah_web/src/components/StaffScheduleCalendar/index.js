import { useEffect, useState } from "react";
import classes from "./StaffScheduleCalendar.module.css";

export default function StaffScheduleCalendar(props) {
  const { DateArray, timesSlotArray, onSchedulerChange } = props;

  const [dateArray, setDateArray] = useState(
    JSON.parse(JSON.stringify(DateArray))
  );

  const HandleScheduleClick = (mainIndex, slotIndex, status) => {
    let dateArrayNew = [...dateArray];
    dateArrayNew[mainIndex].timeSlot[slotIndex].status = status;

    setDateArray(dateArrayNew);
    onSchedulerChange(dateArrayNew);
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
          <div className={[classes?.dateAndTimeContainer].join(" ")}>
            <span className={[classes?.headerDateSpan].join(" ")}>
              {item?.day}
            </span>
            <div>
              {item?.timeSlot?.map((innerItem, innerIndex) => {
                return (
                  <div
                    onClick={() => {
                      HandleScheduleClick(
                        index,
                        innerIndex,
                        innerItem?.status == "available" ? "empty" : "available"
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
