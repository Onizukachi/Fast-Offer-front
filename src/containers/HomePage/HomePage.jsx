import styles from './HomePage.module.css';
// import ChooseSide from '@components/HomePage/ChooseSide';
import React, {useEffect, useState} from "react"
import { useQuery } from 'react-query'
import { fetchPositions } from './queries.js'
import { getPositionImageUrl } from '@utils/imageUtil'
import {NavLink} from "react-router-dom";

const HomePage = () => {
  const { data, isLoading, isSuccess } = useQuery(
    `kitchenLoads`,
    () => fetchPositions().then((data) => data),
    { refetchInterval: false, refetchOnWindowFocus: false }
  )

  return (
    <div className="flex flex-wrap gap-12 justify-between">
      { isSuccess && data['data'].map((el) => {
        return (
          <div className="flex items-center">
            <NavLink to="/">
              <img className={styles.logo} src={getPositionImageUrl(el.image_filename)} alt={el.title}></img>
            </NavLink>

            <NavLink to="/" >
              <h4 className="font-bold text-large hover:opacity-80">{el.title}</h4>
            </NavLink>
          </div>
        )
      })}
    </div>
  );
}

export default HomePage;
