import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="navbarContainer">
      <Link to="/">
        <img
          className="navLogo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="navLinksContainer">
        <Link to="/" className="navLink">
          <li className="navListItem">
            <AiFillHome className="mobileIconsOn" />
            <span className="mobileIconsOff">Home</span>
          </li>
        </Link>
        <Link to="/jobs" className="navLink">
          <li className="navListItem">
            <BsFillBriefcaseFill className="mobileIconsOn" />
            <span className="mobileIconsOff">Jobs</span>
          </li>
        </Link>
        <li className="navListItem">
          <FiLogOut className="mobileIconsOn" onClick={onLogout} />
          <button
            type="button"
            onClick={onLogout}
            className="mobileIconsOff logoutBtn"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
