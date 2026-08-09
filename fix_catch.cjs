const fs = require('fs');
const path = require('path');

const storeDir = path.join(__dirname, 'src', 'store');
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(storeDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  // Only replace catch { if it is immediately followed by throw error; or console.error(error) etc
  // Actually, we can just replace all "catch {" with "catch (error) {"
  content = content.replace(/catch \{/g, 'catch (error) {');
  fs.writeFileSync(filePath, content);
});
console.log('Fixed catch blocks');
