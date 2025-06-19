// import Navbar from '../Navbar'
import CarouselWithText from '../User/mainContainer'
import AboutSection from '../User/AboutSection'
import ServicesSection from '../User/findFood'
import { FooterWithLogo } from '../Footer'
// import ProfileSheet from '../ui/sheet'

const Landing = () => {
    return (
        <div>
            {/* <Navbar  /> */}
            <CarouselWithText />
            <AboutSection />
            <ServicesSection />
            <FooterWithLogo />
        </div>
    )
}

export default Landing