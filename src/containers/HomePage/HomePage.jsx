import styles from "./HomePage.module.css";
import { useQuery } from "react-query";
import { fetchPositions } from "./queries";
import { getPositionImageUrl } from "@utils/imageUtil";
import { NavLink } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

const HomePage = () => {
  const { data, isSuccess, isLoading } = useQuery(
    `positions`,
    () => fetchPositions().then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  return (
    <div className="flex flex-wrap gap-12 justify-between">
      {isLoading && <Spinner size="lg" color="primary" />}
      {isSuccess &&
        data["data"].map((el) => {
          return (
            <div key={el.id} className="flex items-center">
              <NavLink to="/">
                <img
                  className={styles.logo}
                  src={getPositionImageUrl(el.image_filename)}
                  alt={el.title}
                ></img>
              </NavLink>

              <NavLink to="/">
                <h4 className="font-bold text-large hover:opacity-80">
                  {el.title}
                </h4>
              </NavLink>
            </div>
          );
        })}
    </div>
  );
};

export default HomePage;
