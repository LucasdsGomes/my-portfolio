import Carousel from "react-multi-carousel";
import { Container, Row, Col } from "react-bootstrap"
import "react-multi-carousel/lib/styles.css"
import meter1 from "../assets/img/meter1.svg"
import meter2 from "../assets/img/meter2.svg"
import meter3 from "../assets/img/meter3.svg"
import colorSharp from "../assets/img/color-sharp.png";

export const Skills = () => {
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
                            <h2>Skills</h2>
                            <p>I'm a versatile and adaptable developer with a passion for technology and design. I excel in creating engaging and user-friendly interfaces using HTML, CSS, JavaScript, TypeScript and React. With experience in Python (Django), Golang (Gin), among other languages, I deliver promising projects in the job market.</p>
                            <Carousel responsive={responsive} infinite={true} className="skill-slider">
                            <div className="item">
                                <img src={meter1} alt="HTML & CSS" />
                                <h3>HTML & CSS</h3>
                                <p>Experienced in creating attractive and user-friendly interfaces using HTML and CSS, focusing on usability and responsive design.</p>
                            </div>
                            <div className="item">
                                <img src={meter2} alt="JavaScript & TypeScript" />
                                <h3>JavaScript & TypeScript</h3>
                                <p>Excellence in developing dynamic and interactive interfaces with JavaScript and TypeScript.</p>
                            </div>
                            <div className="item">
                                <img src={meter3} alt="React" />
                                <h3>React</h3>
                                <p>Creating interactive and high-performance applications in React, utilizing hooks and state management for optimal usability.</p>
                            </div>
                            <div className="item">
                                <img src={meter1} alt="Python & Django" />
                                <h3>Python & Django</h3>
                                <p>Developing robust and scalable solutions with Python and Django, focusing on efficiency and security.</p>
                            </div>
                            <div className="item">
                                <img src={meter2} alt="GoLang & Gin" />
                                <h3>GoLang & Gin</h3>
                                <p>Implementing high-performance backend applications with low latency using GoLang and the Gin framework.</p>
                            </div>
                            <div className="item">
                                <img src={meter2} alt="MySQL & PostgreSQL" />
                                <h3>MySQL & PostgreSQL</h3>
                                <p>Expertise in managing databases with MySQL and PostgreSQL, ensuring data integrity and optimal query performance.</p>
                            </div>

                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-left" src={colorSharp} />
        </section>
    )
}