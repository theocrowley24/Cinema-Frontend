import {Crop} from "react-image-crop";

export const getCroppedImg = (image: HTMLImageElement, crop: Crop, fileName: string): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if (crop.width != null) {
        canvas.width = crop.width;
    }
    if (crop.height != null) {
        canvas.height = crop.height;
    }
    const ctx = canvas.getContext('2d');


    // @ts-ignore
    ctx?.drawImage(
        image,
        (crop.x || 0) * scaleX,
        (crop.y || 0) * scaleY,
        (crop.width || 0) * scaleX,
        (crop.height || 0) * scaleY,
        0,
        0,
        crop.width || 0,
        crop.height || 0,
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            // @ts-ignore
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg', 1);
    });
}
