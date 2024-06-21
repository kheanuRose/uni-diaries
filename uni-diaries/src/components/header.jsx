import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHouse,faChalkboardUser,faBed,faGraduationCap,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
//import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons';


function Header() {

 
  const element = <FontAwesomeIcon icon={faUser} className="user-account-icon" />;
  const home = <FontAwesomeIcon icon={faHouse} />
  const bed = <FontAwesomeIcon icon={faBed} />
  const college = <FontAwesomeIcon icon={faGraduationCap} />
  const professor = <FontAwesomeIcon icon={faChalkboardUser} />
  const signout = <FontAwesomeIcon icon={faRightFromBracket} />
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/home">{home}   Home</Link></li>
          <li><Link to="/professor_comments">{professor}    Professor Comments</Link></li>
          <li><Link to="/living_comments">{bed}   living experience</Link></li>
          <li><Link to="/college_experience">{college}    college experience</Link></li>
          <li><Link to="/signout">{signout}   sign out</Link></li>
          <li><Link to="/account">{element}   Account</Link></li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
