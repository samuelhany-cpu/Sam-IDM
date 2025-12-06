// Progress Monitor Script - Run this in the test runner console
// This will provide detailed progress updates

console.log('\n🔍 STARTING DETAILED PROGRESS MONITOR\n');

let monitorInterval = setInterval(async () => {
  try {
    const downloads = await window.electronAPI.getAllDownloads();
    
    const stats = {
      total: downloads.length,
      downloading: downloads.filter(d => d.status === 'downloading'),
      completed: downloads.filter(d => d.status === 'completed'),
      error: downloads.filter(d => d.status === 'error'),
      waiting: downloads.filter(d => d.status === 'waiting'),
      paused: downloads.filter(d => d.status === 'paused'),
    };

    console.log('\n' + '='.repeat(70));
    console.log(`⏰ ${new Date().toLocaleTimeString()}`);
    console.log('='.repeat(70));
    console.log(`📊 OVERALL STATS:`);
    console.log(`   Total: ${stats.total} | Active: ${stats.downloading.length} | Waiting: ${stats.waiting.length}`);
    console.log(`   ✅ Completed: ${stats.completed.length} | ❌ Failed: ${stats.error.length}`);
    console.log(`   Success Rate: ${((stats.completed.length / stats.total) * 100).toFixed(1)}%`);
    
    if (stats.downloading.length > 0) {
      console.log(`\n📥 ACTIVE DOWNLOADS:`);
      stats.downloading.forEach(d => {
        const speed = (d.speed / 1024 / 1024).toFixed(2);
        console.log(`   • ${d.fileName}: ${d.progress.toFixed(1)}% @ ${speed} MB/s`);
      });
    }

    if (stats.error.length > 0) {
      console.log(`\n❌ FAILED DOWNLOADS:`);
      stats.error.forEach(d => {
        console.log(`   • ${d.fileName}: ${d.error || 'Unknown error'}`);
      });
    }

    if (stats.waiting.length > 0 && stats.waiting.length <= 10) {
      console.log(`\n⏳ NEXT IN QUEUE (${stats.waiting.length}):`);
      stats.waiting.slice(0, 5).forEach(d => {
        console.log(`   • ${d.fileName}`);
      });
      if (stats.waiting.length > 5) {
        console.log(`   ... and ${stats.waiting.length - 5} more`);
      }
    }

    // Check if all done
    if (stats.completed.length + stats.error.length >= stats.total) {
      console.log('\n' + '='.repeat(70));
      console.log('🎉 TEST SUITE COMPLETED!');
      console.log('='.repeat(70));
      console.log(`✅ Successful: ${stats.completed.length}/${stats.total}`);
      console.log(`❌ Failed: ${stats.error.length}/${stats.total}`);
      console.log(`📈 Success Rate: ${((stats.completed.length / stats.total) * 100).toFixed(1)}%`);
      console.log('='.repeat(70));
      
      clearInterval(monitorInterval);
      
      if (stats.error.length > 0) {
        console.log('\n📋 DETAILED ERROR REPORT:');
        stats.error.forEach((d, i) => {
          console.log(`\n${i + 1}. ${d.fileName}`);
          console.log(`   URL: ${d.url}`);
          console.log(`   Error: ${d.error}`);
        });
      }
    }

  } catch (error) {
    console.error('Monitor error:', error);
  }
}, 5000); // Update every 5 seconds

console.log('✅ Monitor started - Updates every 5 seconds\n');
