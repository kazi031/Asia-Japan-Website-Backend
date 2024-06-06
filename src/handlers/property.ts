import fs from 'fs';
import path from 'path';

import prisma from "../db";


// GET all Properties
export const getProperties = async (req, res) => {
    const properties = await prisma.property.findMany();
    res.json({data: properties});
}

// GET one Property
export const getOneProperty = async (req, res) => {
    const id = req.params.id;
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
        
        const files = req.files;

        if (!files || files.length < 3) {
            throw new Error('No files uploaded');
        }

        

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
                assets: []
            }
        });

        const propertyId = createdProperty.propertyId;
        const imageUrls = [];
        
        files.forEach((file, index) => {
            const imagePath = file.path;
            const fileExtension = path.extname(file.originalname); 
            const finalFileName = `img${propertyId}${index + 1}${fileExtension}`;
            const finalDestination = path.join('propertyImages', finalFileName);

            fs.renameSync(imagePath, finalDestination);

            let baseUrl;

            if (process.env.NODE_ENV === 'production') {
                baseUrl = '';
            } else {
                baseUrl = 'http://localhost:3001';
            }

            baseUrl = 'http://localhost:3001';

            imageUrls.push(`${baseUrl}/${finalDestination}`.replace(/\\/g, '/'));

            // return `${baseUrl}/${finalDestination}`.replace(/\\/g, '/');
        });

        
        const updatedProperty = await prisma.property.update({
            where: { propertyId },
            data: { assets: imageUrls }
        });

        res.json(updatedProperty);


    } catch (e) {
        e.type = 'input';
        next(e);
    }
}; 

// Update Property
export const updateProperty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const propertyId = parseInt(id);
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

        console.log("Files received:", files); 

        if (!propertyId) {
            throw new Error('Property ID is required');
        }

        const existingProperty = await prisma.property.findUniqueOrThrow({
            where: {
                propertyId: propertyId
            }
        })

        if (!existingProperty) {
            throw new Error('Property not found');
        }



        // Image Update
        const imageUrls = [];

        const exproplen = existingProperty.assets.length;
        console.log(exproplen);
        console.log(files.length);
        if(files){
            console.log(exproplen);
            files.forEach((file, index) => {
                console.log(exproplen);
                const imagePath = file.path;
                const fileExtension = path.extname(file.originalname); 
                const finalFileName = `img${propertyId}${exproplen + index + 1}${fileExtension}`;
                const finalDestination = path.join('propertyImages', finalFileName);
    
                fs.renameSync(imagePath, finalDestination);
    
                let baseUrl;
    
                if (process.env.NODE_ENV === 'production') {
                    baseUrl = '';
                } else {
                    baseUrl = 'http://localhost:3001';
                }
    
                baseUrl = 'http://localhost:3001';
    
                imageUrls.push(`${baseUrl}/${finalDestination}`.replace(/\\/g, '/'));
    
                // return `${baseUrl}/${finalDestination}`.replace(/\\/g, '/');
            });
        }
        // Use existing images if no new images are provided
        const updatedAssets = imageUrls.length > 0 ? [...existingProperty.assets, ...imageUrls] : existingProperty.assets;

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
            where: { propertyId: propertyId },
            data: updatedData
        });
        res.json(updatedProperty);
    } catch (e) {
        e.type = 'input';
        next(e);
    }
}

// Delete Property
export const deleteProperty = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        if (!id) {
            throw new Error('Property ID is required');
        }

        // Fetch the existing property data
        const existingProperty = await prisma.property.findUnique({
            where: { propertyId: id },
        });

        if (!existingProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }

        let baseUrl;
        if (process.env.NODE_ENV === 'production') {
            baseUrl = '';
        } else {
            baseUrl = 'http://localhost:3001';
        }

        // Delete associated files from the server
        const assets = existingProperty.assets;
        assets.forEach(assetUrl => {
            const filePath = path.join(__dirname, '..', assetUrl.replace(baseUrl, '').replace(/^\//, ''));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // Delete the property record from the database
        await prisma.property.delete({
            where: { propertyId: id },
        });

        res.json({ message: 'Property deleted successfully' });
    } catch (e) {
        e.type = 'input';
        next(e);
    }
};