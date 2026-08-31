const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = '2-XXXXXXXX'; // Replace with your Custom Object Type ID / fully qualified name

// ROUTE 1: Get custom object data and render on the homepage
app.get('/', async (req, res) => {
    const customObjectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,bio,age`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectsUrl, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Custom Objects | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving custom object records');
    }
});

// ROUTE 2: Render form to create/update custom object record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3: Create a new custom object record in HubSpot
app.post('/update-cobj', async (req, res) => {
    const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newRecord = {
        properties: {
            "name": req.body.name,
            "bio": req.body.bio,
            "age": req.body.age
        }
    };

    try {
        await axios.post(createUrl, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating custom object record');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
