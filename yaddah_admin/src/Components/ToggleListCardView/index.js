import React from 'react'
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiLayoutGridFill } from "react-icons/ri";
import styles from "./ToggleListCardView.module.css"
const ToggleListCardView = ({toggleState,setter}) => {
  return (
    <div className={styles.Button_wrapper}>
           <span
            onClick={()=>{setter(false)}}
              className={`${styles.togglebtn1} ${
                !toggleState ? styles.active__ToggleBtn : ""
              }`}
            >
              <RiLayoutGridFill
                className={!toggleState && styles.icon_active}
                size={20}
              />
            </span>
            <span
            onClick={()=>{setter(true)}}
              className={`${styles.togglebtn2} ${
                toggleState ? styles.active__ToggleBtn : ""
              }`}
            >
              <AiOutlineUnorderedList
                className={toggleState && styles.icon_active}
                size={20}
              />
            </span>
    </div>
  )
}

export default ToggleListCardView