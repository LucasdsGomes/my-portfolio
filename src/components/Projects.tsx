import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from "../assets/img/color-sharp2.png";
import projCalcIp from "../assets/img/calcIp-project.png";
import projBank from "../assets/img/bank-project.png";
import projPizzaria from "../assets/img/pizzaria-project.png";
import projClock from "../assets/img/clock-project.png";
import projGo from "../assets/img/go-movie.png";
import projDjango from "../assets/img/django-crm.png";
import TrackVisibility from "react-on-screen";
import { useTranslation } from "react-i18next";

export const Projects = () => {
    const { t } = useTranslation();

    const projects = [
        {
            title: "Clock Project",
            description: t("projects.clock.description"),
            image: projClock
        },
        {
            title: "Django CRM",
            description: t("projects.django.description"),
            image: projDjango
        },
        {
            title: "Sistema Pizzaria",
            description: t("projects.pizzaria.description"),
            image: projPizzaria
        },
        {
            title: "Calc Ip",
            description: t("projects.calcIp.description"),
            image: projCalcIp
        },
        {
            title: "GoMovieCRUD",
            description: t("projects.goMovie.description"),
            image: projGo
        },
        {
            title: "Bank React",
            description: t("projects.bank.description"),
            image: projBank
        },
    ];

    return (
        <section className="projects" id="projects">
            <Container>
                <Row>
                    <Col>
                    <TrackVisibility>
                        {({ isVisible }) => 
                            <div className={isVisible ? "animated__animated animate__bounce" : ""}>
                        <h2>{t("projects.title")}</h2>
                        <p className="mt-3">{t("projects.introduction")}</p>
                        </div>}
                        </TrackVisibility>
                        <Tab.Container id="projects-tabs" defaultActiveKey="first">
                            <Nav variant="pills" className="nav-pills mb-5 mt-4 justify-content-center align-items-center" id="pills-tab">
                                {/* Tabs para futuros projetos */}
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Row>
                                        {
                                            projects.map((project, index) => {
                                                 return (
                                                    <ProjectCard
                                                        key={index}
                                                        {...project}
                                                    />
                                                 )
                                            })
                                        }
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second"></Tab.Pane>
                                <Tab.Pane eventKey="third"></Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-right" src={colorSharp2} alt="Background"></img>
        </section>
    );
};
