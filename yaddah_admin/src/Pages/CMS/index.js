import React from "react";
import { Table } from "react-bootstrap";
import styles from "./cms.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Button } from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";

const Cms = () => {
  const cmsData = [
    {
      __id: 1,
      pageName: "Home",
      route: "home",
    },
    {
      __id: 2,
      pageName: "About US",
      route: "about-us",
    },
    {
      __id: 3,
      pageName: "Contact US",
      route: "contact-us",
    },
    {
      __id: 4,
      pageName: "Footer",
      route: "footer",
    },
  ];
  const navigate = useNavigate();
  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.cms__header}>
          <h1>CMS</h1>
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
                {cmsData?.map((e, i) => (
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
                          navigate(`/cms/${e.route}`);
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

export default Cms;
