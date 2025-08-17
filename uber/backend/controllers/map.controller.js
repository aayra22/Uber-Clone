const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Google Maps API key is missing');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Distance Matrix API response:', response.data);

        if (response.data.status === 'OK') {
            const element = response.data.rows[0]?.elements[0];
            if (!element || element.status !== 'OK') {
                throw new Error('No routes found or invalid response');
            }

            return element;
        } else {
            console.error('Distance Matrix Error:', response.data);
            throw new Error(`Unable to fetch distance and time: ${response.data.status}`);
        }

    } catch (err) {
        console.error('Error in getDistanceTime:', err.response?.data || err.message);
        throw new Error('Unable to fetch distance and time');
    }
};


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error('Autocomplete Error:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error', details: err.message });
    }
}