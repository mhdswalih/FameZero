export const getCustomResponse = (userText: string): string | null => {
  const lowerText = userText.toLowerCase().trim();
  const upperText = userText.toUpperCase();
  const mixedText = userText.charAt(0).toUpperCase() + userText.slice(1).toLowerCase();

  // Flame Zero branding - Greetings
  if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
    const greetings = [
      'Welcome to Flame Zero - Your healthy food destination! How can we serve you today?',
      'Hello! Fuel your body right with Flame Zero\'s nutritionally balanced meals. What are you looking for?',
      'Hi there! Ready to experience quality nutrition? Browse our premium hotel selection.',
      'Greetings! Flame Zero brings you balanced, quality food from the finest hotels. Let\'s get started!',
      'Hey! Welcome to FLAME ZERO - where health meets taste. What interests you?'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Flame Zero project/platform info
  if (lowerText.includes('flame zero') || lowerText.includes('who are you') || lowerText.includes('what are you')) {
    const flameZeroInfo = [
      'I\'m Flame Zero - a premium platform connecting you with balanced, quality food from top-rated hotels. We ensure nutritional excellence in every meal!',
      'Flame Zero is your trusted partner for healthy eating. We partner with quality hotels to bring you nutritionally balanced food options.',
      'Welcome to FLAME ZERO - where we believe quality nutrition shouldn\'t be compromised. Discover balanced meals from verified hotels.',
      'I represent Flame Zero, a platform dedicated to providing balanced, nutritious meals from quality hotel listings you can trust.',
      'Flame Zero is all about connecting health-conscious people with quality food providers. Premium nutrition, trusted hotels!'
    ];
    return flameZeroInfo[Math.floor(Math.random() * flameZeroInfo.length)];
  }

  // Healthy/Nutrition questions
  if (lowerText.includes('healthy') || lowerText.includes('nutrition') || lowerText.includes('balanced') || lowerText.includes('diet')) {
    const healthResponses = [
      'At FLAME ZERO, we prioritize nutritionally balanced meals. All our partner hotels maintain strict quality standards for your health.',
      'Great question! Our platform ensures every meal is balanced with proper nutrients - protein, carbs, and healthy fats combined perfectly.',
      'Flame Zero partners only with hotels that serve quality, balanced nutrition. Your health is our priority!',
      'Nutrition is at the heart of what we do. Browse our quality hotel partners for meals crafted with balance in mind.',
      'We\'re committed to balanced eating. Every hotel on Flame Zero is verified for quality and nutritional standards.'
    ];
    return healthResponses[Math.floor(Math.random() * healthResponses.length)];
  }

  // Quality assurance questions
  if (lowerText.includes('quality') || lowerText.includes('fresh') || lowerText.includes('standard') || lowerText.includes('guarantee')) {
    const qualityResponses = [
      'Quality is non-negotiable at FLAME ZERO. All our hotels meet rigorous standards for fresh, balanced food preparation.',
      'We don\'t compromise on quality. Every hotel partner undergoes strict verification to ensure premium, fresh ingredients.',
      'FLAME ZERO guarantees quality in every serving. Our partner hotels maintain the highest standards for nutrition and freshness.',
      'Quality control is our strength. From ingredient sourcing to meal preparation, we ensure excellence at every step.',
      'Your satisfaction matters. All Flame Zero hotel partners are verified for quality, freshness, and balanced nutrition.'
    ];
    return qualityResponses[Math.floor(Math.random() * qualityResponses.length)];
  }

  // Food/Menu questions
  if (lowerText.includes('menu') || lowerText.includes('food') || lowerText.includes('meal') || lowerText.includes('dishes')) {
    const foodResponses = [
      'Explore our diverse menu of balanced meals across premium hotels. Every dish is crafted with nutrition in mind.',
      'FLAME ZERO offers a variety of quality meals - from proteins to vegetables to healthy carbs. Browse hotels near you!',
      'Our partner hotels serve meals that are both delicious AND nutritionally balanced. Check out what\'s available!',
      'Looking for balanced meals? Flame Zero lists quality food options from verified hotels. Explore our menu today!',
      'From breakfast to dinner, discover balanced meal options at quality hotels on Flame Zero.'
    ];
    return foodResponses[Math.floor(Math.random() * foodResponses.length)];
  }

  // Hotel/Restaurant info
  if (lowerText.includes('hotel') || lowerText.includes('restaurant') || lowerText.includes('listing') || lowerText.includes('partner')) {
    const hotelResponses = [
      'FLAME ZERO partners with quality hotels that prioritize balanced nutrition. Browse verified listings to find your ideal meal.',
      'Our hotel network includes only quality establishments committed to balanced, nutritious food preparation.',
      'Explore premium hotel listings on Flame Zero - all verified for quality, freshness, and balanced nutrition.',
      'Every hotel on Flame Zero has been vetted for quality standards. Choose from our trusted partner network.',
      'Flame Zero works exclusively with quality hotels. Each listing guarantees balanced, premium food options.'
    ];
    return hotelResponses[Math.floor(Math.random() * hotelResponses.length)];
  }

  // Premium/High quality mentions
  if (lowerText.includes('premium') || lowerText.includes('luxury') || lowerText.includes('best') || lowerText.includes('top')) {
    const premiumResponses = [
      'FLAME ZERO is your gateway to premium quality food. All our hotels maintain the highest standards.',
      'Premium doesn\'t mean expensive - it means quality, balance, and nutrition. That\'s the Flame Zero promise.',
      'The best of balanced nutrition comes from our carefully selected quality hotel partners.',
      'Flame Zero curates only the top quality establishments - because your health deserves the best.',
      'Premium quality meals with balanced nutrition - that\'s what FLAME ZERO delivers.'
    ];
    return premiumResponses[Math.floor(Math.random() * premiumResponses.length)];
  }

  // User preferences - dietary
  if (lowerText.includes('vegan') || lowerText.includes('vegetarian') || lowerText.includes('gluten') || lowerText.includes('low calorie') || lowerText.includes('keto')) {
    const dietaryResponses = [
      'FLAME ZERO partners understand dietary preferences. Browse hotels offering vegan, vegetarian, or specialized balanced meals.',
      'Whether you prefer plant-based or protein-rich options, Flame Zero has quality meals tailored for your dietary needs.',
      'Our quality hotels cater to all dietary preferences while maintaining balanced nutrition - vegan to keto, we\'ve got you covered!',
      'Special dietary needs? Flame Zero hotels offer balanced options for every preference - gluten-free, low-calorie, and more.',
      'Find balanced meals that match your dietary lifestyle. All Flame Zero partners accommodate various nutritional preferences.'
    ];
    return dietaryResponses[Math.floor(Math.random() * dietaryResponses.length)];
  }

  // Price/Affordability
  if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('affordable') || lowerText.includes('budget')) {
    const priceResponses = [
      'Quality balanced nutrition doesn\'t have to break the bank. Flame Zero offers affordable options from quality hotels.',
      'FLAME ZERO believes healthy eating should be accessible. Browse budget-friendly quality meals from our partners.',
      'Affordable excellence is our motto. Get balanced, quality meals at fair prices through Flame Zero.',
      'Quality nutrition at competitive prices - that\'s the Flame Zero advantage. All our hotels offer great value.',
      'FLAME ZERO partners provide quality balanced meals at prices that won\'t drain your wallet.'
    ];
    return priceResponses[Math.floor(Math.random() * priceResponses.length)];
  }

  // Delivery/Ordering
  if (lowerText.includes('order') || lowerText.includes('delivery') || lowerText.includes('book') || lowerText.includes('reserve')) {
    const orderResponses = [
      'Ready to order quality balanced meals? Browse FLAME ZERO hotels and reserve your meal today!',
      'Ordering is easy on Flame Zero. Select from quality hotels, choose your balanced meal, and we\'ll deliver it fresh.',
      'Get your balanced nutrition delivered. Order from quality FLAME ZERO partner hotels - quick, easy, and fresh!',
      'Book your quality meal from Flame Zero. Our partner hotels ensure fresh, balanced nutrition delivered to you.',
      'FLAME ZERO makes ordering balanced meals simple. Choose a quality hotel partner and place your order now!'
    ];
    return orderResponses[Math.floor(Math.random() * orderResponses.length)];
  }

  // User testimonials/trust
  if (lowerText.includes('review') || lowerText.includes('rating') || lowerText.includes('trust') || lowerText.includes('experience')) {
    const trustResponses = [
      'Thousands trust FLAME ZERO for quality balanced meals. Check reviews and ratings from our community.',
      'Our users love the quality and balance. Read real reviews from people who\'ve chosen Flame Zero for their nutrition.',
      'FLAME ZERO is built on trust - quality hotels, verified listings, and honest user reviews. Join our community!',
      'Experience quality nutrition with Flame Zero. Real reviews from real users who prioritize their health.',
      'Trust the platform that prioritizes quality. FLAME ZERO users rate our partner hotels highly for balance and freshness.'
    ];
    return trustResponses[Math.floor(Math.random() * trustResponses.length)];
  }

  // Fitness/Health lifestyle
  if (lowerText.includes('fitness') || lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('training')) {
    const fitnessResponses = [
      'FLAME ZERO is perfect for fitness enthusiasts. Our balanced meals support your training and nutrition goals.',
      'Whether you\'re at the gym or hitting your fitness goals, Flame Zero provides quality balanced nutrition for athletes.',
      'Support your fitness journey with FLAME ZERO. Quality, balanced meals from partner hotels fuel your workouts.',
      'Training hard? Fuel smarter. Flame Zero offers balanced meals designed for fitness-conscious people.',
      'FLAME ZERO and fitness go hand in hand. Balanced nutrition from quality hotels to support your goals.'
    ];
    return fitnessResponses[Math.floor(Math.random() * fitnessResponses.length)];
  }

  // Subscription/Membership
  if (lowerText.includes('subscription') || lowerText.includes('membership') || lowerText.includes('plan') || lowerText.includes('package')) {
    const subscriptionResponses = [
      'FLAME ZERO offers subscription plans for consistent quality meals. Choose your preferred package today!',
      'Get regular balanced nutrition with Flame Zero memberships. Subscribe for quality hotel meals delivered regularly.',
      'Our membership plans bring consistent quality to your nutrition. Choose the Flame Zero package that works for you.',
      'Subscribe to FLAME ZERO and enjoy regular balanced meals from quality hotels at member prices.',
      'Flame Zero subscriptions ensure you never miss balanced nutrition. Quality meals, reliable service, member benefits!'
    ];
    return subscriptionResponses[Math.floor(Math.random() * subscriptionResponses.length)];
  }

  // Thanks/Gratitude
  if (lowerText.includes('thank') || lowerText.includes('thanks') || lowerText.includes('appreciate')) {
    const thankResponses = [
      'You\'re welcome! We\'re grateful to serve your nutrition journey. Enjoy quality meals from FLAME ZERO!',
      'Thanks for choosing FLAME ZERO! We appreciate your commitment to balanced, quality nutrition.',
      'Happy to help! Your health matters to us. Keep enjoying quality balanced meals!',
      'Thank you for trusting FLAME ZERO. We\'re here for your nutrition needs anytime!',
      'We appreciate your support. Enjoy premium quality balanced meals on FLAME ZERO!'
    ];
    return thankResponses[Math.floor(Math.random() * thankResponses.length)];
  }

  // Goodbye
  if (lowerText.includes('bye') || lowerText.includes('goodbye') || lowerText.includes('see you') || lowerText.includes('exit')) {
    const goodbyeResponses = [
      'Goodbye! Thanks for choosing FLAME ZERO. Enjoy your balanced meal!',
      'See you next time! Keep choosing quality nutrition with FLAME ZERO.',
      'Take care! We\'ll be here whenever you need balanced, quality meals.',
      'Until next time! FLAME ZERO - because quality nutrition matters.',
      'Bye! Enjoy your meal. We look forward to serving you again!'
    ];
    return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)];
  }

  return null; 
};