import React from "react";
const Notification = (props) => {
  let totalMessage = null;
  let bsColor = null;
  if (props.notificationInfo) {
    totalMessage = props.notificationInfo.message;
    bsColor = props.notificationInfo.type;
    if (props.notificationInfo.type === "error") {
      totalMessage = "Error: " + totalMessage;
      bsColor = "danger";
    }
  }
  return (
    <>
      {props.notificationInfo && (
        <div className={"alert alert-" + bsColor} role="alert">
          {totalMessage}
        </div>
      )}
    </>
  );
};
export default Notification;
