import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from "../assets/img/color-sharp2.png";
import projCsv from "../assets/img/csv_analysis.png";
import projPoke from "../assets/img/pokehub.png";
import projSpreadsheet from "../assets/img/spreadsheet_auto.png";
import projTech from "../assets/img/tech_interview.png";
import projDjango from "../assets/img/django-crm.png";
import projEmotion from "../assets/img/emotion_track.png";
import TrackVisibility from "react-on-screen";
import { useTranslation } from "react-i18next";

export const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      title: "CSV Analysis",
      description: t("projects.csvAnalysis.description"),
      image: projCsv,
      github: "https://github.com/Lucasdsgomes/csv-analysis",
    },
    {
      title: "Django CRM",
      description: t("projects.django.description"),
      image: projDjango,
      github: "https://github.com/Lucasdsgomes/django-crm",
    },
    {
      title: "Tech Interview",
      description: t("projects.techInterview.description"),
      image: projPoke,
      github: "https://github.com/Lucasdsgomes/tech-interview",
    },
    {
      title: "Spreadsheet Automation",
      description: t("projects.spreadSheetAuto.description"),
      image: projSpreadsheet,
      github: "https://github.com/Lucasdsgomes/spreadsheet-auto",
    },
    {
      title: "PokeHub IA",
      description: t("projects.pokeHub.description"),
      image: projTech,
      github: "https://github.com/Lucasdsgomes/pokehub-ia",
    },
    {
      title: "Emotion Tracker",
      description: t("projects.emotionTrack.description"),
      image: projEmotion,
      github: "https://github.com/Aaronfrombr/Burnout_app",
    },
  ];

  return (
    <section className="projects" id="projects">
      <Container>
        <Row>
          <Col>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animated__animated animate__bounce" : ""
                  }
                >
                  <h2>{t("projects.title")}</h2>
                  <p className="mt-3">{t("projects.introduction")}</p>
                </div>
              )}
            </TrackVisibility>
            <Tab.Container id="projects-tabs" defaultActiveKey="first">
              <Nav
                variant="pills"
                className="nav-pills mb-5 mt-4 justify-content-center align-items-center"
                id="pills-tab"
              >
                {/* Tabs para futuros projetos */}
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Row>
                    {projects.map((project, index) => {
                      return <ProjectCard key={index} {...project} />;
                    })}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="second"></Tab.Pane>
                <Tab.Pane eventKey="third"></Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      <img
        className="background-image-right"
        src={colorSharp2}
        alt="Background"
      ></img>
    </section>
  );
};
