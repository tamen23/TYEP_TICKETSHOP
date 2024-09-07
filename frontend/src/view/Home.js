import Hero from "../components/Hero/Hero";
import Evenements from "../components/Evenements/Evenements";
import Footer from '../components/Footer/Footer'

const Home = () => {
    return (
        <div className="hero-css">
            <Hero/>
            <Evenements/>
            <Footer className="footerPhon"/>
        </div>
    )
}


export default Home;