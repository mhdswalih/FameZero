import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Shield, Star, Send, User, ThumbsUp, Calendar, Upload, ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Navbar from '../UserNav&Footer/Navbar'
import { useParams } from 'react-router-dom'
import { getHotelDetails, ratingandReview } from '../../Api/userApiCalls/profileApi'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'

interface Location {
    type: string;
    coordinates: number[];
    locationName: string;
}

export interface IReview {
    userId: string;
    profilePic: string;
    name: string;
    rating: number;
    comment: string;
    like: number;
    ratingIMG:string;
    createAt: Date;
}
interface HotelDetails {
    name: string;
    email: string;
    idProof: string;
    status: string;
    profilepic: string;
    location: Location;
    city: string;
    phone: string;
    rating: number
}


const RatingAndReview = () => {
    const [selectedRating, setSelectedRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [selectedFile, setSelectedFile] = useState<File>()
    const [previewUrl, setPreviewUrl] = useState<string>('')
    console.log(previewUrl, selectedFile, 'THIS IS FROM RAING REVIEW IMG');

    const user = useSelector((state: RootState) => state.userProfile)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const { hotelId } = useParams()
    const [hotelDetails, setHotelDetails] = useState<HotelDetails>({
        name: "",
        email: "",
        idProof: "",
        status: "",
        profilepic: "",
        
        rating: 0,
        location: { type: "", coordinates: [], locationName: "" },
        city: "",
        phone: "",
    });

    const fetchHotelDetails = async () => {
        try {
            const response = await getHotelDetails(hotelId as string)
            setHotelDetails((prev) => ({
                ...prev,
                name: response.name,
                email: response.email,
                idProof: response.idProof,
                status: response.status,
                profilepic: response.profilepic,
                location: response.location,
                city: response.city,
                phone: response.phone,
                review: response.review,
                rating: response.rating
            }));

            setReviews(response.review)
        } catch (error) {

        }
    }
    const [reviews, setReviews] = useState<IReview[]>([])
    useEffect(() => {
        if (hotelId) {
            fetchHotelDetails()
        }
    }, [hotelId])

    const submitReview = async () => {
        if (selectedRating > 0 && reviewText.trim()) {
            const newReview: IReview = {
                userId: user._id,
                profilePic: user.profilepic,
                name: user.name,
                rating: selectedRating,
                ratingIMG:previewUrl,
                comment: reviewText,
                like: 0,
                createAt: new Date(),
            };

            try {
                // Call API immediately with new review
                await ratingandReview(hotelId as string, [newReview]);

                // Update local state
                setReviews([newReview, ...reviews]);

                setReviewText("");
                setSelectedRating(0);
                setShowReviewForm(false);
                toast.success("Review submitted!");
            } catch (error) {
                toast.error("Failed to submit review");
                console.error(error);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderStars = (rating: any, interactive = false, size = "h-4 w-4") => {
        return [...Array(5)].map((_, index) => (
            <motion.div
                key={index}
                className={interactive ? "cursor-pointer" : ""}
                onClick={() => interactive && setSelectedRating(index + 1)}
                onMouseEnter={() => interactive && setHoverRating(index + 1)}
                onMouseLeave={() => interactive && setHoverRating(0)}
                whileHover={interactive ? { scale: 1.2 } : {}}
                whileTap={interactive ? { scale: 0.9 } : {}}
            >
                <Star
                    className={`${size} ${index < (interactive ? (hoverRating || selectedRating) : rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                        }`}
                />
            </motion.div>
        ))
    }
    return (
        <>
            <div className="fixed top-0 left-0 w-full flex justify-center z-50">
                <div className="w-full max-w-7xl px-4">
                    <Navbar />
                </div>
            </div>
            <div className="pt-20 flex  flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen p-4">
                {/* Hotel Profile Card */}
                <motion.div
                    className="flex bg-white  rounded-xl shadow-lg overflow-hidden max-w-5xl w-full mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hotel Image Section */}
                    <div className="p-6 flex items-center justify-center bg-gray-50">
                        <img
                            src={hotelDetails.profilepic}
                            className="w-20 h-20 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md"
                        />

                    </div>

                    {/* Hotel Info Section */}
                    <div className="p-6 flex-1">
                        {/* Hotel Name with Verified Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{hotelDetails.name}</h3>
                            <motion.div
                                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-700">Verified</span>
                            </motion.div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {renderStars(5)}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">({hotelDetails.rating.toFixed(1)})</span>
                            <span className="text-xs text-gray-500">({reviews.length} reviews)</span>
                        </div>

                        {/* Hotel Trust Badge */}
                        <motion.div
                            className="flex items-center gap-2 mt-3 bg-blue-50 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700">Trusted Restaurant Partner</span>
                        </motion.div>
                    </div>
                </motion.div>


                {/* Reviews Section */}
                <motion.div
                    className="bg-white rounded-xl shadow-lg max-w-5xl w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Header with Add Review Button */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-semibold text-gray-900">Reviews</h4>
                            <motion.button
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Write Review
                            </motion.button>
                        </div>

                        {/* Review Form */}
                        <AnimatePresence>
                            {showReviewForm && (
                                <motion.div
                                    className="bg-gray-50 p-4 rounded-lg"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                        <div className="flex items-center gap-1">
                                            {renderStars(selectedRating, true, "h-6 w-6")}
                                        </div>
                                        <div>
                                            {previewUrl && (
                                                <div className="mt-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Hotel Preview"
                                                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Share your experience..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <motion.button
                                            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                            onClick={submitReview}
                                            disabled={!selectedRating || !reviewText.trim()}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Send className="h-4 w-4" />
                                            Submit
                                        </motion.button>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        <motion.label
                                            htmlFor="fileUpload"
                                            className="cursor-pointer p-2 rounded-b-md border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ImageIcon size={25} className="text-gray-600" />
                                        </motion.label>


                                        <motion.button
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowReviewForm(false)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Reviews List */}
                    <div className="max-h-80 overflow-y-auto">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.userId}
                                className="p-6 border-b border-gray-100 last:border-b-0"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10   flex items-center justify-center">
                                            <img src={review.profilePic} className="h-10 w-10 rounded-full text-white" />
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900">{review.name}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <p>Day of review: {new Date(review.createAt).getDate()}</p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-700 text-sm mb-3 leading-relaxed">{review.comment}</p>

                                {/* Review Actions */}
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ThumbsUp className="h-3 w-3" />
                                        Helpful ({review.like})
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default RatingAndReview