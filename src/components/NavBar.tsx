import { useState, useEffect } from "react";
import { Nav, Container, Navbar } from "react-bootstrap";
import logo from "../assets/img/devLogo.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export const NavBar = () => {
  const { t } = useTranslation();
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value: string) => {
    setActiveLink(value);
  };

  const handleLanguageChange = () => {
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <>
      <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} id="logo" alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <span className="navbar-toggle-icon"></span>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                href="#home"
                className={
                  activeLink === "home" ? "active navbar-link" : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("home")}
              >
                {t("navbar.home")}
              </Nav.Link>
              <Nav.Link
                href="#skills"
                className={
                  activeLink === "skills" ? "active navbar-link" : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("skills")}
              >
                {t("navbar.skills")}
              </Nav.Link>
              <Nav.Link
                href="#projects"
                className={
                  activeLink === "projects"
                    ? "active navbar-link"
                    : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("projects")}
              >
                {t("navbar.projects")}
              </Nav.Link>
              <Nav.Link
                className={activeLink==="translate"? "active navbar-link"
                  : "navbar-link"} onClick={() => handleLanguageChange()}
              >
                {t("navbar.translate")}
              </Nav.Link>
            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
                <a href="https://www.linkedin.com/in/lucasdsgomes/">
                  <img src={navIcon1} alt="Linkedin" />
                </a>
                <a href="https://github.com/LucasdsGomes">
                  <img src={navIcon2} alt="GitHub" />
                </a>
                <a href="https://www.instagram.com/lcgomes1_/">
                  <img src={navIcon3} alt="Instagram" />
                </a>
              </div>
              <button className="vvd" onClick={() => console.log("connect")}>
                <span>{t("navbar.connect")}</span>
              </button>
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
