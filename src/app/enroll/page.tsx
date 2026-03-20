"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCourses, Course } from "@/hooks/useCourses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumButton from "@/components/PremiumButton";
import TextReveal from "@/components/TextReveal";
import { Check, Calendar, Clock, User, ChevronRight, ArrowLeft, GraduationCap } from "lucide-react";

export default function EnrollPage() {
    const { courses, loading, error } = useCourses();
    const [step, setStep] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [enrollmentType, setEnrollmentType] = useState<'trial' | 'full' | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        setStep(1.5); // New step for choosing type
    };

    const handleTypeSelect = (type: 'trial' | 'full') => {
        setEnrollmentType(type);
        if (type === 'trial') {
            setStep(2);
        } else {
            setStep(3); // Skip to review for full course
        }
    };

    const handleSlotSelect = (slot: any) => {
        setSelectedSlot(slot);
        setStep(3);
    };

    const confirmBooking = async () => {
        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to proceed");
                window.location.href = "/signin";
                return;
            }

            if (enrollmentType === 'trial') {
                const res = await fetch('http://localhost:5000/api/public/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        courseId: selectedCourse?._id,
                        slotDate: selectedSlot.date,
                        slotTime: selectedSlot.time
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setBookingSuccess(true);
                    setStep(4);
                } else {
                    alert(data.message || "Booking failed");
                }
            } else {
                // Full Course Enrollment -> Create Order
                const res = await fetch('http://localhost:5000/api/public/payments/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ courseId: selectedCourse?._id })
                });
                const data = await res.json();
                if (data.success) {
                    setPaymentData(data.data);
                    // In a real app, we'd trigger Razorpay here. 
                    // For now, we'll simulate success for the demo as requested.
                    setBookingSuccess(true);
                    setStep(4);
                } else {
                    alert(data.message || "Payment initiation failed");
                }
            }
        } catch (err) {
            alert("An error occurred");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-4"
                        >
                            Step {step} of 4
                        </motion.p>
                        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
                            {step === 1 && <TextReveal text="Select Your Path" />}
                            {step === 1.5 && <TextReveal text="Choose Enrollment" />}
                            {step === 2 && <TextReveal text="Pick a Schedule" />}
                            {step === 3 && <TextReveal text="Review & Confirm" />}
                            {step === 4 && <TextReveal text="Transaction Complete" />}
                        </h1>
                    </header>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {loading ? (
                                    <p>Loading courses...</p>
                                ) : (
                                    courses.map((course) => (
                                        <div 
                                            key={course._id}
                                            onClick={() => handleCourseSelect(course)}
                                            className="group bg-white/5 border border-white/10 p-8 rounded-3xl cursor-pointer hover:bg-white/10 transition-all hover:border-[#a8e03e]/30"
                                        >
                                            <p className="text-[#a8e03e] text-xs font-bold uppercase tracking-widest mb-4">{course.category}</p>
                                            <h3 className="text-2xl font-bold mb-4">{course.title}</h3>
                                            <p className="text-gray-400 text-sm line-clamp-3 mb-8">{course.description}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <span className="text-xl font-bold">₹{course.price}</span>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#a8e03e] group-hover:text-black transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {step === 1.5 && (
                            <motion.div
                                key="step1.5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                            >
                                <div 
                                    onClick={() => handleTypeSelect('trial')}
                                    className="group bg-white/5 border border-white/10 p-10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all hover:border-[#a8e03e]/30 text-center"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-[#a8e03e]/10 flex items-center justify-center text-[#a8e03e] mx-auto mb-6">
                                        <Clock size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Book Trial Slot</h3>
                                    <p className="text-gray-400 mb-8 text-lg">Reserve a specific time slot for a trial session or consultation.</p>
                                    <PremiumButton text="Choose Slot" onClick={() => handleTypeSelect('trial')} />
                                </div>

                                <div 
                                    onClick={() => handleTypeSelect('full')}
                                    className="group bg-white/5 border border-white/10 p-10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all hover:border-[#a8e03e]/30 text-center"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-[#a8e03e]/10 flex items-center justify-center text-[#a8e03e] mx-auto mb-6">
                                        <GraduationCap size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Full Enrollment</h3>
                                    <p className="text-gray-400 mb-8 text-lg">Unlock the complete course experience and resources immediately.</p>
                                    <PremiumButton text="Enroll Now" onClick={() => handleTypeSelect('full')} />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <button 
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back to Courses
                                </button>
                                
                                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-[#a8e03e]/10 flex items-center justify-center text-[#a8e03e]">
                                            <Calendar size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">{selectedCourse?.title}</h3>
                                            <p className="text-gray-400">Select one of the available time slots below</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Mocking slots if not present in backend */}
                                        {(selectedCourse?.availableSlots && selectedCourse.availableSlots.length > 0 ? selectedCourse.availableSlots : [
                                            { date: "2026-03-20", time: "10:00 AM", capacity: 20, booked: 5 },
                                            { date: "2026-03-20", time: "02:00 PM", capacity: 20, booked: 12 },
                                            { date: "2026-03-21", time: "11:00 AM", capacity: 20, booked: 18 },
                                            { date: "2026-03-22", time: "04:00 PM", capacity: 20, booked: 2 },
                                        ]).map((slot, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => handleSlotSelect(slot)}
                                                className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-[#a8e03e] hover:bg-[#a8e03e]/5 transition-all group"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-lg font-bold">{slot.time}</span>
                                                    <Clock size={18} className="text-gray-500 group-hover:text-[#a8e03e]" />
                                                </div>
                                                <p className="text-gray-400 text-sm mb-1">{new Date(slot.date).toLocaleDateString()}</p>
                                                <p className="text-xs text-[#a8e03e]">{slot.capacity - slot.booked} seats left</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl"
                            >
                                <button 
                                    onClick={() => setStep(enrollmentType === 'full' ? 1.5 : 2)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                                >
                                    <ArrowLeft size={16} /> Back to {enrollmentType === 'full' ? "Choice" : "Slots"}
                                </button>

                                <div className="bg-white/5 border border-white/10 p-10 rounded-3xl space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[#a8e03e] font-bold uppercase tracking-widest text-xs">Summary</p>
                                        <h3 className="text-3xl font-bold">{selectedCourse?.title}</h3>
                                        <div className="flex flex-wrap gap-6 pt-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={18} className="text-[#a8e03e]" />
                                                <span>{enrollmentType === 'full' ? 'Lifetime Access' : new Date(selectedSlot?.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={18} className="text-[#a8e03e]" />
                                                <span>{enrollmentType === 'full' ? 'Self-Paced / Flexible' : selectedSlot?.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <User size={18} className="text-[#a8e03e]" />
                                                <span>{selectedCourse?.instructor}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-8 flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-1">Total Fee</p>
                                            <p className="text-4xl font-bold">₹{selectedCourse?.price}</p>
                                        </div>
                                        <PremiumButton 
                                            text={bookingLoading ? "Processing..." : (enrollmentType === 'full' ? "Pay & Enroll" : "Confirm Booking")} 
                                            onClick={confirmBooking} 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl max-w-2xl mx-auto"
                            >
                                <div className="w-24 h-24 bg-[#a8e03e] text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(168,224,62,0.3)]">
                                    <Check size={48} />
                                </div>
                                <h3 className="text-4xl font-bold mb-4 uppercase tracking-tighter">Success!</h3>
                                <p className="text-gray-400 text-lg mb-12 px-6">
                                    {enrollmentType === 'full' 
                                        ? `You have successfully enrolled in ${selectedCourse?.title}.` 
                                        : `Your slot for ${selectedCourse?.title} has been reserved.`}
                                    <br />
                                    We've sent a confirmation email with all the details.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
                                    <PremiumButton text="Go to Dashboard" onClick={() => window.location.href = "/profile"} />
                                    <PremiumButton text="Browse More Courses" variant="secondary" onClick={() => setStep(1)} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />
        </main>
    );
}
