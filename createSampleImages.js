const fs = require('fs').promises;
const path = require('path');

// Create simple SVG placeholder images for testing the static file middleware
const createSampleImages = async () => {
    const imagesDir = path.join(__dirname, 'public', 'images', 'lessons');
    
    // Ensure directory exists
    await fs.mkdir(imagesDir, { recursive: true });
    
    const subjects = [
        { name: 'mathematics', color: '#4285f4', icon: '∑', symbol: 'x²+y²=z²' },
        { name: 'english', color: '#ea4335', icon: 'Aa', symbol: 'Literature' },
        { name: 'science', color: '#34a853', icon: '⚗️', symbol: 'H₂O + NaCl' },
        { name: 'history', color: '#fbbc04', icon: '📜', symbol: '1066 AD' },
        { name: 'geography', color: '#ff6d01', icon: '🌍', symbol: 'Latitude' }
    ];
    
    console.log('🖼️  Creating sample lesson images for testing...');
    
    for (const subject of subjects) {
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad${subject.name}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${subject.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${subject.color}88;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="300" fill="url(#grad${subject.name})" rx="15"/>
    
    <!-- Main Icon -->
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="60" 
          text-anchor="middle" fill="white" opacity="0.9" filter="url(#shadow)">${subject.icon}</text>
    
    <!-- Subject Name -->
    <text x="200" y="180" font-family="Arial, sans-serif" font-size="32" 
          text-anchor="middle" fill="white" font-weight="bold" filter="url(#shadow)">
          ${subject.name.toUpperCase()}
    </text>
    
    <!-- Symbol/Formula -->
    <text x="200" y="210" font-family="Arial, sans-serif" font-size="18" 
          text-anchor="middle" fill="white" opacity="0.8">
          ${subject.symbol}
    </text>
    
    <!-- Lesson Label -->
    <text x="200" y="250" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="white" opacity="0.7">
          LESSON IMAGE
    </text>
    
    <!-- Border -->
    <rect width="396" height="296" x="2" y="2" fill="none" 
          stroke="white" stroke-width="3" rx="15" opacity="0.4"/>
          
    <!-- Corner decoration -->
    <circle cx="50" cy="50" r="20" fill="white" opacity="0.2"/>
    <circle cx="350" cy="250" r="15" fill="white" opacity="0.2"/>
</svg>`;
        
        const fileName = `${subject.name}.svg`;
        const filePath = path.join(imagesDir, fileName);
        
        await fs.writeFile(filePath, svgContent.trim());
        console.log(`✅ Created: ${fileName}`);
    }
    
    // Create a simple JPG placeholder (1x1 pixel base64 encoded)
    const jpegData = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A', 'base64');
    await fs.writeFile(path.join(imagesDir, 'test.jpg'), jpegData);
    console.log(`✅ Created: test.jpg (for JPG format testing)`);
    
    console.log(`\n🎉 Created ${subjects.length + 1} sample lesson images!`);
    console.log(`📁 Location: ${imagesDir}`);
    console.log('\n🔗 Test URLs (when server is running on port 3000):');
    console.log('\n✅ VALID IMAGES (should display images):');
    subjects.forEach(subject => {
        console.log(`   http://localhost:3000/images/lessons/${subject.name}.svg`);
    });
    console.log(`   http://localhost:3000/images/lessons/test.jpg`);
    
    console.log('\n❌ INVALID IMAGES (should show error JSON):');
    console.log('   http://localhost:3000/images/lessons/nonexistent.jpg');
    console.log('   http://localhost:3000/images/lessons/missing.png');
    console.log('   http://localhost:3000/images/lessons/fake-lesson.gif');
    
    console.log('\n🧪 Testing Instructions:');
    console.log('1. Start server: npm start');
    console.log('2. Visit the URLs above in your browser');
    console.log('3. Valid images should display properly');
    console.log('4. Invalid images should show structured error JSON');
    console.log('5. Check server console for logging output');
};

// Run if called directly
if (require.main === module) {
    createSampleImages().catch(console.error);
}

module.exports = { createSampleImages };
