// import Navbar from '../Navbar'
import CarouselWithText from '../User/mainContainer'
import AboutSection from '../User/AboutSection'
import ServicesSection from '../User/findFood'
import { FooterWithLogo } from '../UserNav&Footer/Footer'
import { RootState } from '../../Redux/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
// import ProfileSheet from '../ui/sheet'

const Landing = () => {
    const navigate = useNavigate()
    const user = useSelector((state:RootState)=> state.user)
    useEffect(()=>{
        if(user.role === 'hotel'){
            navigate('/hotel/landing-page')
        }else if(user.role === 'user'){
            navigate('/')
        }
    },[user])
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