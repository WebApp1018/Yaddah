import { Skeleton } from "@mui/material";
import React from "react";

function TableSkeleton({ rowsCount = 10, colsCount = 5 }) {
  const rows = Array(rowsCount).fill(0);
  const cols = Array(colsCount).fill(0);

  return (
    <>
      <style>{`
           .tr{
                all:unset;
                display:flex;
                margin:10px 30px 0px 30px;
            }
            .table100{
                padding-top:30px;
            }
            `}</style>
      <tbody>
        {rows.map((item) => (
          <tr >
            {cols.map((item) => (
              <td
                style={{
                  width: `${100 / colsCount}%`,
                  paddingBlock: "0px",
                }}
              >
                <Skeleton height={"70px"} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>

   
    </>
  );
}

export default TableSkeleton;
