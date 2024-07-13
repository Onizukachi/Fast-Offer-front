import styles from "./Positions.module.css";
import { NavLink } from "react-router-dom";
import { getPositionImageUrl } from "@utils/imageUtil.js";
import PropTypes from "prop-types";

const Positions = ({ positions }) => (
  <div className="flex gap-3">
    {positions.map((position) => (
      <NavLink key={position.id} to="/">
        <img
          className={styles.positionImg}
          src={getPositionImageUrl(position.image_filename)}
          alt={position.title}
        />
      </NavLink>
    ))}
  </div>
);

Positions.propTypes = {
  positions: PropTypes.array,
};

export default Positions;
