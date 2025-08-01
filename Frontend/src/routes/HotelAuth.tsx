import { Routes, Route } from 'react-router-dom'
import HotelSignup from '../Components/Hotel/HotelSignup'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelOTPVerificationPage from '../Components/Hotel/HotelOtp'
import HotelProfilePage from '../Components/Hotel/HotelProfileDetails'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/hotel-signup" element={<HotelSignup />} />
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path="/hotel-otp" element={<HotelOTPVerificationPage />} />
                <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
            </Routes>
    </>
)

export default HotelAuth