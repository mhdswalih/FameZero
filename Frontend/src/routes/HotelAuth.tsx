import { Routes, Route } from 'react-router-dom'
import HotelSignup from '../Components/Hotel/HotelSignup'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelOTPVerificationPage from '../Components/Hotel/HotelOtp'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/hotel-signup" element={<HotelSignup />} />
                <Route path="/hotel-landing-page" element={<LandingPage />} />
                <Route path="/hotel-otp" element={<HotelOTPVerificationPage />} />
            </Routes>
    </>
)

export default HotelAuth