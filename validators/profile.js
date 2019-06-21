const { body } = require("express-validator/check");

//Validator
module.exports = {
  profileValidator: [
    body("status")
      .not()
      .isEmpty()
      .withMessage("Status field is required."),
    body("skills")
      .not()
      .isEmpty()
      .withMessage("Skills field is required.")
      .custom((val, { req, location, path }) => {
        const rawSkills = val;
        const skills = rawSkills.split(",").map(skill => skill.trim());

        //Skill length check
        skills.forEach(skill => {
          if (skill.length > 10) {
            throw new Error("Skill can't be more then 10 chars long.");
          }
        });

        if (skills.length > 8) {
          throw new Error("You can't have more then 8 skills");
        }

        return true;
      })
  ],
  errorFormatter: ({ location, msg, param, value, nestedErrors }) => {
    return `${msg}`;
  }
};
