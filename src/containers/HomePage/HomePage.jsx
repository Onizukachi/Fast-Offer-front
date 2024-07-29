import styles from "./HomePage.module.css";
import { useState } from 'react'
import { useQuery } from "react-query";
import { positionsQuery } from "./queries";
import { NavLink } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { deserialize } from "deserialize-json-api";

const HomePage = () => {
  const [positions, setPositions] = useState([])

  const { isSuccess, isLoading } = useQuery(
    `positions`,
    () =>
      positionsQuery(
      ).then((data) => {
        setPositions(deserialize(data).data)
      }),
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  console.log(positions)

  return (
    <div className="flex flex-wrap gap-12 justify-between">
      {isLoading && <Spinner size="lg" color="primary" />}
      {isSuccess &&
        positions.map((el) => {
          return (
            <div key={el.id} className="flex items-center">
              <NavLink to="/">
                <img
                  className={styles.logo}
                  src={el.image_url}
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
