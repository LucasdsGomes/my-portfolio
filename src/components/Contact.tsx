import { useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";
import emailjs from '@emailjs/browser';

export const Contact = () => {
    interface FormUpdateFields {
        category: string;
        value: string;
    }

    const formInitialDetails = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    };

    const [formDetails, setFormDetails] = useState(formInitialDetails);
    const [buttonText, setButtonText] = useState('Send');
    const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
    const form = useRef<HTMLFormElement | null>(null); 

    const onFormUpdate = ({ category, value }: FormUpdateFields) => {
        setFormDetails({ ...formDetails, [category]: value });
    };

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setButtonText("Sending...");

        if (form.current) {
            emailjs
                .sendForm(process.env.REACT_APP_SERVICE_ID!, process.env.REACT_APP_TEMPLATE_ID!, form.current, {
                    publicKey: process.env.REACT_APP_API_KEY
                })
                .then(
                    () => {
                        setStatus({ success: true, message: "Message sent successfully!" });
                        console.log("message sent")
                        setFormDetails(formInitialDetails); 
                    },
                    (error) => {
                        console.error('FAILED...', error.text);
                        console.log("message not sent")
                        
                        setStatus({ success: false, message: "Something went wrong. Please try again later." });
                    },
                )
                .finally(() => {
                    setButtonText("Send"); 
                });
        }
    };

    return (
        <section className="contact" id="connect">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <img src={contactImg} alt="Contact Me" />
                    </Col>
                    <Col md={6}>
                        <h2>Get in Touch</h2>
                        <form ref={form} onSubmit={sendEmail}>
                            <Row>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="text"
                                        value={formDetails.firstName}
                                        name="user_name"
                                        placeholder="First Name"
                                        onChange={(e) => onFormUpdate({ category: 'firstName', value: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="text"
                                        value={formDetails.lastName}
                                        name="user_last_name"
                                        placeholder="Last Name"
                                        onChange={(e) => onFormUpdate({ category: 'lastName', value: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="email"
                                        value={formDetails.email}
                                        name="user_email"
                                        placeholder="Email Address"
                                        onChange={(e) => onFormUpdate({ category: 'email', value: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col sm={6} className="px-1">
                                    <input
                                        type="tel"
                                        value={formDetails.phone}
                                        name="user_phone"
                                        placeholder="Phone No."
                                        onChange={(e) => onFormUpdate({ category: 'phone', value: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col className="px-1">
                                    <textarea
                                        rows={6}
                                        value={formDetails.message}
                                        name="message"
                                        placeholder="Message"
                                        onChange={(e) => onFormUpdate({ category: 'message', value: e.target.value })}
                                        required
                                    />
                                    <button type="submit"><span>{buttonText}</span></button>
                                </Col>
                                {status.message && (
                                    <Col>
                                        <p className={status.success === false ? "danger" : "success"}>{status.message}</p>
                                    </Col>
                                )}
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
