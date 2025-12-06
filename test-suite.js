// Automated Test Suite for Sam Download Manager
// This will add 50 test downloads and monitor their progress

const testUrls = [
  // Small images (1-5 MB)
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', name: 'test-image-1.jpg', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', name: 'test-image-2.jpg', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', name: 'test-image-3.jpg', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', name: 'test-image-4.jpg', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', name: 'test-image-5.jpg', size: 'small' },
  
  // JSON test files
  { url: 'https://jsonplaceholder.typicode.com/posts', name: 'test-posts.json', size: 'tiny' },
  { url: 'https://jsonplaceholder.typicode.com/comments', name: 'test-comments.json', size: 'tiny' },
  { url: 'https://jsonplaceholder.typicode.com/albums', name: 'test-albums.json', size: 'tiny' },
  { url: 'https://jsonplaceholder.typicode.com/photos', name: 'test-photos.json', size: 'tiny' },
  { url: 'https://jsonplaceholder.typicode.com/todos', name: 'test-todos.json', size: 'tiny' },
  
  // GitHub sample files (1-10 MB)
  { url: 'https://github.com/testing-library/react-testing-library/archive/refs/heads/main.zip', name: 'react-testing-lib.zip', size: 'small' },
  { url: 'https://github.com/axios/axios/archive/refs/heads/v1.x.zip', name: 'axios-source.zip', size: 'small' },
  { url: 'https://github.com/lodash/lodash/archive/refs/heads/main.zip', name: 'lodash-source.zip', size: 'small' },
  { url: 'https://github.com/moment/moment/archive/refs/heads/develop.zip', name: 'moment-source.zip', size: 'small' },
  { url: 'https://github.com/expressjs/express/archive/refs/heads/master.zip', name: 'express-source.zip', size: 'medium' },
  
  // PDF documents
  { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', name: 'test-pdf-1.pdf', size: 'tiny' },
  { url: 'https://www.africau.edu/images/default/sample.pdf', name: 'test-pdf-2.pdf', size: 'tiny' },
  
  // Sample MP3 files (small samples)
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', name: 'test-audio-1.mp3', size: 'medium' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', name: 'test-audio-2.mp3', size: 'medium' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', name: 'test-audio-3.mp3', size: 'medium' },
  
  // Text files
  { url: 'https://raw.githubusercontent.com/nodejs/node/main/README.md', name: 'nodejs-readme.txt', size: 'tiny' },
  { url: 'https://raw.githubusercontent.com/microsoft/vscode/main/README.md', name: 'vscode-readme.txt', size: 'tiny' },
  { url: 'https://raw.githubusercontent.com/facebook/react/main/README.md', name: 'react-readme.txt', size: 'tiny' },
  { url: 'https://raw.githubusercontent.com/electron/electron/main/README.md', name: 'electron-readme.txt', size: 'tiny' },
  { url: 'https://raw.githubusercontent.com/TypeStrong/ts-node/main/README.md', name: 'tsnode-readme.txt', size: 'tiny' },
  
  // CSV data files
  { url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv', name: 'test-addresses.csv', size: 'tiny' },
  { url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv', name: 'test-airtravel.csv', size: 'tiny' },
  { url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/biostats.csv', name: 'test-biostats.csv', size: 'tiny' },
  { url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/cities.csv', name: 'test-cities.csv', size: 'tiny' },
  { url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/deniro.csv', name: 'test-deniro.csv', size: 'tiny' },
  
  // XML files
  { url: 'https://www.w3schools.com/xml/cd_catalog.xml', name: 'test-catalog.xml', size: 'tiny' },
  { url: 'https://www.w3schools.com/xml/simple.xml', name: 'test-simple.xml', size: 'tiny' },
  { url: 'https://www.w3schools.com/xml/plant_catalog.xml', name: 'test-plants.xml', size: 'tiny' },
  
  // Small video samples (10-20 MB)
  { url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', name: 'test-video-1mb.mp4', size: 'small' },
  { url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4', name: 'test-video-2mb.mp4', size: 'small' },
  { url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4', name: 'test-video-5mb.mp4', size: 'medium' },
  
  // Web fonts
  { url: 'https://github.com/google/fonts/raw/main/ofl/roboto/static/Roboto-Regular.ttf', name: 'test-font-roboto.ttf', size: 'tiny' },
  { url: 'https://github.com/google/fonts/raw/main/ofl/opensans/static/OpenSans-Regular.ttf', name: 'test-font-opensans.ttf', size: 'tiny' },
  
  // Icon sets
  { url: 'https://github.com/FortAwesome/Font-Awesome/archive/refs/heads/6.x.zip', name: 'fontawesome-icons.zip', size: 'large' },
  
  // Sample documents
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip', name: 'test-sample.zip', size: 'tiny' },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/04/sample-text-file.txt', name: 'test-sample.txt', size: 'tiny' },
  
  // Different protocols and edge cases
  { url: 'https://httpbin.org/image/png', name: 'test-httpbin-png.png', size: 'tiny' },
  { url: 'https://httpbin.org/image/jpeg', name: 'test-httpbin-jpg.jpg', size: 'tiny' },
  { url: 'https://httpbin.org/image/webp', name: 'test-httpbin-webp.webp', size: 'tiny' },
  
  // API responses
  { url: 'https://api.github.com/repos/microsoft/vscode/releases/latest', name: 'test-github-api.json', size: 'tiny' },
  { url: 'https://api.github.com/users/github', name: 'test-github-user.json', size: 'tiny' },
  
  // Archive files
  { url: 'https://github.com/electron/electron-quick-start/archive/refs/heads/master.zip', name: 'electron-quickstart.zip', size: 'small' },
  { url: 'https://github.com/microsoft/TypeScript/archive/refs/heads/main.zip', name: 'typescript-source.zip', size: 'large' },
  
  // Additional varied content
  { url: 'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore', name: 'test-gitignore.txt', size: 'tiny' },
  { url: 'https://raw.githubusercontent.com/github/gitignore/main/Python.gitignore', name: 'test-python-gitignore.txt', size: 'tiny' },
];

console.log('='.repeat(60));
console.log('  SAM DOWNLOAD MANAGER - AUTOMATED TEST SUITE');
console.log('='.repeat(60));
console.log(`Starting ${testUrls.length} test downloads...`);
console.log('');

let completed = 0;
let failed = 0;
let inProgress = 0;

async function runTests() {
  if (!window.electronAPI) {
    console.error('ERROR: Electron API not available!');
    return;
  }

  console.log('Test Categories:');
  console.log('- Tiny files (< 1 MB): JSON, XML, TXT, CSV');
  console.log('- Small files (1-5 MB): Images, PDFs, Source code');
  console.log('- Medium files (5-10 MB): Audio samples, Videos');
  console.log('- Large files (10-50 MB): ZIP archives, Repositories');
  console.log('');

  const startTime = Date.now();

  // Add all downloads
  for (let i = 0; i < testUrls.length; i++) {
    const test = testUrls[i];
    try {
      console.log(`[${i + 1}/${testUrls.length}] Adding: ${test.name} (${test.size})`);
      await window.electronAPI.addDownload(test.url, { fileName: test.name });
      inProgress++;
      
      // Small delay to avoid overwhelming the system
      if (i % 5 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`  ✗ Failed to add: ${test.name}`, error.message);
      failed++;
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('ALL DOWNLOADS ADDED TO QUEUE');
  console.log('='.repeat(60));
  console.log(`Total Added: ${testUrls.length}`);
  console.log(`In Progress: ${inProgress}`);
  console.log('');
  console.log('Monitor the downloads in the UI!');
  console.log('Downloads will complete automatically.');
  console.log('');
  console.log('Check your Downloads folder for completed files.');
  console.log('='.repeat(60));

  // Monitor progress
  const checkInterval = setInterval(async () => {
    try {
      const downloads = await window.electronAPI.getAllDownloads();
      const stats = {
        downloading: downloads.filter(d => d.status === 'downloading').length,
        completed: downloads.filter(d => d.status === 'completed').length,
        error: downloads.filter(d => d.status === 'error').length,
        paused: downloads.filter(d => d.status === 'paused').length,
        waiting: downloads.filter(d => d.status === 'waiting').length,
      };

      console.log(`[Status] Downloading: ${stats.downloading} | Completed: ${stats.completed} | Errors: ${stats.error} | Waiting: ${stats.waiting}`);

      if (stats.completed + stats.error >= testUrls.length) {
        clearInterval(checkInterval);
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log('');
        console.log('='.repeat(60));
        console.log('  TEST SUITE COMPLETED!');
        console.log('='.repeat(60));
        console.log(`Total Time: ${duration} seconds`);
        console.log(`Successful: ${stats.completed}`);
        console.log(`Failed: ${stats.error}`);
        console.log(`Success Rate: ${((stats.completed / testUrls.length) * 100).toFixed(1)}%`);
        console.log('='.repeat(60));
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }, 3000);
}

// Run tests after a short delay to ensure UI is ready
setTimeout(runTests, 2000);
