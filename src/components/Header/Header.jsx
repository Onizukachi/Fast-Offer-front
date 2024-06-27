import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">Домашняя страница</NavLink>
        </li>
        <li>
          <NavLink to="/interviews">Собесы</NavLink>
        </li>
        <li>
          <NavLink to="/favorites">Избранное</NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Header