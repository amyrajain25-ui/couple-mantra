import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Star, Video, Clock, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';

const therapists: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    credentials: 'PhD, Licensed Marriage Therapist',
    specializations: ['Communication', 'Intimacy', 'Conflict Resolution'],
    rating: 4.9,
    reviews: 156,
    price: 120,
    bio: 'Dr. Sarah Johnson has been helping couples rebuild connection and communication for over 12 years. Her warm, evidence-based approach combines Gottman Method and Emotionally Focused Therapy to create lasting change.',
  },
  '2': {
    id: 2,
    name: 'Dr. Michael Chen',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    credentials: 'PsyD, Certified Gottman Therapist',
    specializations: ['Trust Issues', 'Infidelity Recovery', 'Premarital'],
    rating: 5.0,
    reviews: 203,
    price: 150,
    bio: 'Dr. Michael Chen is an expert in helping couples heal from betrayal, rebuild trust, and restore deep emotional safety through Gottman-based therapies.',
  },
  '3': {
    id: 3,
    name: 'Dr. Priya Sharma',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    credentials: 'LMFT, Emotionally Focused Therapy',
    specializations: ['Emotional Connection', 'Long Distance', 'Cultural Issues'],
    rating: 4.8,
    reviews: 92,
    price: 100,
    bio: 'Dr. Priya Sharma is passionate about helping couples navigate cultural, cross-border, and emotional connection challenges using Emotionally Focused Therapy.',
  },
  '4': {
    id: 4,
    name: 'Dr. James Martinez',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    credentials: 'PhD, LGBTQ+ Affirmative Therapist',
    specializations: ['LGBTQ+ Couples', 'Communication', 'Life Transitions'],
    rating: 4.9,
    reviews: 128,
    price: 130,
    bio: 'Dr. James Martinez is dedicated to supporting LGBTQ+ couples through all stages of relationships, resolving conflict, and easing major life transitions.',
  },
  '5': {
    id: 5,
    name: 'Dr. Emily Roberts',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    credentials: 'LCSW, Trauma-Informed Therapist',
    specializations: ['Trauma', 'Anxiety', 'Parenting Conflicts'],
    rating: 5.0,
    reviews: 187,
    price: 140,
    bio: 'Dr. Emily Roberts helps couples heal from past trauma, manage individual anxiety together, and resolve parenting disagreements constructively.',
  },
  '6': {
    id: 6,
    name: 'Dr. Raj Patel',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    credentials: 'MD, Relationship Psychiatrist',
    specializations: ['Financial Stress', 'Career Balance', 'Blended Families'],
    rating: 4.7,
    reviews: 74,
    price: 110,
    bio: 'Dr. Raj Patel helps couples manage career-related stress, build solid financial alignment, and build thriving structures for blended families.',
  },
};

const availableSlots = {
  '2026-06-09': ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
  '2026-06-10': ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
  '2026-06-11': ['9:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  '2026-06-12': ['11:00 AM', '1:00 PM', '3:00 PM', '6:00 PM'],
  '2026-06-13': ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'],
};

export default function BookingPage() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const therapist = therapists[therapistId || '1'];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'initial' | 'followup'>('initial');
  const [notes, setNotes] = useState('');

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <Header />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Therapist not found</p>
              <Button onClick={() => navigate('/therapists')} className="mt-4">
                Browse Therapists
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const slots = dateKey ? availableSlots[dateKey as keyof typeof availableSlots] || [] : [];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    const stored = localStorage.getItem('tm_booked_sessions');
    const list = stored ? JSON.parse(stored) : [];
    
    const newSession = {
      id: Date.now(),
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistImage: therapist.image,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      price: sessionType === 'initial' ? 150 : therapist.price,
      sessionType: sessionType === 'initial' ? 'Initial Consultation' : 'Follow-up Session'
    };

    list.push(newSession);
    localStorage.setItem('tm_booked_sessions', JSON.stringify(list));

    toast.success('Session booked successfully!', {
      description: `Your session with ${therapist.name} is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <Header />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Therapist Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={therapist.image} alt={therapist.name} />
                    <AvatarFallback>{therapist.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{therapist.name}</CardTitle>
                  <CardDescription>{therapist.credentials}</CardDescription>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{therapist.rating}</span>
                    <span className="text-sm text-gray-500">({therapist.reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specializations.map((spec: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Session Fee</h4>
                  <p className="text-2xl font-bold text-rose-500">${therapist.price}</p>
                  <p className="text-xs text-gray-500">per 60-minute session</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-700">{therapist.bio}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-rose-50">
              <CardHeader>
                <CardTitle className="text-lg">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Secure, HIPAA-compliant video sessions</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Personalized treatment plan</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Email reminders and prep materials</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Easy rescheduling up to 24 hours before</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Book Your Session</CardTitle>
                <CardDescription>
                  Choose a convenient time to meet with {therapist.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="schedule" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="schedule">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Schedule
                    </TabsTrigger>
                    <TabsTrigger value="details">
                      <Video className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="schedule" className="space-y-6">
                    {/* Session Type */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Session Type</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSessionType('initial')}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            sessionType === 'initial'
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-300'
                          }`}
                        >
                          <h4 className="font-semibold mb-1">Initial Consultation</h4>
                          <p className="text-sm text-gray-600">First session (90 min)</p>
                          <p className="text-lg font-bold text-rose-500 mt-2">$150</p>
                        </button>
                        <button
                          onClick={() => setSessionType('followup')}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            sessionType === 'followup'
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-300'
                          }`}
                        >
                          <h4 className="font-semibold mb-1">Follow-up Session</h4>
                          <p className="text-sm text-gray-600">Regular session (60 min)</p>
                          <p className="text-lg font-bold text-rose-500 mt-2">${therapist.price}</p>
                        </button>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                      <div className="flex justify-center border rounded-lg p-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                          className="rounded-md"
                        />
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Available Times for {selectedDate.toLocaleDateString()}
                        </Label>
                        {slots.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {slots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                                  selectedTime === time
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-gray-200 hover:border-rose-300'
                                }`}
                              >
                                <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                                <span className="text-sm font-medium">{time}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">
                            No available slots for this date. Please select another date.
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
                        What would you like to focus on?
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Share any concerns, goals, or topics you'd like to discuss in your session..."
                        className="min-h-[150px]"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This helps your therapist prepare for your session
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Privacy & Confidentiality</h4>
                      <p className="text-sm text-gray-700">
                        All sessions are completely confidential and conducted through secure, HIPAA-compliant video technology. Your information is protected and will never be shared without your consent.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Therapist:</span>
                        <span className="font-medium">{therapist.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Session Type:</span>
                        <span className="font-medium">
                          {sessionType === 'initial' ? 'Initial Consultation' : 'Follow-up Session'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-rose-200">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-lg text-rose-500">
                          ${sessionType === 'initial' ? 150 : therapist.price}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => navigate('/therapists')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-rose-500 hover:bg-rose-600"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
