// ============================================================
// BarePlate UI Kit — sample data
// ============================================================

const RECIPES = [
  {
    id: 'testlong',
    title: 'Sunday Ragu (20 Steps)',
    source: 'test',
    creator: 'Test',
    time: '3 hr',
    cooked: 0,
    rating: 0,
    serves: 6,
    photo: null,
    flags: [],
    sections: [
      { label: 'Meat', items: [{ name: 'Ground beef', amt: '500 g' }, { name: 'Pork sausage', amt: '250 g' }] },
      { label: 'Veg', items: [{ name: 'Onion', amt: '1 large' }, { name: 'Carrot', amt: '2' }, { name: 'Celery', amt: '2 stalks' }] },
      { label: 'Sauce', items: [{ name: 'Crushed tomatoes', amt: '800 g' }, { name: 'Red wine', amt: '1 cup' }, { name: 'Beef stock', amt: '1 cup' }] },
    ],
    steps: [
      { text: 'Take the meat out of the fridge 30 minutes before cooking.', pills: [], timer: { label: 'Rest', mins: 30 } },
      { text: 'Finely dice the onion, carrot, and celery into even pieces.', pills: [{name:'Onion',amt:'1'},{name:'Carrot',amt:'2'},{name:'Celery',amt:'2 stalks'}], timer: null },
      { text: 'Heat a wide heavy-bottomed pot over medium-high heat until very hot.', pills: [], timer: { label: 'Preheat', mins: 2 } },
      { text: 'Add a drizzle of olive oil and brown the beef in batches — do not crowd the pan.', pills: [{name:'Ground beef',amt:'500 g'}], timer: { label: 'Brown beef', mins: 5 } },
      { text: 'Remove beef and brown the sausage in the same pan.', pills: [{name:'Pork sausage',amt:'250 g'}], timer: { label: 'Brown sausage', mins: 4 } },
      { text: 'Reduce heat to medium. Add onion and cook until softened and translucent.', pills: [{name:'Onion',amt:'1'}], timer: { label: 'Soften onion', mins: 6 } },
      { text: 'Add carrot and celery. Stir frequently until vegetables are soft.', pills: [{name:'Carrot',amt:'2'},{name:'Celery',amt:'2 stalks'}], timer: { label: 'Soften veg', mins: 5 } },
      { text: 'Return all the meat to the pot and stir to combine with the vegetables.', pills: [], timer: null },
      { text: 'Pour in the red wine. Let it bubble and reduce by half.', pills: [{name:'Red wine',amt:'1 cup'}], timer: { label: 'Reduce wine', mins: 4 } },
      { text: 'Add the crushed tomatoes and stir well to combine.', pills: [{name:'Crushed tomatoes',amt:'800 g'}], timer: null },
      { text: 'Pour in the beef stock and stir through.', pills: [{name:'Beef stock',amt:'1 cup'}], timer: null },
      { text: 'Season generously with salt and pepper. Taste and adjust.', pills: [], timer: null },
      { text: 'Bring to a gentle simmer, then reduce heat to very low.', pills: [], timer: { label: 'Simmer low', mins: 90 } },
      { text: 'Stir every 20 minutes to prevent sticking. Add a splash of stock if it looks dry.', pills: [], timer: { label: 'Stir check', mins: 20 } },
      { text: 'After the first hour, taste and adjust seasoning again.', pills: [], timer: null },
      { text: 'Increase heat slightly and stir continuously to reduce and thicken the sauce.', pills: [], timer: { label: 'Reduce sauce', mins: 10 } },
      { text: 'Meanwhile, bring a large pot of salted water to a boil for pasta.', pills: [], timer: { label: 'Boil water', mins: 8 } },
      { text: 'Cook pasta until just al dente. Reserve 1 cup of pasta water before draining.', pills: [], timer: { label: 'Cook pasta', mins: 10 } },
      { text: 'Add a ladle of ragu to the drained pasta and toss with a splash of pasta water to coat.', pills: [], timer: null },
      { text: 'Serve in warm bowls topped with a generous spoonful of ragu and grated parmesan.', pills: [], timer: null },
    ],
  },
  {
    id: 'noodles',
    title: 'Garlic Butter Noodles',
    source: 'smittenkitchen.com',
    creator: 'Deb Perelman',
    time: '25 min',
    cooked: 4,
    rating: 4,
    serves: 4,
    photo: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1000&auto=format&fit=crop',
    flags: ['offline'],
    sections: [
      { label: 'Base', items: [
        { name: 'Spaghetti', amt: '200 g' },
        { name: 'Unsalted butter', amt: '3 tbsp' },
        { name: 'Garlic, minced', amt: '4 cloves' },
      ]},
      { label: 'To finish', items: [
        { name: 'Parmesan, grated', amt: '½ cup' },
        { name: 'Flat-leaf parsley', amt: '2 tbsp' },
        { name: 'Black pepper', amt: 'to taste' },
      ]},
    ],
    steps: [
      { text: 'Bring a large pot of salted water to a rolling boil.', pills: [{name:'Spaghetti', amt:'200 g'}], timer: null },
      { text: 'Add the spaghetti and cook until just al dente, stirring occasionally.', pills: [], timer: { label: 'Boil', mins: 10 } },
      { text: 'Meanwhile, melt the butter in a wide pan over low heat and add the minced garlic. Cook gently until fragrant — do not brown.', pills: [{name:'Butter', amt:'3 tbsp'},{name:'Garlic', amt:'4 cloves'}], timer: { label: 'Soften garlic', mins: 2 } },
      { text: 'Drain the pasta, reserving a splash of the cooking water. Toss into the garlic butter with the reserved water.', pills: [], timer: null },
      { text: 'Add the parmesan off the heat and toss until glossy. Finish with parsley and black pepper.', pills: [{name:'Parmesan', amt:'½ cup'},{name:'Parsley', amt:'2 tbsp'}], timer: null },
    ],
  },
  {
    id: 'adobo',
    title: "Lola's Chicken Adobo",
    source: 'handwritten card',
    creator: 'Family recipe',
    time: '50 min',
    cooked: 12,
    rating: 5,
    serves: 6,
    photo: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop',
    flags: ['offline'],
    sections: [
      { label: 'Main', items: [
        { name: 'Chicken thighs', amt: '1 kg' },
        { name: 'Soy sauce', amt: '½ cup' },
        { name: 'Cane vinegar', amt: '⅓ cup' },
        { name: 'Garlic, smashed', amt: '8 cloves' },
        { name: 'Bay leaves', amt: '3' },
        { name: 'Whole peppercorns', amt: '1 tsp' },
        { name: 'Jasmine rice', amt: '2 cups' },
      ]},
    ],
    steps: [
      { text: 'Combine chicken, soy sauce, vinegar, garlic, bay, and peppercorns in a pot. Marinate 30 minutes if you have time.', pills: [{name:'Chicken', amt:'1 kg'},{name:'Soy sauce', amt:'½ cup'}], timer: null },
      { text: 'Bring to a gentle simmer, then cover and cook until the chicken is tender.', pills: [], timer: { label: 'Simmer', mins: 30 } },
      { text: 'Meanwhile, rinse the jasmine rice until the water runs clear, then cook it so it is ready when the adobo is done.', pills: [{name:'Jasmine rice', amt:'2 cups'}], timer: { label: 'Rice', mins: 20 } },
      { text: 'Uncover and reduce the sauce until it lightly coats the chicken. Serve over rice.', pills: [], timer: { label: 'Reduce', mins: 8 } },
    ],
  },
  {
    id: 'salmon',
    title: 'Miso Glazed Salmon',
    source: 'youtube.com',
    creator: 'Maangchi',
    time: '20 min',
    cooked: 0,
    rating: 0,
    serves: 2,
    photo: null,
    flags: ['offline', 'review'],
    sections: [
      { label: 'Glaze', items: [
        { name: 'White miso', amt: '2 tbsp' },
        { name: 'Mirin', amt: '1 tbsp' },
        { name: 'Maple syrup', amt: '1 tbsp' },
      ]},
      { label: 'Fish', items: [
        { name: 'Salmon fillets', amt: '2' },
        { name: 'Scallion', amt: '1' },
      ]},
    ],
    steps: [
      { text: 'Whisk the miso, mirin, and maple syrup into a smooth glaze.', pills: [{name:'Miso', amt:'2 tbsp'}], timer: null },
      { text: 'Brush over the salmon and broil until caramelized and just cooked through.', pills: [{name:'Salmon', amt:'2'}], timer: { label: 'Broil', mins: 8 } },
      { text: 'Scatter with sliced scallion and serve.', pills: [{name:'Scallion', amt:'1'}], timer: null },
    ],
  },
  {
    id: 'soup', title: 'Weeknight Tomato Soup', source: 'nytimes.com', creator: 'Ali Slagle',
    time: '35 min', cooked: 7, rating: 4, serves: 4, photo: null, flags: ['offline'],
    sections: [], steps: [],
  },
  {
    id: 'cookies', title: 'Brown Butter Cookies', source: 'instagram.com', creator: '@halfbakedharvest',
    time: '40 min', cooked: 2, rating: 5, serves: 24, photo: null, flags: ['offline'],
    sections: [], steps: [],
  },
  {
    id: 'curry', title: 'Coconut Chickpea Curry', source: 'tiktok.com', creator: '@cookingwithshereen',
    time: '30 min', cooked: 0, rating: 0, serves: 4, photo: null, flags: ['offline', 'review'],
    sections: [], steps: [],
  },
];

const GROCERY = [
  { aisle: 'Produce', items: [
    { name: 'Garlic', amt: '1 head', src: 'Garlic Butter Noodles', checked: false },
    { name: 'Flat-leaf parsley', amt: '1 bunch', src: 'Garlic Butter Noodles', checked: false },
    { name: 'Scallions', amt: '2', src: 'Miso Glazed Salmon', checked: true },
  ]},
  { aisle: 'Meat & Seafood', items: [
    { name: 'Salmon fillets', amt: '2', src: 'Miso Glazed Salmon', checked: false },
    { name: 'Chicken thighs', amt: '1 kg', src: "Lola's Adobo", checked: false },
  ]},
  { aisle: 'Pantry', items: [
    { name: 'Spaghetti', amt: '200 g', src: 'Garlic Butter Noodles', checked: true },
    { name: 'Soy sauce', amt: '1 bottle', src: "Lola's Adobo", checked: false },
    { name: 'White miso', amt: '1 tub', src: 'Miso Glazed Salmon', checked: false },
  ]},
];

const COLLECTIONS = [
  { id: 'weeknight', name: 'Weeknight Dinners', icon: 'utensils', recipeIds: ['noodles', 'salmon', 'soup', 'curry'] },
  { id: 'heirloom', name: 'Family Heirlooms', icon: 'heart', recipeIds: ['adobo'] },
  { id: 'totry', name: 'To Try', icon: 'bookmark', recipeIds: ['salmon', 'curry', 'cookies'] },
  { id: 'desserts', name: 'Desserts', icon: 'cookie', recipeIds: ['cookies'] },
];

const THEMES = [
  { id: 'saffron', name: 'Saffron', color: '#E0A032' },
  { id: 'sage', name: 'Sage', color: '#88A878' },
  { id: 'terracotta', name: 'Terracotta', color: '#CE8467' },
  { id: 'ocean', name: 'Ocean', color: '#6F9FC2' },
  { id: 'mono', name: 'Mono', color: '#1C1A17' },
];

Object.assign(window, { RECIPES, GROCERY, COLLECTIONS, THEMES });
