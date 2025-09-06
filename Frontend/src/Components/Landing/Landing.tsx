// import Navbar from '../Navbar'
import CarouselWithText from '../User/mainContainer'
import AboutSection from '../User/AboutSection'
import ServicesSection from '../User/findFood'
import { FooterWithLogo } from '../UserNav&Footer/Footer'
import { RootState } from '../../Redux/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HandShakeModal from '../Modals/User/HandShakeModal'

const Landing = () => {
    const navigate = useNavigate()
    const user = useSelector((state:RootState)=> state.user)
    const admin = useSelector((state:RootState) => state.admin)
    const userId = useSelector((state:RootState)=>state.user.id)
    const userName = useSelector((state:RootState) => state.userProfile.name)
    const [isHandShakeModalOpen, setIsHandShakeModalOpen] = useState(false)

    // Navigation logic for hotel users
    useEffect(() => {
        if(user.role === 'hotel'){
            navigate('/hotel/landing-page')
        }
    }, [user.role])

    // Navigation logic for admin
    useEffect(() => {
        if(admin._id){
           navigate('/admin')
        }
    }, [admin._id])

    // Welcome modal logic - ONLY show once per user, only for regular users
    useEffect(() => {
        if(userId && user.role === 'user') {
            const welcomeShowModalKey = `welcomeModal_${userId}`;
            const hasShownWelcome = localStorage.getItem(welcomeShowModalKey);
            
            if(!hasShownWelcome) {
                const timer = setTimeout(() => {
                    setIsHandShakeModalOpen(true);
                }, 500);
                
                return () => clearTimeout(timer);
            }
        }
    }, [userId, user.role])

    const closeHandShakeModal = () => {
        setIsHandShakeModalOpen(false);
        
        if(userId) {
            const welcomeShowModalKey = `welcomeModal_${userId}`;
            localStorage.setItem(welcomeShowModalKey, 'true');
        }
    }

    return (
        <div>
            <CarouselWithText />
            <AboutSection />
            <ServicesSection />
            <FooterWithLogo />
            <HandShakeModal
                open={isHandShakeModalOpen}
                onClose={closeHandShakeModal}
                name={userName}
            />
        </div>
    )
}

export default Landing