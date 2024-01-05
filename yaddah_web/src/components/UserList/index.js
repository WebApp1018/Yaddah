import React from "react";
import { Table } from "react-bootstrap";
import { Button } from "../../components/Button/Button";
import TableSkeleton from "../../components/TableSkeletonBootstrap";

import styles from "./UserList.module.css";
const index = ({ user, isLoading }) => {
  return (
    <div className={styles.__content}>
      <Table responsive="xxl" borderless="true">
        <thead>
          <tr>
            <th>Profile </th>
            <th> First Name </th>
            <th> Last Name </th>
            <th> Email </th>
            <th> Action </th>
          </tr>
        </thead>

        {isLoading ? (
          <TableSkeleton rowsCount={10} colsCount={5} />
        ) :(
          <tbody>
            {user?.map((item) => (
              <tr>
                <td className={styles.userCard__button__wrapper}>
                  <img
                    className={styles.image__wrapper}
                    src={item?.userAvatar}
                    alt=""
                  />
                </td>
                <td>{item?.firstName}</td>
                <td> {item?.lastName} </td>
                <td> {item?.email} </td>

                <td>
                    <div className={styles.userCard__button__wrapper}>
                      <Button
                        label={"Edit"}
                        className={styles.userCard__button}
                      />
                      <Button
                        label={"View Detail"}
                        className={[
                          styles.userCard__button,
                          styles.userCard__button__bordered,
                        ].join(" ")}
                      />
                    </div>
                 
                </td>
              </tr>
            ))}
          </tbody>
        )
       }
      </Table>
    </div>
  );
};

export default index;
