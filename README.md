# 🎂 Cinematic Interactive Birthday Website

A mobile-first, single-page birthday experience crafted with **React**, **Vite**, **Framer Motion**, and **Canvas Confetti**. Features a warm, cinematic dark navy night sky theme with glowing gold and soft rose pink accents.

---

## ✨ Features & Scene Flow

The experience consists of a sequence of **6 unlockable scenes**, accompanied by ambient floating stars, sparkles, and a persistent background music player.

1. **Scene 1 — Split Heart**:
   - Two halves of a glowing heart placed apart on the left and right.
   - Drag either half (or tap) toward the center with Pointer Events.
   - Magnetic pull draws them together with haptic vibration feedback.
   - Snaps into a whole heart with a glowing burst and celebratory confetti.
   - Animated letter-by-letter reveal of *"Happy Birthday, [NAME]!"*.

2. **Scene 2 — Cake with Candle**:
   - Illustrated birthday cake with a lit candle and flickering animated flame.
   - Interactive touch target to blow out the candle flame.
   - Puff of smoke animation, ambient scene dimming, and *"Make a wish..."*.
   - Confetti shower and *"Your wish is on its way."*.

3. **Scene 3 — Sealed Love Letter**:
   - 3D envelope with a wax seal stamped with a heart.
   - Tap seal to break it: envelope flap folds open in 3D perspective (`rotateX`).
   - The letter slides up and smoothly expands into an elegant card.
   - Staggered line-by-line reveal of your personalized message.

4. **Scene 4 — Photo Gallery on String Lights**:
   - Hanging catenary wire with glowing, twinkling fairy light bulbs.
   - Polaroid-style photo frames (3:4 ratio) with clips and a gentle pendulum sway.
   - Responsive layout for desktop and mobile devices without horizontal overflow.
   - Tap any photo to open it in an enlarged lightbox with date and caption.

5. **Scene 5 — Video Message**:
   - Gold-framed video player embedding `/public/nuke.mp4`.
   - Smart autoplay: tries playing with sound first; gracefully falls back to muted autoplay with a floating *"Tap to unmute 🔊"* pill, or a big play button.
   - Integrated playback controls (play/pause, mute, timeline scrubber, fullscreen).
   - Automatically transitions or shows a continue button when finished.

6. **Scene 6 — Final Message & Floating Lanterns**:
   - Emotional closing with warm sky lanterns slowly drifting into the night sky.
   - Gentle falling stardust & confetti.
   - Elegant fade-in of your heartfelt closing message and custom signature.
   - *"Relive The Story"* replay button that resets back to Scene 1.

---

## 🚀 How to Run Locally

### Quick Launch (Windows 1-Click)
Simply **double-click** either file in the project folder:
- **`host_website.bat`** (or **`start.bat`**)

This will automatically:
1. Verify Node.js is installed.
2. Install any missing dependencies if needed.
3. Start the hosting server with local and Wi-Fi network access.
4. Automatically open your default web browser to the site.

---

### Manual Launch via Terminal
1. **Clone or navigate to the project directory**:
   ```bash
   cd "d:\2. Projects\bday2026"
   ```

2. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser or phone on the same Wi-Fi.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎨 How to Personalize (One Single File)

All text, names, dates, photo lists, and captions can be edited in:
📂 **[`src/config.js`](./src/config.js)**

```javascript
export const config = {
  recipientName: "Maya",           // Name shown in greeting and title
  senderName: "Yours Always",      // Signature in final scene
  musicSrc: "/music.mp3",          // Background music file
  videoSrc: "/nuke.mp4",           // Video file

  scene1: { ... },                 // Split heart settings
  scene2: { ... },                 // Cake & candle settings
  scene3: {                        // Letter message
    letterParagraphs: [
      "Your first heartfelt paragraph...",
      "Your second heartfelt paragraph...",
    ]
  },
  scene4: {                        // Photo gallery
    photos: [
      { id: 1, src: "/photos/photo1.jpg", caption: "Our first trip ✨", date: "July 2024" },
      { id: 2, src: "/photos/photo2.jpg", caption: "Sunset walk 🌅", date: "August 2024" },
    ]
  },
  scene6: {                        // Final emotional closing
    finalMessage: [
      "Closing line 1...",
      "Closing line 2..."
    ],
    authorName: "Alex"
  }
};
```

---

## 📁 Media File Locations

- **Photos**: Place your photos inside `public/photos/` named:
  - `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`, `photo6.jpg`
  *(Or adjust the filenames/paths in `src/config.js`).*
- **Video Message**: Place your video at:
  - `public/nuke.mp4` *(Already loaded and ready).*
- **Background Music**: Place an audio file at:
  - `public/music.mp3`
  *(Note: If no audio file is provided, an ambient music-box chime will automatically play as a fallback).*

---

## 🌐 How to Deploy for Free

### Option 1: Vercel (Easiest & Fastest)
1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **"Deploy"**. Your website will be live in 30 seconds!

### Option 2: Netlify
1. Run `npm run build` locally.
2. Go to [netlify.com](https://netlify.com) and drag-and-drop the generated `dist` folder into Netlify Drop.
3. Or link your GitHub repo with build command `npm run build` and publish directory `dist`.

---

Happy Birthday! 🎈

