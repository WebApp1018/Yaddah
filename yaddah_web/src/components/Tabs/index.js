import React, { useRef } from "react";
import { useEffect } from "react";
import classes from "./Tabs.module.css";

function Tabs({ tabs, selectedTab, setSelectedTab }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current !== undefined &&
      scrollRef.current !== null &&
      scrollRef.current?.scrollIntoView({
        inline: "start",
        behaviour: "smooth",
        block: "nearest",
      });
  }, [selectedTab]);

  return (
    <div className={classes?.tabsDiv}>
      <ul className={classes.tabs}>
        {tabs?.map((item) => (
          <li
            data-selected={selectedTab?._id == item?._id}
            onClick={() => setSelectedTab(item)}
            ref={selectedTab?._id == item?._id ? scrollRef : null}
          >
            {item?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tabs;
