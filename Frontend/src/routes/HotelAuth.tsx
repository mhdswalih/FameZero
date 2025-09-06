import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelProfilePage from '../Components/Hotel/HotelProfileDetails'
import  Settings  from '../Components/Hotel/Settings'
import HotelFoodSections from '../Components/Hotel/HotelFoodSection'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
                <Route path='/settings' element={<Settings/>} />
                <Route path='/food-section' element={<HotelFoodSections/>} />
            </Routes>
    </>
)

export default HotelAuth