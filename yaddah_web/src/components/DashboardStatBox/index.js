import React from 'react';
import styles from './StatBox.module.css'

const StatBox = ({item}) => {
    return (
        <div className={styles.statBox}>
           <div className={styles.statBox__img}>
                <img src={ item.icon } alt="" />
           </div>
           <div className={ styles.statBox__desc }>
                <p className={styles.statBox__title}>
                    {item.data}
                </p>
                <p className={styles.statBox__sub}>
                    {item.desc}
                </p>
            </div> 
        </div>
    );
}

export default StatBox;
