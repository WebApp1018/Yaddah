import React, { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
import classes from "./QuillInput.module.css";
Quill.register("modules/blotFormatter", BlotFormatter);

function QuillInput({
  value,
  setter,
  quillClass = "",
  placeholder = "",
  label,
  disabled,
  allowImageUpload = false,
  form,
  ...props
}) {
  const toolbarOption = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];
  if (allowImageUpload) {
    toolbarOption.push(["link", "image"]);
  }
  const modules = {
    blotFormatter: {
      overlay: {
        style: { border: "2px solid var(--dashboard-main-color)" },
      },
    },
    toolbar: toolbarOption,
  };

  return (
    <>
      {label && <label className={classes.label}>{label}</label>}
      <style>{`
      .ql-disabled{
         background-color:var(--disabled-input-color);
      }
      .ql-snow{
         background-color:${
           disabled ? "var(--disabled-input-color)" : "var(--white-color)"
         } ;
      }
      `}</style>
      <div className={classes.quillInput}>
        <ReactQuill
          className={`${classes.quill} ${
            disabled && classes.disabledQuillInput
          } 
            ${form && classes?.formQuill}
            ${quillClass}
          
            `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e)}
          modules={modules}
          readOnly={disabled}
          {...props}
        />
      </div>
    </>
  );
}

export default QuillInput;
