import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelProfilePage from '../Components/Hotel/HotelProfileDetails'
import  Settings  from '../Components/Hotel/Settings'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
                <Route path='/settings' element={<Settings/>} />
            </Routes>
    </>
)

export default HotelAuth