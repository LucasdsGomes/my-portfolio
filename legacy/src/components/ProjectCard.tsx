import { Col } from "react-bootstrap";

interface Components {
  title: string;
  description: string;
  image: string;
  github: string;
}

export const ProjectCard = ({
  title,
  description,
  image,
  github,
}: Components) => {
  return (
    <Col sm={6} md={4}>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="proj-imgbx">
          <img src={image} />
          <div className="proj-txtx">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
        </div>
      </a>
    </Col>
  );
};
