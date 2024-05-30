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
    const property = await prisma.property.findUniqueOrThrow({
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
                baseUrl = '';
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

export const updateProperty = async (req, res, next) => {
    try {
        const { id } = req.params.id;
        const {title, 
            subtitle, 
            location, 
            detailedLocation, 
            area, 
            roadWidth, 
            landFace, 
            landDetails,
            status} = req.body;
        const files = req.flies;

        if (!id) {
            throw new Error('Property ID is required');
        }

        // Image Update
        let imageUrls = [];

        if (files && files.length > 0) {
            imageUrls = files.map(file => {
                const imagePath = file.path;
                const finalDestination = path.join('propertyImages/', file.originalname);

                // Move file to final destination
                fs.renameSync(imagePath, finalDestination);

                let baseUrl;

                if (process.env.NODE_ENV === 'production') {
                    baseUrl = '';
                } else {
                    baseUrl = 'http://localhost:3001';
                }

                return `${baseUrl}/${finalDestination}`.replace(/\\/g, '/');
            });
        }

        const existingProperty = await prisma.property.findUnique({
            where: { propertyId: id },
        });

        if (!existingProperty) {
            throw new Error('Property not found');
        }

        // Use existing images if no new images are provided
        const updatedAssets = imageUrls.length > 0 ? imageUrls : existingProperty.assets;

        // Prepare updated data
        const updatedData = {
            title: title !== undefined ? title : existingProperty.title,
            subtitle: subtitle !== undefined ? subtitle : existingProperty.subtitle,
            location: location !== undefined ? location : existingProperty.location,
            detailedLocation: detailedLocation !== undefined ? detailedLocation : existingProperty.detailedLocation,
            area: area !== undefined ? area : existingProperty.area,
            roadWidth: roadWidth !== undefined ? roadWidth : existingProperty.roadWidth,
            landFace: landFace !== undefined ? landFace : existingProperty.landFace,
            landDetails: landDetails !== undefined ? landDetails : existingProperty.landDetails,
            status: status !== undefined ? status : existingProperty.status,
            assets: updatedAssets
        };

        const updatedProperty = await prisma.property.update({
            where: { propertyId: id },
            data: updatedData
        });
        res.json(updatedProperty);
    } catch (e) {
        e.type = 'input';
        next(e);
    }
}