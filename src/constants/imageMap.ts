// Image mapping for local assets
export const IMAGE_MAP: { [key: string]: any } = {
  'Buffalo wing.jpg': require('../../assets/images/Buffalo wing.jpg'),
  'Cheesecake.jpg': require('../../assets/images/Cheesecake.jpg'),
  'chocolate-birthday-cake-scaled.jpg': require('../../assets/images/chocolate-birthday-cake-scaled.jpg'),
  'ClassicBurgers.jpg': require('../../assets/images/ClassicBurgers.jpg'),
  'coke.webp': require('../../assets/images/coke.webp'),
  'Garlic-Bread-4.webp': require('../../assets/images/Garlic-Bread-4.webp'),
  'grilled-salmon-recipe.jpg': require('../../assets/images/grilled-salmon-recipe.jpg'),
  'Iced-Coffee.jpg': require('../../assets/images/Iced-Coffee.jpg'),
  'Pizza-Margherita.jpg': require('../../assets/images/Pizza-Margherita.jpg'),
  'orange-juice.png': require('../../assets/images/orange-juice.png'),
  // Fallback image for any missing images
  'default': require('../../assets/images/KomEat Logo.png')
};

// Function to get image source
export const getImageSource = (imageName: string) => {
  return IMAGE_MAP[imageName] || IMAGE_MAP['default'];
};
