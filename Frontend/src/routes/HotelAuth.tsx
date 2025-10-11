import { Routes, Route } from 'react-router-dom'
import LandingPage from '../Components/Hotel/LandingPage'
import HotelProfilePage from '../Components/Hotel/HotelProfileDetails'
import  Settings  from '../Components/Hotel/Settings'
import HotelFoodSections from '../Components/Hotel/HotelFoodSection'
import OrderList from '../Components/Hotel/OrderList'
import AddFood from '../Components/Hotel/AddFood'

const HotelAuth = () => (
    <>
            <Routes>
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path='/food-section' element={<HotelFoodSections/>} />
                <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
                <Route path='/settings' element={<Settings/>} />
                <Route path='/order-page' element={<OrderList />} />
                <Route path='/add-food' element={<AddFood />} />
            </Routes>
    </>
)

export default HotelAuth