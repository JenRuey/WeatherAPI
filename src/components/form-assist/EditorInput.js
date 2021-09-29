import _ from "lodash";
import React from "react";
import styled from "styled-components";

// const ErrorAlert = styled.div`
//   color: red;
//   font-size: 12px;
// `;

const DropDownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 100;
  max-height: 200px;
  overflow: auto;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

let timeout;
function EditorInput({
  label,
  register,
  errors,
  defaultValue,
  suggestion,
  setValue,
  ...others
}) {
  const [dropDown, setDropDown] = React.useState([]);

  const mouseDown = (e) => {
    var container = document.getElementById("sugg-dropdown-" + register.name);
    if (!container.contains(e.target)) setDropDown([]);
  };

  React.useEffect(() => {
    window.addEventListener("mousedown", mouseDown);
    return function unmount() {
      window.removeEventListener("mousedown", mouseDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const _onChange = (event) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      let final = [];
      const uniqSuggestion = _.uniqBy(suggestion, (o) => o.trim());
      if (event.target.value) {
        let filter = _.take(
          _.filter(uniqSuggestion, function (o) {
            return o
              .toLowerCase()
              .replace(" ", "")
              .includes(event.target.value.toLowerCase().replace(" ", ""));
          }),
          200
        );
        final = filter;
      } else {
        final = uniqSuggestion;
      }
      setDropDown(_.take(final, 200));
    }, 500);
  };

  return (
    <div
      style={{ height: 48, maxWidth: 500 }}
      id={"sugg-dropdown-" + register.name}
    >
      <div className={"d-flex align-items-center"}>
        <label className={"m-0"} style={{ width: 150 }}>
          {label + " : "}
        </label>
        <div style={{ flex: 1 }}>
          <input
            style={{
              all: "unset",
              width: "100%",
              height: 24,
              border: "2px solid " + (errors[register.name] ? "red" : "#ddd"),
            }}
            autoComplete={"off"}
            defaultValue={defaultValue}
            {...register}
            onChange={(e) => {
              register.onChange(e);
              _onChange(e);
            }}
            {...others}
          />
        </div>
      </div>
      <div className={"d-flex"}>
        <div style={{ paddingLeft: 150 }} />
        <div className={"position-relative"} style={{ flex: 1 }}>
          <DropDownContent show={dropDown.length > 0}>
            {dropDown.map((item, index) => {
              return (
                <div
                  role={"button"}
                  key={register.name + "-sugg-" + index}
                  onClick={() => {
                    setValue(register.name, item);
                    setDropDown([]);
                  }}
                  className={"px-1 py-2"}
                  style={{ lineHeight: 1.2, fontSize: 10 }}
                >
                  {item}
                </div>
              );
            })}
          </DropDownContent>
          {/* {errors[register.name] && (
            <ErrorAlert>
              {errors[register.name].type === "required"
                ? "This field is required"
                : errors[register.name].message}
            </ErrorAlert>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default EditorInput;
