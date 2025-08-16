import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelProfilePage from '../Components/Hotel/HotelProfileDetails'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
            </Routes>
    </>
)

export default HotelAuth