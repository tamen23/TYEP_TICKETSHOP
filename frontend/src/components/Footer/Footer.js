import './footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>Company Info</h4>
                    <ul>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/tickets">Tickets</a></li>
                        <li><a href="/become-a-ticket-sales-partner">Become a Ticket Sales Partner</a></li>
                        <li><a href="/contact-us-and-pickup-address">Contact Us and Pickup Address</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Security & Privacy</h4>
                    <ul>
                        <li><a href="/purchase-policy">Purchase Policy</a></li>
                        <li><a href="/security-policy">Security Policy</a></li>
                        <li><a href="/terms-of-use">Terms of Use</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024</p>
            </div>
        </footer>
    );
};

export default Footer;
