import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import headerImg from "../assets/img/header-img.svg";
import { useState, useEffect } from "react";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { useTranslation } from "react-i18next";

const toRotate = ["Backend Dev", "Data Analyst", "Fullstack"];

export const Banner = () => {
  const { t } = useTranslation();
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const period = 2000;

  useEffect(() => {
    const tick = () => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];
      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);
      setText(updatedText);

      if (isDeleting) {
        setDelta((prevDelta) => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prevLoopNum) => prevLoopNum + 1);
        setDelta(500);
      }
    };

    const timer = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(timer);
  }, [text, delta, isDeleting, loopNum]);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animated__animated animate__bounce" : ""
                  }
                >
                  <span className="tagline">{t("banner.tagline")}</span>
                  <h1>
                    {t("banner.greeting")} <span className="wrap">{text}</span>
                  </h1>
                  <p>{t("banner.description")}</p>
                  <button
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/lucasdsgomes/",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    {t("banner.button")} <ArrowRightCircle size={25} />
                  </button>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <img src={headerImg} alt="Header Img" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
