import { Col } from "react-bootstrap"

interface Components {
    title: string;
    description: string;
    image: string;
}

// react functional components
// export const ProjectCard: React.FC = ({ title: string, description: string, image: string}) => {}

export const ProjectCard = ({ title, description, image }: Components) => {
    return (
        <Col sm={6} md={4}>
            <div className="proj-imgbx">
                <img src={image} />
                <div className="proj-txtx">
                    <h4>{title}</h4>
                    <span>{description}</span>
                </div>
            </div>
        </Col>
    )
}