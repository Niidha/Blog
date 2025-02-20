import { authorCollection } from '../model/author.model.mjs';

export const getAllAuthors = async (req, res) => {
  try {
    // Fetch authors with relevant details like 'username', 'profileUrl', etc.
    const authors = await authorCollection.find({}, 'name profileUrl bio');

    if (authors.length === 0) {
      return res.status(404).json({ message: 'No authors found' });
    }

    // Return the authors with their details
    return res.status(200).json(authors); 
  } catch (error) {
    console.error('Error fetching authors:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
