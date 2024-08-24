import Contact from '../models/Contact.js';

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, Object , message } = req.body;
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      Object,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving contact', error });
  }
};

export default createContact;
