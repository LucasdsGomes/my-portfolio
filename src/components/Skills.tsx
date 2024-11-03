import Carousel from "react-multi-carousel";
import { Container, Row, Col } from "react-bootstrap";
import "react-multi-carousel/lib/styles.css";
import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import colorSharp from "../assets/img/color-sharp.png";
import { useTranslation } from "react-i18next";

export const Skills = () => {
    const { t } = useTranslation();

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <section className="skill" id="skills">
            <Container>
                <Row>
                    <Col>
                        <div className="skills-bx">
                            <h2>{t("skills.title")}</h2>
                            <p>{t("skills.introduction")}</p>
                            <Carousel responsive={responsive} infinite={true} className="skill-slider">
                                <div className="item">
                                    <img src={meter1} alt="HTML & CSS" />
                                    <h3>{t("skills.html_css.title")}</h3>
                                    <p>{t("skills.html_css.description")}</p>
                                </div>
                                <div className="item">
                                    <img src={meter2} alt="JavaScript & TypeScript" />
                                    <h3>{t("skills.javascript_typescript.title")}</h3>
                                    <p>{t("skills.javascript_typescript.description")}</p>
                                </div>
                                <div className="item">
                                    <img src={meter3} alt="React" />
                                    <h3>{t("skills.react.title")}</h3>
                                    <p>{t("skills.react.description")}</p>
                                </div>
                                <div className="item">
                                    <img src={meter1} alt="Python & Django" />
                                    <h3>{t("skills.python_django.title")}</h3>
                                    <p>{t("skills.python_django.description")}</p>
                                </div>
                                <div className="item">
                                    <img src={meter2} alt="GoLang & Gin" />
                                    <h3>{t("skills.golang_gin.title")}</h3>
                                    <p>{t("skills.golang_gin.description")}</p>
                                </div>
                                <div className="item">
                                    <img src={meter2} alt="MySQL & PostgreSQL" />
                                    <h3>{t("skills.mysql_postgresql.title")}</h3>
                                    <p>{t("skills.mysql_postgresql.description")}</p>
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-left" src={colorSharp} alt="Background" />
        </section>
    );
};
