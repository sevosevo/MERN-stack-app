import React from "react";
import PropTypes from "prop-types";

const Experience = ({
  experience: { title, company, location, from, to, description }
}) => {


    const fromDate = new Date(from);
    const toDate = !to ? to : new Date(to);

  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <h4>Location: {location}</h4>
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
          <strong>Job: </strong> {title}
      </p>
      <p>
          <strong>Description: </strong> {description}
      </p>
    </div>
  );
};

Experience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default Experience;
