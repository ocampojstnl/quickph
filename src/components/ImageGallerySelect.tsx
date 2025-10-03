// "use client";
//
// import React, { useState, useEffect } from 'react';
//
// interface ImageGallerySelectProps {
//   onImagesSelected: (images: string[]) => void;
// }
//
// const ImageGallerySelect: React.FC<ImageGallerySelectProps> = ({ onImagesSelected }) => {
//   const [images, setImages] = useState<string[]>([]);
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//
//   useEffect(() => {
//     // Fetch images from the server or local storage
//     const fetchImages = async () => {
//       // Replace this with your actual image fetching logic
//       const fetchedImages = [
//         '/uploads/image1.jpg',
//         '/uploads/image2.jpg',
//         '/uploads/image3.jpg',
//       ];
//       setImages(fetchedImages);
//     };
//
//     fetchImages();
//   }, []);
//
//   const toggleImageSelection = (image: string) => {
//     if (selectedImages.includes(image)) {
//       setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image));
//     } else {
//       setSelectedImages([...selectedImages, image]);
//     }
//   };
//
//   useEffect(() => {
//     onImagesSelected(selectedImages);
//   }, [selectedImages, onImagesSelected]);
//
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {images.map((image) => (
//         <div
//           key={image}
//           className={`relative cursor-pointer ${selectedImages.includes(image) ? 'border-2 border-blue-500' : ''}`}
//           onClick={() => toggleImageSelection(image)}
//         >
//           <img src={image} alt="Gallery Image" className="w-full h-32 object-cover" />
//           {selectedImages.includes(image) && (
//             <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50"></div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default ImageGallerySelect;