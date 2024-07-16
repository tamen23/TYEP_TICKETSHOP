import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  lienDeLOffre: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    required: true
  },
  dateDebut: {
    type: String,
    required: true
  },
  dateEtHeureDeScraping: {
    type: String,
    required: true
  },
  dateFin: {
    type: String,
    required: true
  },
  lienDeLImage: {
    type: String,
    required: true
  },
  nombreDEvenements: {
    type: Number,
    required: true
  },
  prix: {
    type: String,
    required: true
  },
  prochaineDate: {
    type: String,
    required: true
  },
  prochaineLieuDateEtHeure: {
    type: String,
    required: true
  },
  titreDeLOffre: {
    type: String,
    required: true
  },
  tournee: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
