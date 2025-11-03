const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.js')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to remove comments from a file
function removeCommentsFromFile(filePath) {
  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove single line comments
  content = content.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove JSX comments
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Clean up extra blank lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
}

// Get all JS files in the src directory
const srcDir = path.join(__dirname, 'src');
const jsFiles = getAllFiles(srcDir);

// Process each file
jsFiles.forEach(file => {
  removeCommentsFromFile(file);
});

console.log('All comments removed successfully!');