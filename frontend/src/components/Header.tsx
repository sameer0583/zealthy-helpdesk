import React from 'react';
import '../styles/header.scss';

const Header: React.FC = () => {

  return (
    <header id="zealthy-header">
      <nav className="navbar navbar-default fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <svg width="117" height="15" viewBox="0 0 117 15" xmlns="http://www.w3.org/2000/svg" data-element="svg">
                <path d="M1.10352 0.683594H13.623V3.54492L5.5957 11.9238H13.916V15H0.332031V12.0312L8.27148 3.74023H1.10352V0.683594ZM17.9082 0.683594H29.7637V3.74023H22.3418V6.01562H29.2266V8.93555H22.3418V11.7578H29.9785V15H17.9082V0.683594ZM43.1797 12.6367H38.1406L37.4473 15H32.9258L38.3066 0.683594H43.1309L48.5117 15H43.8828L43.1797 12.6367ZM42.252 9.54102L40.6699 4.39453L39.0977 9.54102H42.252ZM51.9375 0.683594H56.3613V11.4746H63.2656V15H51.9375V0.683594ZM66.2715 0.683594H79.7188V4.21875H75.207V15H70.7832V4.21875H66.2715V0.683594ZM83.75 0.683594H88.1738V5.69336H93.0078V0.683594H97.4512V15H93.0078V9.20898H88.1738V15H83.75V0.683594ZM100.945 0.683594H105.857L108.748 5.51758L111.639 0.683594H116.521L110.955 9.00391V15H106.521V9.00391L100.945 0.683594Z" fill="currentColor" data-element="path" data-source-file="ZealthyLogo.tsx"></path>
              </svg>
            </a>
          </div>
          <div className="nav-group">
            <a className="nav-link" href="/">Create Ticket</a>
            <a className="nav-link" href="/admin">Admin</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;