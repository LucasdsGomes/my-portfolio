import { Container, Col, Row } from "react-bootstrap";
import logo from "../assets/img/devLogo.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <Container>
                <Row className="align-item-center">
                    <Col sm={6}>
                        <img src={logo} alt="Logo"/>
                    </Col>
                    <Col sm={6} className="text-center text-sm-end">
                        <div className="social-icon mt-4">
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
                        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
