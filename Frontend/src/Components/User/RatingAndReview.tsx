import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Shield, Star, Send, ThumbsUp, Calendar, ImageIcon, Edit3, X, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Navbar from '../UserNav&Footer/Navbar'
import { useParams } from 'react-router-dom'
import { deleteReviews, editReview, getHotelDetails, likeAndunlike, ratingandReview } from '../../Api/userApiCalls/profileApi'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'
import PreviewModal from '../Modals/User/PreviewModal'

interface Location {
    type: string;
    coordinates: number[];
    locationName: string;
}

export interface ILike {
    _id: string;
    userId: string;
    like: number;
}

export interface IReview {
    _id: string;
    userId: string;
    profilePic: string;
    name: string;
    rating: number;
    comment: string;
    like: ILike[];
    totalLike: number;
    reviweIMG: string;
    createAt: Date;
}

interface HotelDetails {
    _id?: string;
    name: string;
    email: string;
    idProof: string;
    status: string;
    profilepic: string;
    location: Location;
    city: string;
    phone: string;
    rating: number;
    review?: IReview[];
}

const RatingAndReview = () => {
    const [selectedRating, setSelectedRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | undefined>()
    const [previewUrl, setPreviewUrl] = useState<string>('')
    const [reviews, setReviews] = useState<IReview[]>([])
    const [previewModal, setPreviewModal] = useState(false)
    const [previewIMG, setPreviewIMG] = useState('')
    const user = useSelector((state: RootState) => state.userProfile)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showEditReviewForm, setEditReviewForm] = useState(false)
    const [editingReview, setEditingReview] = useState<IReview | null>(null)
    const [editRating, setEditRating] = useState(0)
    const [editReviewText, setEditReviewText] = useState('')
    const [editSelectedFile, setEditSelectedFile] = useState<File | undefined>()
    const [editPreviewUrl, setEditPreviewUrl] = useState<string>('')
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

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return { fullStars, hasHalfStar, emptyStars };
    };

    const fetchHotelDetails = async () => {
        try {
            const response = await getHotelDetails(hotelId as string)
            setHotelDetails((prev) => ({
                ...prev,
                _id: response._id,
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

            setReviews(response.review || [])
        } catch (error) {
            toast.error('Failed to fetch hotel details')
        }
    }

    const handleEditReview = async (reviewId: string) => {
        const reviewToEdit = reviews.find(review => review._id === reviewId);
        if (reviewToEdit) {
            setEditingReview(reviewToEdit);
            setEditRating(reviewToEdit.rating);
            setEditReviewText(reviewToEdit.comment);
            setEditPreviewUrl(reviewToEdit.reviweIMG || '');
            setEditReviewForm(true);
        }
    };

    const submitEditReview = async () => {
        if (!editingReview) return;

        if (editRating > 0 && editReviewText.trim()) {
            try {
                const updatedReview = {
                    ...editingReview,
                    rating: editRating,
                    comment: editReviewText,
                };

                await editReview(editingReview._id, hotelId as string, [updatedReview], editSelectedFile);

                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review._id === editingReview._id ? updatedReview : review
                    )
                );
                setEditReviewForm(false);
                setEditingReview(null);
                setEditRating(0);
                setEditReviewText('');
                setEditSelectedFile(undefined);
                setEditPreviewUrl('');
                toast.success("Review updated successfully!");
            } catch (error) {
                toast.error("Failed to update review");
                console.error(error);
            }
        }
    };

    const cancelEdit = () => {
        setEditReviewForm(false);
        setEditingReview(null);
        setEditRating(0);
        setEditReviewText('');
        setEditSelectedFile(undefined);
        setEditPreviewUrl('');
    };
    const handleDeleteReview = async(reviewId:string) => {
        try {
            if (confirm("Are you sure you want to delete this review?")){
                await deleteReviews(reviewId , hotelId as string)
                setReviews(preReviews => preReviews.filter(review => review._id !== reviewId))
                toast.success('Review deleted successfully')
            }
            
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if (hotelId) {
            fetchHotelDetails()
        }
    }, [hotelId])

    const submitReview = async () => {
        if (selectedRating > 0 && reviewText.trim()) {
            const newReview: IReview = {
                _id: '',
                userId: user._id,
                profilePic: user.profilepic,
                name: user.name,
                rating: selectedRating,
                reviweIMG: '',
                comment: reviewText,
                like: [],
                totalLike: 0,
                createAt: new Date(),
            };
            try {
                    await ratingandReview(hotelId as string, [newReview], selectedFile);
                setReviews([newReview, ...reviews]);

                setReviewText("");
                setSelectedRating(0);
                setShowReviewForm(false);
                toast.success("Review submitted!");
                setPreviewUrl('')
            } catch (error) {
                toast.error("Failed to submit review");
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

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setEditPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleViewImg = async (ImageId: string) => {
        const selectedImage = reviews.find((r) => r._id === ImageId)
        if (selectedImage) {
            setPreviewIMG(selectedImage.reviweIMG)
        }
    }

    const handleLikeAndUnlike = async (reviewId: string) => {
        try {
            await likeAndunlike(reviewId, user._id, hotelId as string)
            toast.success('👍  Liked')
        } catch (error) {
        }
    }

    const userProfileView = async (profileId: string) => {
        const userIMG = reviews.find(r => r._id === profileId)
        if (userIMG) {
            setPreviewIMG(userIMG.profilePic)
        }
    }

    const renderInteractiveStars = (rating: number, interactive = false, size = "h-4 w-4", onRatingChange?: (rating: number) => void) => {
        return [...Array(5)].map((_, index) => (
            <motion.div
                key={index}
                className={interactive ? "cursor-pointer" : ""}
                onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
                onMouseEnter={() => interactive && setHoverRating(index + 1)}
                onMouseLeave={() => interactive && setHoverRating(0)}
                whileHover={interactive ? { scale: 1.2 } : {}}
                whileTap={interactive ? { scale: 0.9 } : {}}
            >
                <Star
                    className={`${size} ${index < (interactive ? (hoverRating || (onRatingChange === setEditRating ? editRating : selectedRating)) : rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                        }`}
                />
            </motion.div>
        ))
    }

    const { fullStars, hasHalfStar, emptyStars } = renderStars(hotelDetails.rating);

    return (
        <>
            <div className="fixed top-0 left-0 w-full flex justify-center z-50">
                <div className="w-full max-w-7xl px-4">
                    <Navbar />
                </div>
            </div>
            <div className="pt-20 flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen p-4">
                {/* Hotel Profile Card */}
                <motion.div
                    className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl w-full mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hotel Image Section */}
                    <div className="p-6 flex items-center justify-center bg-gray-50">
                        <img
                            src={hotelDetails.profilepic}
                            alt={hotelDetails.name}
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
                                {[...Array(fullStars)].map((_, idx) => (
                                    <motion.svg
                                        key={`full-${idx}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ duration: 0.2, type: "spring" }}
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </motion.svg>
                                ))}

                                {hasHalfStar && (
                                    <motion.svg
                                        key="half"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5"
                                        viewBox="0 0 20 20"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ duration: 0.2, type: "spring" }}
                                    >
                                        <defs>
                                            <linearGradient id={`half-fill-${hotelDetails.rating}`}>
                                                <stop offset="50%" stopColor="#FBBF24" />
                                                <stop offset="50%" stopColor="#D1D5DB" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            fill={`url(#half-fill-${hotelDetails.rating})`}
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </motion.svg>
                                )}

                                {[...Array(emptyStars)].map((_, idx) => (
                                    <motion.svg
                                        key={`empty-${idx}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300"
                                        viewBox="0 0 20 20"
                                        fill="CurrentColor"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ duration: 0.2, type: "spring" }}
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </motion.svg>
                                ))}
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
                                            {renderInteractiveStars(selectedRating, true, "h-6 w-6", setSelectedRating)}
                                        </div>
                                        <div>
                                            {previewUrl && (
                                                <div className="mt-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Review Preview"
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

                        {/* Edit Review Form */}
                        <AnimatePresence>
                            {showEditReviewForm && editingReview && (
                                <motion.div
                                    className="bg-gray-50 p-4 rounded-lg mt-4  "
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-lg font-semibold text-orange-500 flex items-center gap-2">
                                            <Edit3 className="h-5 w-5" />
                                            Edit Your Review
                                        </h5>
                                        <motion.button
                                            onClick={cancelEdit}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.button>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                        <div className="flex items-center gap-1">
                                            {renderInteractiveStars(editRating, true, "h-6 w-6", setEditRating)}
                                        </div>
                                        <div>
                                            {editPreviewUrl && (
                                                <div className="mt-2">
                                                    <img
                                                        src={editPreviewUrl}
                                                        alt="Review Preview"
                                                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Share your experience..."
                                            value={editReviewText}
                                            onChange={(e) => setEditReviewText(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <motion.button
                                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                                            onClick={submitEditReview}
                                            disabled={!editRating || !editReviewText.trim()}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Send className="h-4 w-4" />
                                            Update Review
                                        </motion.button>
                                        <input
                                            type="file"
                                            id="editFileUpload"
                                            className="hidden"
                                            onChange={handleEditFileChange}
                                        />

                                        <motion.label
                                            htmlFor="editFileUpload"
                                            className="cursor-pointer p-2 rounded-b-md border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ImageIcon size={25} className="text-gray-600" />
                                        </motion.label>

                                        <motion.button
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={cancelEdit}
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
                    <div className="max-h-96 overflow-y-auto">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        {/* User Avatar */}
                                        <div className="flex-shrink-0">
                                            <img
                                                onClick={() => {
                                                    userProfileView(review._id);
                                                    setPreviewModal(true);
                                                }}
                                                src={review.profilePic}
                                                className="h-12 w-12 rounded-full border-2 border-orange-200 object-cover cursor-pointer"
                                                alt={review.name}
                                            />
                                        </div>

                                        {/* User Info and Rating */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold text-gray-900 text-lg">{review.name}</h5>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(review.createAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Rating Stars */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    {renderInteractiveStars(review.rating)}
                                                </div>
                                                <span className="text-sm font-medium text-amber-600">
                                                    {review.rating.toFixed(1)}
                                                </span>
                                            </div>

                                            {/* Review Image - if exists */}
                                            {review.reviweIMG && (
                                                <div className="mb-3">
                                                    <img
                                                        onClick={() => {
                                                            handleViewImg(review._id);
                                                            setPreviewModal(true);
                                                        }}
                                                        src={review.reviweIMG}
                                                        alt="Review attachment"
                                                        className="h-32 w-32 object-cover rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <div className="mb-4">
                                    <p className="text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400">
                                        {review.comment}
                                    </p>
                                </div>

                                {/* Review Actions */}
                                <div className="flex items-center justify-between">
                                    <motion.button
                                        onClick={() => handleLikeAndUnlike(review._id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>Helpful ({review.totalLike})</span>
                                    </motion.button>

                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        {review.userId === user._id && (
                                            <>
                                            <button 
                                                onClick={() => handleEditReview(review._id)} 
                                                className="hover:text-orange-500 transition-colors flex items-center gap-1"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                Edit
                                            </button>
                                        <button onClick={() => handleDeleteReview(review._id)} className="hover:text-red-500 transition-colors flex items-center gap-1"><Trash2 className='h-4 w-4' />Delete</button>
                                        </>
                                        )}
                                       
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <PreviewModal
                        previewImg={previewIMG}
                        onClose={() => setPreviewModal(false)}
                        open={previewModal}
                    />
                </motion.div>
            </div>
        </>
    )
}

export default RatingAndReview