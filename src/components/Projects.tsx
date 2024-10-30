import { Container, Row, Col, Tab, Nav } from "react-bootstrap"
import { ProjectCard } from "./ProjectCard"
import colorSharp2 from "../assets/img/color-sharp2.png"
import projImg1 from "../assets/img/project-img1.png"
import projImg2 from "../assets/img/project-img2.png"
import projImg3 from "../assets/img/project-img3.png"
import TrackVisibility from "react-on-screen"

export const Projects = () => {
    const projects = [
        {
            title: "Rails Classroom",
            description: "Aplicação em Ruby on Rails que simula um ambiente de sala de aula digital, permitindo o gerenciamento de atividades e tarefas.",
            image: projImg1
        },
        {
            title: "Bank React",
            description: "Aplicativo bancário construído com React e TypeScript, permitindo criar contas, consultar saldo e realizar transações de forma local.",
            image: projImg2
        },
        {
            title: "Sistema Pizzaria",
            description: "Sistema completo de pedidos de pizzaria com CRUD e Handlebars, facilitando a gestão de pedidos, clientes e produtos.",
            image: projImg3
        },
        {
            title: "Pilantra Discord Bot",
            description: "Bot interativo para Discord, escrito em Go, projetado para interagir de forma divertida com os usuários.",
            image: projImg1
        },
        {
            title: "GoMovieCRUD",
            description: "CRUD de filmes em Go com base de dados futura para Postgres, focado no gerenciamento e organização de registros de filmes.",
            image: projImg2
        },
        {
            title: "Django CRM",
            description: "Sistema CRM desenvolvido em Django para gerenciar clientes, leads e interações, aprimorando processos de relacionamento com clientes.",
            image: projImg3
        }
    ];
    
    return (
        <section className="projects" id="project">
            <Container>
                <Row>
                    <Col>
                    <TrackVisibility>
                        {({ isVisible }) => 
                            <div className={isVisible ? "animated__animated animate__bounce" : ""}>
                        <h2>Projects</h2>
                        <p className="mt-3">
                        My portfolio highlights a range of full-stack projects showcasing expertise in modern technologies like React, TypeScript, Django, Go, and Ruby on Rails. Each project demonstrates my ability to design and implement scalable applications, from financial tools to CRM systems and interactive bots. With a focus on usability and efficiency, my work blends intuitive user interfaces with robust backend solutions, reflecting a commitment to quality and adaptability in real-world applications.
                        </p>
                        </div>}
                        </TrackVisibility>
                        <Tab.Container id="projects-tabs" defaultActiveKey="first">
                            <Nav variant="pills" className="nav-pills mb-5 mt-4 justify-content-center align-items-center" id="pills-tab">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Tab One</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Tab Two</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third" disabled>
                                        Tab Three
                                    </Nav.Link>
                                </Nav.Item>
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
            <img className="background-image-right" src={colorSharp2}></img>
        </section>
    )

}