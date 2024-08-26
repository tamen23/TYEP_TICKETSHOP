import './footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-menu">
                <ul>
                    <li><a href="/">HOME</a></li>
                    <li><a href="/events">EVENEMENTS</a></li>
                    <li><a href="/concerts">CONCERTS</a></li>
                    <li><a href="/contact">CONTACT</a></li>
                    <li><a href="/devenir-partenaire">DEVENIR PARTENAIRE</a></li>
                    <li><a href="/a-propos">À PROPOS</a></li>
                </ul>
            </div>
            <div className="footer-contact">
                <p>Email: <a href="mailto:ticketshop@gmail.com">ticketshop@gmail.com</a></p>
                <p>Tel: <a href="tel:060004545">060004545</a></p>
            </div>
            <div className="footer-social">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024</p>
            </div>
        </footer>
    );
};

export default Footer;
