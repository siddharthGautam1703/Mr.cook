const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = 5000;

// Middleware configurations
app.use(cors());
app.use(express.json());

// Crucial: Tell Express to host your static frontend assets out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to local MongoDB instance with resilient MongoMemoryServer fallback
async function connectDB() {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homechef';
    try {
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
        console.log('✅ Securely connected to MongoDB instance.');
    } catch (err) {
        console.warn('⚠️ Local MongoDB not found on port 27017. Starting MongoMemoryServer fallback...');
        try {
            const mongod = await MongoMemoryServer.create({
                instance: { port: 27017, dbName: 'homechef' }
            });
            await mongoose.connect(mongod.getUri());
            console.log('✅ Connected to MongoMemoryServer instance!');
        } catch (memErr) {
            const mongod = await MongoMemoryServer.create({ instance: { dbName: 'homechef' } });
            await mongoose.connect(mongod.getUri());
            console.log('✅ Connected to MongoMemoryServer instance!');
        }
    }
    await seedIfEmpty();
}

async function seedIfEmpty() {
    try {
        const count = await Cook.countDocuments();
        if (count === 0) {
            console.log('🌱 Seeding initial cook data into database...');
            await Cook.insertMany([
                {
                    name: "Chef Anita V.", specialty: "Awadhi Cuisine", experience: 12, locality: "Hazratganj", rate: 200, rating: 4.8,
                    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120",
                    dishes: [
                        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400&h=300"
                    ],
                    location: { type: "Point", coordinates: [80.9462, 26.8467] }
                },
                {
                    name: "Chef Rohan S.", specialty: "Healthy North Indian", experience: 5, locality: "Gomti Nagar", rate: 250, rating: 4.9,
                    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=120&h=120",
                    dishes: [
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400&h=300"
                    ],
                    location: { type: "Point", coordinates: [80.9992, 26.8611] }
                },
                {
                    name: "Chef Sangeeta R.", specialty: "Vegetarian Specialist", experience: 8, locality: "Indira Nagar", rate: 180, rating: 4.9,
                    avatar: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=120&h=120",
                    dishes: [
                        "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1605180348426-f314eb166a1b?auto=format&fit=crop&q=80&w=400&h=300"
                    ],
                    location: { type: "Point", coordinates: [80.9850, 26.8800] }
                },
                {
                    name: "Chef Kabir M.", specialty: "Mughlai & Street Food", experience: 10, locality: "Aliganj", rate: 300, rating: 4.7,
                    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120",
                    dishes: [
                        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=400&h=300", 
                        "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400&h=300"
                    ],
                    location: { type: "Point", coordinates: [80.9382, 26.8917] }
                }
            ]);
            console.log('✅ Initial cooks successfully seeded!');
        }
    } catch (err) {
        console.error('Auto-seeding error:', err);
    }
}
connectDB();

// Build database structural model for Cooks
const cookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    locality: { type: String, required: true },
    rate: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    avatar: { type: String },
    dishes: [String],
    fssaiNumber: { type: String, default: "FSSAI-11524001002345" },
    isVerified: { type: Boolean, default: true },
    idProofUrl: { type: String },
    hygieneScore: { type: Number, default: 5.0 },
    kitchenPhotos: [String],
    subscriptionPlans: {
        weekly3Days: { type: Number, default: 2200 },
        weekly6Days: { type: Number, default: 4200 },
        batchPrepRate: { type: Number, default: 450 }
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // format: [longitude, latitude]
    }
});

// Configure Geospatial indexing to calculate coordinate boundaries
cookSchema.index({ location: '2dsphere' });
const Cook = mongoose.model('Cook', cookSchema);

// Build database structural model for Bookings
const bookingSchema = new mongoose.Schema({
    cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Build database structural model for Conversations and Messages
const conversationSchema = new mongoose.Schema({
    cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    proposedDate: { type: String, required: true },
    proposedTime: { type: String, required: true },
    agreedPrice: { type: Number },
    bookingType: { type: String, default: 'One-Time Meal Service' },
    instructions: { type: String },
    otpCode: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
    status: { type: String, default: 'Negotiating' }, // 'Negotiating', 'Agreed', 'In Progress', 'Completed'
    createdAt: { type: Date, default: Date.now }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: String, enum: ['customer', 'chef', 'system'], required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'checklist'], default: 'text' },
    checklist: [{ item: String, supplier: String, checked: Boolean }],
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Build database structural model for Users (Customers)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    locality: { type: String, default: 'Hazratganj' },
    role: { type: String, enum: ['customer', 'cook'], default: 'customer' },
    avatar: { type: String },
    authMethod: { type: String, enum: ['email', 'google', 'phone_otp'], default: 'email' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// In-memory OTP storage for phone verification (phone -> { otp, expiresAt })
const otpStore = new Map();

// Build database structural model for Dish-Specific Reviews & Taste Tags
const reviewSchema = new mongoose.Schema({
    cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    dishPhotos: [String],
    tasteTags: [String],
    createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// API Route to filter cooks nearby with optional search filtering
app.get('/api/cooks/nearby', async (req, res) => {
    try {
        // Defaults coordinates configured precisely for central Lucknow area
        const lng = parseFloat(req.query.lng) || 80.9462;
        const lat = parseFloat(req.query.lat) || 26.8467;
        const maxDistanceKm = parseFloat(req.query.distance) || 15;
        const searchQuery = req.query.search || req.query.cuisine;

        const filter = {
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: maxDistanceKm * 1000 // Convert km to meters
                }
            }
        };

        if (searchQuery && searchQuery.trim() !== '') {
            const regex = new RegExp(searchQuery.trim(), 'i');
            filter.$or = [
                { specialty: regex },
                { name: regex },
                { locality: regex },
                { dishes: regex }
            ];
        }

        const nearbyCooks = await Cook.find(filter);
        res.status(200).json(nearbyCooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'System location query exception.' });
    }
});

// API Route to register a new Customer
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password, locality } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        const user = new User({
            name,
            email: email.toLowerCase().trim(),
            phone: phone || '',
            password,
            locality: locality || 'Hazratganj',
            role: 'customer'
        });
        await user.save();

        res.status(201).json({
            message: 'Registration successful!',
            user: { _id: user._id, name: user.name, email: user.email, locality: user.locality, role: user.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// API Route to login Customer or Cook
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const cleanEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            // Mock login fallback if user not registered yet
            const mockName = cleanEmail.split('@')[0] || 'User';
            const newUser = new User({
                name: mockName,
                email: cleanEmail,
                password,
                role: role || 'customer'
            });
            await newUser.save();
            return res.status(200).json({
                message: 'Login successful!',
                user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            user: { _id: user._id, name: user.name, email: user.email, locality: user.locality, role: user.role, avatar: user.avatar, authMethod: user.authMethod }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed.' });
    }
});

// API Route to send SMS OTP
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        let { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required.' });
        }

        phone = phone.trim();
        if (!phone.startsWith('+')) {
            phone = '+91' + phone.replace(/[^0-9]/g, '');
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

        otpStore.set(phone, { otp: otpCode, expiresAt });

        console.log(`\n==================================================`);
        console.log(`🔑 [SMS OTP DEBUG]: Code for ${phone} is ${otpCode}`);
        console.log(`==================================================\n`);

        res.status(200).json({
            message: `OTP sent to ${phone}`,
            phone,
            debugCode: otpCode // returned for frictionless local testing
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// API Route to verify SMS OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        let { phone, otp, name, locality } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP code are required.' });
        }

        phone = phone.trim();
        if (!phone.startsWith('+')) {
            phone = '+91' + phone.replace(/[^0-9]/g, '');
        }

        const record = otpStore.get(phone);
        if (!record) {
            return res.status(400).json({ error: 'No OTP requested for this phone number. Please click Send OTP.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(phone);
            return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
        }

        if (record.otp !== otp.trim()) {
            return res.status(400).json({ error: 'Invalid 6-digit OTP code.' });
        }

        // Clear verified OTP
        otpStore.delete(phone);

        // Find or create customer
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({
                name: name || `Customer (${phone.slice(-4)})`,
                phone,
                locality: locality || 'Gomti Nagar',
                authMethod: 'phone_otp',
                role: 'customer'
            });
            await user.save();
        }

        res.status(200).json({
            message: 'OTP verified successfully!',
            user: { _id: user._id, name: user.name, phone: user.phone, locality: user.locality, role: user.role, authMethod: 'phone_otp' }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
});

// API Route for Google Social Authentication
app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Google email is required.' });
        }

        const cleanEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: cleanEmail });

        if (!user) {
            user = new User({
                name: name || cleanEmail.split('@')[0],
                email: cleanEmail,
                avatar: avatar || '',
                authMethod: 'google',
                role: 'customer',
                locality: 'Hazratganj'
            });
            await user.save();
        } else if (avatar && !user.avatar) {
            user.avatar = avatar;
            await user.save();
        }

        res.status(200).json({
            message: 'Google authentication successful!',
            user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, locality: user.locality, role: user.role, authMethod: 'google' }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Google authentication failed.' });
    }
});

// API Route to create a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { cookId, customerName, customerPhone, address, date, timeSlot } = req.body;

        if (!cookId || !customerName || !customerPhone || !address || !date || !timeSlot) {
            return res.status(400).json({ error: 'All booking fields are required.' });
        }

        const newBooking = new Booking({
            cookId,
            customerName,
            customerPhone,
            address,
            date,
            timeSlot
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successfully confirmed!', booking: newBooking });
    } catch (error) {
        console.error('Booking submission error:', error);
        res.status(500).json({ error: 'System booking exception.' });
    }
});

// API Route to register a new cook
app.post('/api/cooks', async (req, res) => {
    try {
        const { name, specialty, experience, locality, rate, avatar, dishes, coordinates, fssaiNumber, idProofUrl, kitchenPhotos, subscriptionPlans } = req.body;

        if (!name || !specialty || !experience || !locality || !rate) {
            return res.status(400).json({ error: 'Name, specialty, experience, locality, and hourly rate are required.' });
        }

        // Coordinate resolution for Lucknow localities
        let coords = coordinates;
        if (!coords || !Array.isArray(coords) || coords.length !== 2) {
            const localityLower = locality.toLowerCase();
            if (localityLower.includes('hazratganj')) coords = [80.9462, 26.8467];
            else if (localityLower.includes('gomti')) coords = [80.9992, 26.8611];
            else if (localityLower.includes('indira')) coords = [80.9850, 26.8800];
            else if (localityLower.includes('aliganj')) coords = [80.9382, 26.8917];
            else coords = [80.9462, 26.8467]; // default central Lucknow
        }

        const defaultDishes = [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400&h=300",
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400&h=300",
            "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400&h=300"
        ];

        const cook = new Cook({
            name,
            specialty,
            experience: Number(experience),
            locality,
            rate: Number(rate),
            rating: 5.0,
            avatar: avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120&h=120",
            dishes: (Array.isArray(dishes) && dishes.length > 0) ? dishes.filter(d => d.trim() !== '') : defaultDishes,
            fssaiNumber: fssaiNumber || "FSSAI-11524001002345",
            isVerified: true,
            idProofUrl: idProofUrl || "",
            hygieneScore: 5.0,
            kitchenPhotos: (Array.isArray(kitchenPhotos) && kitchenPhotos.length > 0) ? kitchenPhotos : defaultDishes,
            subscriptionPlans: subscriptionPlans || { weekly3Days: Number(rate) * 11, weekly6Days: Number(rate) * 21, batchPrepRate: Number(rate) * 2 },
            location: {
                type: 'Point',
                coordinates: coords
            }
        });

        await cook.save();
        res.status(201).json({ message: 'Cook registered successfully!', cook });
    } catch (error) {
        console.error('Cook registration error:', error);
        res.status(500).json({ error: 'System cook registration exception.' });
    }
});

// API Route to start inquiry & chat thread
app.post('/api/conversations', async (req, res) => {
    try {
        const { cookId, customerName, customerPhone, address, proposedDate, proposedTime, instructions, bookingType } = req.body;
        if (!cookId || !customerName || !customerPhone || !address || !proposedDate || !proposedTime) {
            return res.status(400).json({ error: 'All mandatory inquiry fields are required.' });
        }

        const cook = await Cook.findById(cookId);
        if (!cook) return res.status(404).json({ error: 'Chef not found.' });

        const conversation = new Conversation({
            cookId,
            customerName,
            customerPhone,
            address,
            proposedDate,
            proposedTime,
            agreedPrice: cook.rate,
            bookingType: bookingType || 'One-Time Meal Service',
            instructions: instructions || 'No special instructions provided.'
        });
        await conversation.save();

        // Initial customer message
        const typeNotice = bookingType ? ` [Service: ${bookingType}]` : '';
        const initialText = (instructions && instructions.trim() !== '')
            ? `Hello Chef ${cook.name}! I would like to inquire about booking your services${typeNotice} for ${proposedDate} during ${proposedTime} at ${address}.\nSpecial Notes: ${instructions}`
            : `Hello Chef ${cook.name}! I would like to inquire about booking your services${typeNotice} for ${proposedDate} during ${proposedTime} at ${address}.`;

        const firstMsg = new Message({
            conversationId: conversation._id,
            sender: 'customer',
            text: initialText
        });
        await firstMsg.save();

        // Automated initial Chef response simulator
        const chefReply = new Message({
            conversationId: conversation._id,
            sender: 'chef',
            text: `Namaste ${customerName}! Thank you for reaching out regarding ${bookingType || 'One-Time Meal Service'}. I am available for ${proposedDate} during ${proposedTime}. My standard rate is ₹${cook.rate}/hour. We can customize the menu items and ingredients to your preference. Feel free to ask any questions!`
        });
        await chefReply.save();

        res.status(201).json({ message: 'Conversation thread initiated!', conversationId: conversation._id, conversation });
    } catch (error) {
        console.error('Conversation creation error:', error);
        res.status(500).json({ error: 'Failed to initiate conversation.' });
    }
});

// API Route to list active conversations
app.get('/api/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('cookId').sort({ createdAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});

// API Route to get conversation thread & messages
app.get('/api/conversations/:id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id).populate('cookId');
        if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });

        const messages = await Message.find({ conversationId: conversation._id }).sort({ timestamp: 1 });
        res.status(200).json({ conversation, messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversation thread.' });
    }
});

// API Route to append message to conversation thread
app.post('/api/conversations/:id/messages', async (req, res) => {
    try {
        const { sender, text, type, checklist } = req.body;
        if (!text || !sender) return res.status(400).json({ error: 'Message text and sender are required.' });

        const conversation = await Conversation.findById(req.params.id).populate('cookId');
        if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });

        const newMsg = new Message({
            conversationId: conversation._id,
            sender,
            text,
            type: type || 'text',
            checklist: (Array.isArray(checklist)) ? checklist : []
        });
        await newMsg.save();

        // If customer sent a text message, simulate chef reply
        if (sender === 'customer' && type !== 'checklist') {
            setTimeout(async () => {
                try {
                    let replyText = `Thanks for your message, ${conversation.customerName}! I've updated my notes.`;
                    const lower = text.toLowerCase();
                    if (lower.includes('price') || lower.includes('rate') || lower.includes('discount') || lower.includes('₹')) {
                        replyText = `Regarding the rate, ₹${conversation.agreedPrice || conversation.cookId.rate} per hour works well for me.`;
                    } else if (lower.includes('menu') || lower.includes('dish') || lower.includes('veg') || lower.includes('spicy')) {
                        replyText = `Sounds delicious! I specialize in fresh home preparation and can adjust spice levels exactly to your liking.`;
                    } else if (lower.includes('time') || lower.includes('date') || lower.includes('confirm')) {
                        replyText = `The timing looks great! Whenever you're ready, click "Confirm & Lock Agreement" to lock in the booking reservation.`;
                    }
                    const simChefMsg = new Message({
                        conversationId: conversation._id,
                        sender: 'chef',
                        text: replyText
                    });
                    await simChefMsg.save();
                } catch (e) {
                    console.error('Simulated chef reply error:', e);
                }
            }, 800);
        }

        res.status(201).json({ message: 'Message sent!', messageData: newMsg });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// API Route to update negotiation status, agreed price, or verify OTP
app.patch('/api/conversations/:id/status', async (req, res) => {
    try {
        const { status, agreedPrice, proposedDate, proposedTime, bookingType, verifyOtp } = req.body;
        const conversation = await Conversation.findById(req.params.id).populate('cookId');
        if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });

        if (agreedPrice) conversation.agreedPrice = Number(agreedPrice);
        if (proposedDate) conversation.proposedDate = proposedDate;
        if (proposedTime) conversation.proposedTime = proposedTime;
        if (bookingType) conversation.bookingType = bookingType;

        // OTP verification logic
        if (verifyOtp) {
            if (conversation.otpCode !== String(verifyOtp).trim()) {
                return res.status(400).json({ error: 'Invalid OTP entered. Please verify with customer.' });
            }
            conversation.status = 'In Progress';
            conversation.startedAt = new Date();
            await conversation.save();

            const timeStr = conversation.startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const systemMsg = new Message({
                conversationId: conversation._id,
                sender: 'system',
                text: `🚀 OTP Verified! Cooking session started at ${timeStr}. Payment held safely in Platform Escrow.`
            });
            await systemMsg.save();

            return res.status(200).json({ message: 'OTP verified! Cooking in progress.', conversation });
        }

        if (status) {
            conversation.status = status;
            if (status === 'Agreed') {
                // Generate 4-digit OTP for Escrow Job Start
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                conversation.otpCode = otp;

                const baseRate = conversation.agreedPrice || conversation.cookId.rate;
                const platformFee = Math.round(baseRate * 0.10);
                const totalFee = baseRate + platformFee;

                const systemMsg = new Message({
                    conversationId: conversation._id,
                    sender: 'system',
                    text: `🔒 Agreement Locked & Payment Held in Escrow! Booking Confirmed for ${conversation.proposedDate} (${conversation.proposedTime}) at ₹${baseRate}/hr + ₹${platformFee} Platform Fee (Total: ₹${totalFee}). Customer OTP: ${otp}`
                });
                await systemMsg.save();
            } else if (status === 'Completed') {
                conversation.completedAt = new Date();
                const systemMsg = new Message({
                    conversationId: conversation._id,
                    sender: 'system',
                    text: `✨ Cooking Session Completed! Escrow funds released to Chef ${conversation.cookId.name}. Please leave a review below.`
                });
                await systemMsg.save();
            }
        }

        await conversation.save();
        res.status(200).json({ message: 'Conversation updated!', conversation });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Failed to update conversation status.' });
    }
});

// API Routes for Dish-Specific Reviews & Taste Tags
app.post('/api/reviews', async (req, res) => {
    try {
        const { cookId, customerName, rating, comment, dishPhotos, tasteTags } = req.body;
        if (!cookId || !customerName || !rating || !comment) {
            return res.status(400).json({ error: 'Cook ID, customer name, rating, and comment are required.' });
        }

        const review = new Review({
            cookId,
            customerName,
            rating: Number(rating),
            comment,
            dishPhotos: Array.isArray(dishPhotos) ? dishPhotos : [],
            tasteTags: Array.isArray(tasteTags) ? tasteTags : []
        });
        await review.save();

        // Recalculate average rating for Cook
        const allReviews = await Review.find({ cookId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);

        await Cook.findByIdAndUpdate(cookId, { rating: Number(avgRating) });

        res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error) {
        console.error('Review creation error:', error);
        res.status(500).json({ error: 'Failed to submit review.' });
    }
});

app.get('/api/reviews/cook/:cookId', async (req, res) => {
    try {
        const reviews = await Review.find({ cookId: req.params.cookId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Node Web Server executing on http://localhost:${PORT}`);
});