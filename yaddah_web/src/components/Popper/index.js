import React, { useState } from "react";
import styles from "./Popper.module.css";
import { BsThreeDots } from "react-icons/bs";

function Popper({ item }) {
  const [contextMenu, setContextMenu] = useState(false);
  const contextMenuHandle = () => {
    setContextMenu(!contextMenu);
  };
  return (
    <>
      <button className={styles.popper__wrapper}>
        <BsThreeDots onClick={contextMenuHandle} />
        {contextMenu ? (
          <span className={styles.popperElement}>
            {item?.map((e) => (
              <li onClick={e?.func}>{e?.text}</li>
            ))}
          </span>
        ) : null}
      </button>
    </>
  );
}

export default Popper;
