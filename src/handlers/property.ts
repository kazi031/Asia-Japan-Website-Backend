import fs from 'fs';
import path from 'path';

import prisma from "../db";

const multer = require('multer');

const upload = multer({ dest: 'propertyImages/' }).array('images', 4);

// GET all Properties
export const getProperties = async (req, res) => {
    const properties = await prisma.property.findMany();
    res.json({data: properties});
}

// GET one Property
export const getOneProperty = async (req, res) => {
    const id = req.params.id
    const property = await prisma.property.findUnique({
        where: {
            propertyId: id
        }
    })
    res.json({data: property});
}

// Create Property
export const createNewProperty = async (req, res, next) => {
    try {
        const {title, 
               subtitle, 
               location, 
               detailedLocation, 
               area, 
               roadWidth, 
               landFace, 
               landDetails} = req.body;
        const files = req.flies;

        if (!files || files.length === 0) {
            throw new Error('No files uploaded');
        }

        const imageUrls = files.map(file => {
            const imagePath = file.path;
            const finalDestination = path.join('propertyImages/', file.originalname);

            fs.renameSync(imagePath, finalDestination);

            let baseUrl;

            if (process.env.NODE_ENV === 'production') {
                baseUrl = 'https://api-design-v4-jr3v.onrender.com';
            } else {
                baseUrl = 'http://localhost:3001';
            }

            return `${baseUrl}/${finalDestination}`.replace(/\\/g, '/');
        });

        const createdProperty = await prisma.property.create({
            data: {
                title: title,
                subtitle: subtitle,
                location: location,
                detailedLocation: detailedLocation,
                area: area,
                roadWidth: roadWidth,
                landFace: landFace,
                landDetails: landDetails,
                assets: imageUrls
            }
        });

        res.json(createdProperty);
    } catch (e) {
        e.type = 'input';
        next(e);
    }
};