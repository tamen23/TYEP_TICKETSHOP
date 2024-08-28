import mongoose from 'mongoose';
import Event from './models/Event.js';

const addEvents = async () => {
  try {
    await mongoose.connect('mongodb+srv://leotamen22:FxGkjVn5uBpXPsLL@clustertyep.grmvsbh.mongodb.net/Tyep?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const events = [
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "Rap Showdown at Madison Square Garden",
        venue: "Madison Square Garden",
        street_address: "4 Pennsylvania Plaza",
        postal_code: "10001",
        city: "New York",
        country: "USA",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUA6-cHktTC3_PAR1PCNWMDZV7gIKXhMRWFA&s"], // URL d'image fournie
        target_audience: ["adult", "all"],
        description: "Get ready for a high-energy rap showdown at Madison Square Garden featuring top artists from around the world. This is a night you won't want to miss!",
        date: new Date('2024-10-01T19:00:00.000+00:00'),
        duration: 180,
        start_time: "19:00",
        end_time: "22:00",
        category: "Cultural",
        sub_category: "Concert",
        capacity: 20000,
        pricing: "paid",
        seat_categories: [
          { type: "vip", count: 500, price: 300 },
          { type: "general", count: 19500, price: 100 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "Hip-Hop Night at The Forum",
        venue: "The Forum",
        street_address: "3900 W Manchester Blvd",
        postal_code: "90305",
        city: "Inglewood",
        country: "USA",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgEQqT6TIwR4w42JX2Q9fze6i5muWw1CpwwQ&s"], // URL d'image fournie
        target_audience: ["all"],
        description: "Join us for a night of beats and rhymes at The Forum. Featuring live performances from top hip-hop artists, this event is sure to be a hit!",
        date: new Date('2024-10-15T20:00:00.000+00:00'),
        duration: 180,
        start_time: "20:00",
        end_time: "23:00",
        category: "Cultural",
        sub_category: "Concert",
        capacity: 17500,
        pricing: "paid",
        seat_categories: [
          { type: "vip", count: 300, price: 250 },
          { type: "general", count: 17200, price: 80 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "Urban Music Fest",
        venue: "Central Park",
        street_address: "Central Park",
        postal_code: "10024",
        city: "New York",
        country: "USA",
        images: ["https://images.sk-static.com/images/media/img/col6/20200125-194502-928417.jpg"], // URL d'image fournie
        target_audience: ["all"],
        description: "Experience the best of urban music at Central Park's Urban Music Fest. A full day of performances, food, and fun in the heart of New York City.",
        date: new Date('2024-10-22T10:00:00.000+00:00'),
        duration: 480,
        start_time: "10:00",
        end_time: "18:00",
        category: "Cultural",
        sub_category: "Music Festival",
        capacity: 50000,
        pricing: "paid",
        seat_categories: [
          { type: "general", count: 50000, price: 50 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "Hip-Hop Carnival",
        venue: "Grant Park",
        street_address: "337 E Randolph St",
        postal_code: "60601",
        city: "Chicago",
        country: "USA",
        images: ["https://static.actu.fr/uploads/2022/06/10122-220611130421101-0.jpg"], // URL d'image fournie
        target_audience: ["family", "all"],
        description: "Join the biggest hip-hop carnival of the year at Grant Park. Enjoy live music, street food, and family-friendly activities.",
        date: new Date('2024-09-05T12:00:00.000+00:00'),
        duration: 360,
        start_time: "12:00",
        end_time: "18:00",
        category: "Cultural",
        sub_category: "Festival",
        capacity: 40000,
        pricing: "paid",
        seat_categories: [
          { type: "general", count: 40000, price: 30 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "West Coast Rap Battle",
        venue: "Staples Center",
        street_address: "1111 S Figueroa St",
        postal_code: "90015",
        city: "Los Angeles",
        country: "USA",
        images: ["https://www.journalventilo.fr/wp-content/uploads/2024/07/Gossip.jpg"], // URL d'image fournie
        target_audience: ["adult", "all"],
        description: "Watch the most intense rap battles on the West Coast at Staples Center. Only the best of the best will take the stage in this fierce competition.",
        date: new Date('2024-11-10T18:00:00.000+00:00'),
        duration: 240,
        start_time: "18:00",
        end_time: "22:00",
        category: "Cultural",
        sub_category: "Concert",
        capacity: 18000,
        pricing: "paid",
        seat_categories: [
          { type: "vip", count: 1000, price: 350 },
          { type: "general", count: 17000, price: 120 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "Southern Rap Showcase",
        venue: "Mercedes-Benz Stadium",
        street_address: "1 AMB Dr NW",
        postal_code: "30313",
        city: "Atlanta",
        country: "USA",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKm1TDtN1tVjGigsm8yq-ydh2cn8SjCF5XkxR-oDoiWoTSQz_i_JTHdz5i3ngQ_P6un5I&usqp=CAU"], // URL d'image fournie
        target_audience: ["all"],
        description: "Join us in Atlanta for the Southern Rap Showcase at Mercedes-Benz Stadium. Featuring the best rap artists from the southern states.",
        date: new Date('2024-12-01T19:00:00.000+00:00'),
        duration: 180,
        start_time: "19:00",
        end_time: "22:00",
        category: "Cultural",
        sub_category: "Concert",
        capacity: 71000,
        pricing: "paid",
        seat_categories: [
          { type: "vip", count: 5000, price: 400 },
          { type: "general", count: 66000, price: 100 }
        ],
        status: "approved",
        recurring: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organizer_id: new mongoose.Types.ObjectId(),
        name: "East Coast Hip-Hop Extravaganza",
        venue: "Barclays Center",
        street_address: "620 Atlantic Ave",
        postal_code: "11217",
        city: "Brooklyn",
        country: "USA",
        images: ["https://leforum.cergypontoise.fr/sites/forumvaureal/files/styles/auto_1920/public/2023-11/dope-dod-concert-france-forum-vaureal-95.jpg?itok=FcVYeR5f"], // URL d'image fournie
        target_audience: ["all"],
        description: "Don't miss the East Coast Hip-Hop Extravaganza at Barclays Center, featuring top artists from New York and beyond.",
        date: new Date('2024-12-15T20:00:00.000+00:00'),
        duration: 180,
        start_time: "20:00",
        end_time: "23:00",
        category: "Cultural",
        sub_category: "Concert",
        capacity: 19000,
        pricing: "paid",
        seat_categories: [
          { type: "vip", count: 2000, price: 300 },
          { type: "general", count: 17000, price: 80 }
        ],
        status: "approved",
        recurring: false,
      },
    ];

    const savedEvents = await Event.insertMany(events);
    console.log('Events saved successfully:', savedEvents);
  } catch (error) {
    console.error('Error saving events:', error);
  } finally {
    mongoose.connection.close(); // Fermez la connexion après l'opération
  }
};

addEvents();
