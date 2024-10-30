import { Container, Row, Col, Tab, Nav } from "react-bootstrap"
import { ProjectCard } from "./ProjectCard"
import colorSharp2 from "../assets/img/color-sharp2.png"
import projCalcIp from "../assets/img/calcIp-project.png"
import projBank from "../assets/img/bank-project.png"
import projPizzaria from "../assets/img/pizzaria-project.png"
import projClock from "../assets/img/clock-project.png"
import projGo from "../assets/img/go-movie.png"
import projDjango from "../assets/img/django-crm.png"
import TrackVisibility from "react-on-screen"

export const Projects = () => {
    const projects = [
        {
            title: "Clock Project",
            description: "Aplicação em HTML, CSS e JS que simula um relógio em tempo real que modifica a coloração da página conforme o período atual e totalmente personalizado. ",
            image: projClock
        },
        {
            title: "Django CRM",
            description: "Sistema CRM desenvolvido em Django para gerenciar clientes, leads e interações, aprimorando processos de relacionamento com clientes.",
            image: projDjango
        },
        {
            title: "Sistema Pizzaria",
            description: "Sistema completo de pedidos de pizzaria com CRUD e Handlebars, facilitando a gestão de pedidos, clientes e produtos.",
            image: projPizzaria
        },
        {
            title: "Calc Ip",
            description: "Aplicação em HTML, CSS, JS e Golang que simula uma calculadora de IP prática que coloca em pauta a funcionalidade de sub redes e seu uso, permitindo um amplo gerenciamento.",
            image: projCalcIp
        },
        {
            title: "GoMovieCRUD",
            description: "CRUD de filmes em Go com base de dados futura para Postgres, focado no gerenciamento e organização de registros de filmes dentro do Postman.",
            image: projGo
        },
        {
            title: "Bank React",
            description: "Aplicativo bancário construído com React e TypeScript, permitindo criar contas, consultar saldo e realizar transações de forma local.",
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
                        <h2>Projects</h2>
                        <p className="mt-3">
                        My portfolio highlights a range of full-stack projects showcasing expertise in modern technologies like React, TypeScript, Django, Go, and Ruby on Rails. Each project demonstrates my ability to design and implement scalable applications, from financial tools to CRM systems and interactive bots. With a focus on usability and efficiency, my work blends intuitive user interfaces with robust backend solutions, reflecting a commitment to quality and adaptability in real-world applications.
                        </p>
                        </div>}
                        </TrackVisibility>
                        <Tab.Container id="projects-tabs" defaultActiveKey="first">
                            <Nav variant="pills" className="nav-pills mb-5 mt-4 justify-content-center align-items-center" id="pills-tab">
                                {/* I'll use this part of the code when i add more projects at my portfolio */}

                                {/* <Nav.Item>
                                    <Nav.Link eventKey="first">Tab One</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Tab Two</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">
                                        Tab Three
                                    </Nav.Link>
                                </Nav.Item> */}
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