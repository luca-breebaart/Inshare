import React from 'react';
import styles from '../LeftNavBar/Style.LeftNavBar.module.scss';
import logo from '../../images/LOGO.svg';
import { FaHome, FaCompass, FaTags, FaUsers, FaSave, FaUser } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

function LeftNavBar() {
  // Get the current pathname from window.location
  // const currentPathname = window.location.pathname;
  const location = useLocation();

  return (
    
    <div className={styles.navigationcontainer2}>
      <div className={styles.navigation}>
        <div className={styles.navigationcontainer}>
          <ul className="nav flex-column">

            <a className={location.pathname === '/Home' ? styles.navitemcurrent : styles.navitem} href="/Home">
              <div className={styles.linkItem}>
                <FaHome className={styles.icon} /> {/* Home Icon */}
                <a className={styles.navlink}>Home</a>
              </div>
            </a>

            <a title="Click to view Posts in Random Order" className={location.pathname === '/Explore' ? styles.navitemcurrent : styles.navitem} href="/Explore">
              <div className={styles.linkItem}>
                <FaCompass className={styles.icon} /> {/* Explore Topics Icon */}
                <a className={styles.navlink}>Explore</a>
              </div>
            </a>

            <a className={location.pathname === '/Tags' ? styles.navitemcurrent : styles.navitem} href="/Tags">
              <div className={styles.linkItem}>
                <FaTags className={styles.icon} /> {/* Tags Icon */}
                <a className={styles.navlink}>Categories</a>
              </div>
            </a>

            {/* <a className={location.pathname === '/Users' ? styles.navitemcurrent : styles.navitem} href="/Users">
              <div className={styles.linkItem}>
                <FaUsers className={styles.icon} /> 
                <a className={styles.navlink}>Users</a>
              </div>
            </a> */}

            {/* <a className={location.pathname === '/Saved' ? styles.navitemcurrent : styles.navitem} href="/Saved">
              <div className={styles.linkItem}>
                <FaSave className={styles.icon} /> 
                <a className={styles.navlink}>Saved</a>
              </div>
            </a> */}

            <a className={location.pathname === '/Profile' ? styles.navitemcurrent : styles.navitem} href="/Profile">
              <div className={styles.linkItem}>
                <FaUser className={styles.icon} /> {/* Profile Icon */}
                <a className={styles.navlink}>Profile</a>
              </div>
            </a>

          </ul>
          <div className={styles.logosection}>
            <img className={styles.logocontainer} src={logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftNavBar;
