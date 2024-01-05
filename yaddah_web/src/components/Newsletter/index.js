import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL, validateEmail } from "../../config/apiUrl";
import styles from "./newsletter.module.css";

const Newsletter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  // handleSubmit
  const handleSubmit = async () => {
    if (!validateEmail(email))
      return toast.info("Please enter valid email address.");

    const params = {
      email,
    };

    const url = BaseURL(`newsletter`);
    setIsLoading(true);
    const response = await Post(url, params, apiHeader());
    setIsLoading(false);

    if (response !== undefined) {
      toast.success("Subscribed Successfully.");
      setEmail("");
    }
  };

  return (
    <div className={styles.newsletter__comp}>
      <div className={styles.newsletter__comp__header}>
        <h3>Subscribe Our Newsletter</h3>
      </div>
      <div className={styles.newsletter__comp__input}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e?.target?.value)}
          placeholder="Email Address"
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Wait..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
