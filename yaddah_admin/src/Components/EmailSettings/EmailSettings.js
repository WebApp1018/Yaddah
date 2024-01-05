import React, { useState } from "react";
import classes from "./EmailSettings.module.css";
import EmailRadioBtn from "../EmailRadioBtn";
import SendGridForm from "../AllEmailsSMTPForm/SendGridForm";
import GmailForm from "../AllEmailsSMTPForm/GmailForm";
import PostmarkForm from "../AllEmailsSMTPForm/PostmarkForm";
import AmazonSesForm from "../AllEmailsSMTPForm/AmazonSesForm";
import { useEffect } from "react";
import Office365Form from "../AllEmailsSMTPForm/Office365Form";

const EmailSettings = ({
  data,
  onClick,
  isLoading,
  setPreviouslySelectedEmailProvider,
}) => {
  const SMTPServiceList = [
    "sendgrid",
    "postmark",
    "gmail",
    "awsSes",
    "office365",
  ];

  const [selectedType, setSelectedType] = useState("");
  const typeComponent = [
    {
      name: "sendgrid",
      component: (
        <SendGridForm
          data={data?.find((e) => e?.keyType == "sendgrid")}
          onClick={onClick}
          isLoading={isLoading}
        />
      ),
    },
    {
      name: "postmark",
      component: (
        <PostmarkForm
          data={data?.find((e) => e?.keyType == "postmark")}
          onClick={onClick}
          isLoading={isLoading}
        />
      ),
    },
  
    {
      name: "gmail",
      component: (
        <GmailForm
          data={data?.find((e) => e?.keyType == "gmail")}
          onClick={onClick}
          isLoading={isLoading}
        />
      ),
    },
    {
      name: "awsSes",
      component: (
        <AmazonSesForm
          data={data?.find((e) => e?.keyType == "awsSes")}
          onClick={onClick}
          isLoading={isLoading}
        />
      ),
    },
    {
      name: "office365",
      component: (
        <Office365Form
          data={data?.find((e) => e?.keyType == "office365")}
          onClick={onClick}
          isLoading={isLoading}
        />
      ),
    },
  ];

  // get the last selectedType
  useEffect(() => {
    if (data?.length > 0) {
      const filteredEmails = data.filter((e) =>
        SMTPServiceList.includes(e.keyType)
      );

      const lastSelectedType = filteredEmails.find(
        (e) =>
          e?.sendgrid?.isSelect ||
          e?.postmark?.isSelect ||
          e?.gmail?.isSelect ||
          e?.awsSes?.isSelect
      );

      if (lastSelectedType) {
        setPreviouslySelectedEmailProvider(lastSelectedType);
        setSelectedType(lastSelectedType?.keyType);
      }
    }
  }, []);

  return (
    <div>
      <h1>Email Settings</h1>
      <div className={classes?.typeListContainer}>
        {SMTPServiceList.map((e, i) => (
          <EmailRadioBtn
            key={i}
            label={e}
            value={selectedType}
            setValue={setSelectedType}
          />
        ))}
      </div>
      <div className={classes?.formContainer}>
        {typeComponent?.find((e) => e.name === selectedType)?.component}
      </div>
    </div>
  );
};

export default EmailSettings;
