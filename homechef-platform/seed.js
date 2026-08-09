const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homechef';

// Explicitly define schema constraints
const cookSchema = new mongoose.Schema({
    name: String, 
    specialty: String, 
    experience: Number, 
    locality: String, 
    rate: Number, 
    rating: Number, 
    avatar: String, 
    dishes: [String],
    fssaiNumber: String,
    isVerified: Boolean,
    hygieneScore: Number,
    subscriptionPlans: {
        weekly3Days: Number,
        weekly6Days: Number,
        batchPrepRate: Number
    },
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] }
});

const reviewSchema = new mongoose.Schema({
    cookId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    rating: Number,
    comment: String,
    dishPhotos: [String],
    tasteTags: [String],
    createdAt: { type: Date, default: Date.now }
});

const Cook = mongoose.model('Cook', cookSchema);
const Review = mongoose.model('Review', reviewSchema);

async function run() {
    try {
        try {
            await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
            console.log("Connected to local MongoDB for seeding...");
        } catch (connErr) {
            console.warn("⚠️ Local MongoDB unavailable, initializing MongoMemoryServer...");
            const mongod = await MongoMemoryServer.create({
                instance: { port: 27017, dbName: 'homechef' }
            });
            await mongoose.connect(mongod.getUri());
            console.log("Connected to MongoMemoryServer instance!");
        }
        
        await Cook.deleteMany({});
        await Review.deleteMany({});
        
        const cooks = await Cook.insertMany([
            {
                name: "Chef Anita V.", specialty: "Awadhi Cuisine", experience: 12, locality: "Hazratganj", rate: 200, rating: 4.8,
                fssaiNumber: "FSSAI-11524001002345", isVerified: true, hygieneScore: 4.9,
                subscriptionPlans: { weekly3Days: 2200, weekly6Days: 4200, batchPrepRate: 450 },
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
                fssaiNumber: "FSSAI-11524001008812", isVerified: true, hygieneScore: 5.0,
                subscriptionPlans: { weekly3Days: 2700, weekly6Days: 5200, batchPrepRate: 500 },
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
                fssaiNumber: "FSSAI-11524001003411", isVerified: true, hygieneScore: 4.8,
                subscriptionPlans: { weekly3Days: 1900, weekly6Days: 3700, batchPrepRate: 400 },
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
                fssaiNumber: "FSSAI-11524001009102", isVerified: true, hygieneScore: 4.9,
                subscriptionPlans: { weekly3Days: 3200, weekly6Days: 6000, batchPrepRate: 600 },
                avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120",
                dishes: [
                    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400&h=300", 
                    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=400&h=300", 
                    "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400&h=300"
                ],
                location: { type: "Point", coordinates: [80.9382, 26.8917] }
            }
        ]);

        // Seed initial reviews
        await Review.insertMany([
            {
                cookId: cooks[0]._id,
                customerName: "Vikram Sharma",
                rating: 5,
                comment: "Authentic Awadhi Biryani cooked right in our home! Spices were perfectly balanced and hygiene was 10/10.",
                tasteTags: ["Perfect Spice Balance", "Authentic Flavor", "Punctual & Clean"],
                dishPhotos: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400&h=300"]
            },
            {
                cookId: cooks[1]._id,
                customerName: "Sneha Rastogi",
                rating: 5,
                comment: "Chef Rohan prepared 3 days of healthy meal prep. Extremely clean cooking and great presentation!",
                tasteTags: ["Healthy & Less Oil", "Punctual & Clean"],
                dishPhotos: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=300"]
            }
        ]);
        
        console.log("🌱 Database seeded successfully with Verified Cooks & Reviews!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

run();