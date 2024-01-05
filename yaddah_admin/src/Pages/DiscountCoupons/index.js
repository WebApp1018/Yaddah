import React, { useState } from "react";
import styles from "./DiscountCoupons.module.css";
import { AiFillEdit } from "react-icons/ai";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import { Button } from "../../Components/Button/Button";
import NoData from "../../Components/NoData/NoData";
import { useNavigate } from "react-router-dom";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Loader } from "../../Components/Loader";
import { toast } from "react-toastify";

const DiscountCard = ({ item, setCoupons, index, coupons }) => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.authReducer);

  const changeStatus = async () => {
    const params = {
      status: !item.isActive,
    };
    setisLoading(true);
    const response = await Patch(
      BaseURL(`coupon/active-deactive-coupon/${item._id}`),
      params,
      apiHeader(accessToken)
    );
    if (response) {
      const temp = [...coupons];
      temp[index] = response?.data?.data;
      setCoupons(temp);
      toast.success(
        `Coupon ${
          response?.data?.data?.isActive ? "Activated" : "Deactivated"
        } Successfully`
      );
    }
    setisLoading(false);
  };
  return (
    <div className={styles.discount__card}>
      <div className={styles.coupon___desc}>
        <h3 className={styles.__header}>{item.title}</h3>
        <div className={styles.date}>
          <span className={styles.__desc}>
            Expiry Date: {moment(item.expire).format("DD/MM/YYYY")}
          </span>
        </div>
        <div className={styles.__btn__wrapper}>
          <Button
            onClick={changeStatus}
            customStyle={{
              minWidth: "120px",
            }}
            variant={"primary"}
            label={
              isLoading ? "Wait..." : item.isActive ? "Deactivate" : "Activate"
            }
            disabled={isLoading}
          />

          {/* </Button> */}
          <Button
            className={[styles.__btn, styles.__btn__bordered].join(" ")}
            onClick={() => {
              navigate(`/create-coupon/${item._id}`);
            }}
          >
            View Detail
          </Button>
        </div>
        <Button
          className={styles.edit__btn}
          onClick={() => {
            navigate(`/create-coupon/${item._id}`);
          }}
        >
          <AiFillEdit />
        </Button>
      </div>
      <div className={styles.coupon__price}>
        <p className={styles.__content}>
          <span>{item.discount}%</span>
          <span>Discount</span>
        </p>
      </div>
    </div>
  );
};
const DiscountCoupons = () => {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.authReducer);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCoupons = async () => {
    setIsLoading(true);
    const response = await Get(BaseURL(`coupon/admin/all`), accessToken);
    if (response !== undefined) {
      setCoupons(response?.data.data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCoupons();
  }, []);

  return (
    <SidebarSkeleton>
      {isLoading ? (
        <Loader className={styles.loader} />
      ) : (
        <div className={styles.content__wrapper}>
          <div className={styles.discount__header}>
            <h1>Discount Coupons</h1>
            <Button
              label={"+ Add New Coupon"}
              className={styles.DownloadReport}
              customStyle={{
                backgroundColor: "var(--clr-secondary)",
                color: "var(--clr-font-inverted)",
                fontFamily: "var(--ff-poppins-semibold)",
                border: "none",
              }}
              onClick={() => {
                navigate(`/create-coupon`);
              }}
            />
          </div>
          <div className={styles.discount__content__wrapper}>
            {!isLoading && coupons?.length > 0 ? (
              coupons?.map((e, index) => (
                <DiscountCard
                  item={e}
                  getCoupons={getCoupons}
                  index={index}
                  setCoupons={setCoupons}
                  coupons={coupons}
                />
              ))
            ) : (
              <NoData text="No Coupons Found" />
            )}
          </div>
        </div>
      )}
    </SidebarSkeleton>
  );
};

export default DiscountCoupons;
