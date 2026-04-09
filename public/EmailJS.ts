declare const emailjs: any;

emailjs.init("OLlfkDqoVQTLkMaX0");

const contactForm = document.getElementById("contact-form") as HTMLFormElement;

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs
        .sendForm("service_fix1jce", "template_qrxob25", this)
        .then(() => {
            alert("Message sent!");
            this.reset();
        })
        .catch((error: any) => {
            alert("Something went wrong. Please try again.");
            console.error(error);
        });
});
