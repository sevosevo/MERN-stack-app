import React from "react";
import PropTypes from "prop-types";

const Education = ({
  education: { school, degree, fieldofstudy, from, to, description }
}) => {

    const fromDate = new Date(from);
    const toDate = !to ? to : new Date(to);

  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <h4>Location: {fieldofstudy}</h4>
      <p>
        From:{" "}
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ][fromDate.getDay()] +
          "-" +
          (parseInt(fromDate.getMonth()) + 1) +
          "-" +
          fromDate.getFullYear()}{" "}
        To:{" "}
        {toDate === null
          ? "   Now"
          : [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ][toDate.getDay()] +
            "-" +
            (parseInt(toDate.getMonth()) + 1) +
            "-" +
            toDate.getFullYear()}
      </p>
      <p>
          <strong>Degree: </strong> {degree}
      </p>
      <p>
          <strong>Description: </strong> {description}
      </p>
    </div>
  );
};

Education.propTypes = {
  education: PropTypes.object.isRequired
};

export default Education;
