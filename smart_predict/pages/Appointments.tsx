import React, { useEffect, useState } from 'react';

const RAZORPAY_LINK =
  'https://pages.razorpay.com/pl_ExvXqNgFYRNZtS'; // <-- your Razorpay payment link

const Appointments: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 🔹 Detect Razorpay redirect after payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('payment') === 'success') {
      const transaction = {
        id: 'RAZORPAY_' + Date.now(),
        doctor: selectedDoctor?.name || 'Doctor',
        time: selectedTime || 'N/A',
        amount: 50,
        status: 'SUCCESS',
        gateway: 'Razorpay (Demo)',
        date: new Date().toISOString(),
      };

      const prev = JSON.parse(localStorage.getItem('transactions') || '[]');
      localStorage.setItem('transactions', JSON.stringify([...prev, transaction]));

      setPaymentSuccess(true);

      // clean URL
      window.history.replaceState({}, document.title, '/#/appointments');
    }
  }, []);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      specialty: 'Endocrinologist',
      rating: 4.9,
      reviews: 120,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 95,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      specialty: 'Neurologist',
      rating: 5.0,
      reviews: 210,
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: 4,
      name: 'Dr. Robert Baker',
      specialty: 'Nephrologist',
      rating: 4.7,
      reviews: 80,
      image: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
  ];

  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        {/* ✅ SUCCESS SCREEN */}
        {paymentSuccess && (
          <div className="bg-white rounded-3xl p-12 shadow-xl border text-center">
            <div className="text-green-500 text-6xl mb-4">✔</div>
            <h2 className="text-3xl font-bold mb-2">Payment Successful</h2>
            <p className="text-slate-500 mb-6">
              Your appointment has been confirmed successfully.
            </p>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="bg-[#1977cc] text-white px-6 py-3 rounded-xl font-bold"
            >
              Book Another Appointment
            </button>
          </div>
        )}

        {!paymentSuccess && (
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Book an Appointment</h1>
              <p className="text-slate-500">
                Select a specialist and preferred time based on your AI diagnosis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-8">
                {/* Doctors */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border">
                  <h3 className="text-xl font-bold mb-6">Select Specialist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                          selectedDoctor?.id === doc.id
                            ? 'border-[#1977cc] bg-blue-50'
                            : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <img src={doc.image} className="w-14 h-14 rounded-full" />
                          <div>
                            <h4 className="font-bold">{doc.name}</h4>
                            <p className="text-xs text-slate-500">{doc.specialty}</p>
                            <p className="text-xs">
                              ⭐ {doc.rating} ({doc.reviews})
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border">
                  <h3 className="text-xl font-bold mb-6">Available Time Slots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl font-semibold border ${
                          selectedTime === time
                            ? 'bg-[#1977cc] text-white'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SUMMARY */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border h-fit">
                <h3 className="text-xl font-bold mb-6">Appointment Summary</h3>

                {selectedDoctor && (
                  <p className="mb-2">
                    <strong>Doctor:</strong> {selectedDoctor.name}
                  </p>
                )}
                {selectedTime && (
                  <p className="mb-2">
                    <strong>Time:</strong> {selectedTime}
                  </p>
                )}

                <p className="mb-6">
                  <strong>Fee:</strong> $50
                </p>

                <button
                  disabled={!selectedDoctor || !selectedTime}
                  onClick={() => {
                    window.location.href =
                      `${RAZORPAY_LINK}?redirect=http://localhost:3000/#/appointments?payment=success`;
                  }}
                  className="w-full bg-[#2d72f8] text-white py-4 rounded-xl font-bold disabled:opacity-50"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;
