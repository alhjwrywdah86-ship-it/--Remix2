const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const master = 'src/assets/images/master_app_icon_1786633258284.jpg';

console.log('=== STARTING COMPLETE ANDROID APP ICON GENERATION ===');

// 1. Create Base Master PNG (1024x1024)
console.log('1. Generating Master PNGs (1024x1024)...');
execSync(`convert "${master}" -resize 1024x1024! public/app-icon.png`);
execSync(`cp public/app-icon.png assets/icon.png`);

// 2. Create Background Layer (Deep Blue #002D62 with radial glow)
console.log('2. Generating Adaptive Background Layer...');
execSync(`convert -size 1024x1024 radial-gradient:"#003d82"-"#001a3d" /tmp/master_bg.png`);

// 3. Create Foreground Layer (Transparent background with central golden mortarboard, orbital rings, Arabic calligraphy)
console.log('3. Generating Adaptive Foreground Layer...');
execSync(`convert "${master}" -fuzz 22% -transparent "#002d62" -fuzz 18% -transparent "#001b3e" -fuzz 18% -transparent "#00122e" /tmp/master_fg_raw.png`);
// Pad foreground inside 1024x1024 so all elements sit within safe zone (scaled to ~716x716)
execSync(`convert /tmp/master_fg_raw.png -resize 716x716 -background none -gravity center -extent 1024x1024 assets/icon-foreground.png`);
execSync(`cp assets/icon-foreground.png assets/icon-only.png`);

// 4. Generate Web Assets
console.log('4. Generating Web & PWA Icons...');
execSync(`convert public/app-icon.png -resize 180x180! public/apple-touch-icon.png`);
execSync(`convert public/app-icon.png -resize 192x192! public/pwa-192x192.png`);
execSync(`convert public/app-icon.png -resize 512x512! public/pwa-512x512.png`);
execSync(`convert public/app-icon.png -resize 48x48! public/favicon.ico`);

// 5. Generate Android Mipmap Buckets
console.log('5. Generating Android Mipmap DPI Buckets...');
const buckets = [
  { dir: 'mipmap-ldpi', roundSize: 36, adaptiveSize: 81 },
  { dir: 'mipmap-mdpi', roundSize: 48, adaptiveSize: 108 },
  { dir: 'mipmap-hdpi', roundSize: 72, adaptiveSize: 162 },
  { dir: 'mipmap-xhdpi', roundSize: 96, adaptiveSize: 216 },
  { dir: 'mipmap-xxhdpi', roundSize: 144, adaptiveSize: 324 },
  { dir: 'mipmap-xxxhdpi', roundSize: 192, adaptiveSize: 432 },
];

buckets.forEach(({ dir, roundSize, adaptiveSize }) => {
  const targetDir = path.join('android/app/src/main/res', dir);
  fs.mkdirSync(targetDir, { recursive: true });

  // ic_launcher.png (Legacy Square / Full)
  execSync(`convert public/app-icon.png -resize ${roundSize}x${roundSize}! "${path.join(targetDir, 'ic_launcher.png')}"`);

  // ic_launcher_round.png (Legacy Round with circular transparent mask)
  const half = roundSize / 2;
  execSync(`convert public/app-icon.png -resize ${roundSize}x${roundSize}! \\( +clone -threshold -1 -negate -fill white -draw "circle ${half},${half} ${half},0" \\) -alpha off -compose copy_opacity -composite "${path.join(targetDir, 'ic_launcher_round.png')}"`);

  // ic_launcher_background.png (Adaptive Background)
  execSync(`convert /tmp/master_bg.png -resize ${adaptiveSize}x${adaptiveSize}! "${path.join(targetDir, 'ic_launcher_background.png')}"`);

  // ic_launcher_foreground.png (Adaptive Foreground)
  execSync(`convert assets/icon-foreground.png -resize ${adaptiveSize}x${adaptiveSize}! "${path.join(targetDir, 'ic_launcher_foreground.png')}"`);
});

// Create 512x512 round legacy icon for Play Store / Root
execSync(`convert public/app-icon.png -resize 512x512! \\( +clone -threshold -1 -negate -fill white -draw "circle 256,256 256,0" \\) -alpha off -compose copy_opacity -composite public/ic_launcher_round_512.png`);

// 6. Generate Android TV Banner (320x180)
console.log('6. Generating Android TV Banner (320x180)...');
const tvDirs = ['android/app/src/main/res/drawable', 'android/app/src/main/res/drawable-xhdpi'];
tvDirs.forEach(d => {
  fs.mkdirSync(d, { recursive: true });
  execSync(`convert -size 320x180 radial-gradient:"#003d82"-"#001a3d" /tmp/tv_bg.png`);
  execSync(`convert public/app-icon.png -resize 160x160! /tmp/tv_icon.png`);
  execSync(`convert /tmp/tv_bg.png /tmp/tv_icon.png -gravity center -composite "${path.join(d, 'banner.png')}"`);
});

// Also sync assets into android assets folder if it exists
const androidAssetsPublic = 'android/app/src/main/assets/public';
if (fs.existsSync(androidAssetsPublic)) {
  console.log('Syncing assets to android assets folder...');
  execSync(`cp public/app-icon.png "${androidAssetsPublic}/app-icon.png"`);
  execSync(`cp public/apple-touch-icon.png "${androidAssetsPublic}/apple-touch-icon.png"`);
  execSync(`cp public/favicon.ico "${androidAssetsPublic}/favicon.ico"`);
  execSync(`cp public/pwa-192x192.png "${androidAssetsPublic}/pwa-192x192.png"`);
  execSync(`cp public/pwa-512x512.png "${androidAssetsPublic}/pwa-512x512.png"`);
}

console.log('=== ANDROID ASSET GENERATION COMPLETE ===');
