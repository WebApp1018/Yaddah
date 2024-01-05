import React from "react";
import { Table } from "react-bootstrap";
import styles from "./Cruds.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Button } from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";

const CRUDS = () => {
  const CRUDSData = [
    {
      __id: 1,
      pageName: "Social Links",
      route: "social-links",
    },
    {
      __id: 2,
      pageName: "Why Choose Us",
      route: "why-choose-us",
    },
  ];
  const navigate = useNavigate();
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.cms__header}>
          <h1>CRUDS</h1>
        </div>
        <div className={styles.cms__wrapper}>
          <div className={styles.table__wrapper}>
            <Table borderless="true">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Page</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {CRUDSData?.map((e, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.pageName}</td>
                    <td>
                      <Button
                        label="Edit"
                        className={["btn__solid", styles.btn__secondary].join(
                          " "
                        )}
                        onClick={() => {
                          navigate(`/cruds/${e.route}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </SidebarSkeleton>
  );
};

export default CRUDS;
