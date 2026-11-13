// =========================================================================
// BIRTHDAY EXPERIENCE CONFIGURATION
// All user-customizable text, media paths, and options are stored here.
// Simply edit this file to personalize the experience for your special person!
// =========================================================================

export const config = {
  // Recipient's name displayed in Scene 1, Scene 3, and greetings
  recipientName: "B",

  // Sender's name / signature in the final scene
  senderName: "V",

  // Background music file path (place file in public/music.mp3)
  musicSrc: "/music.mp3",

  // Video message file path (place file in public/nuke.mp4)
  videoSrc: "/nuke.mp4",

  // SCENE 1: Split Heart Settings
  scene1: {
    instructions: "Drag both heart halves together",
    glowColor: "#ff4d6d",
    burstTitle: "Happy Birthday,",
    continueButton: "Begin Our Journey",
  },

  // SCENE 2: Cake with Candle Settings
  scene2: {
    title: "A Moment Just for You",
    instruction: "Touch the flame to blow it out",
    makeAWishText: "Close your eyes & make a wish...",
    wishGrantedText: "Your wish is floating into the universe.",
    continueButton: "Next Memory",
  },

  // SCENE 3: The Sealed Letter
  scene3: {
    envelopeSealText: "OPEN ME",
    letterSalutation: "To my favourite B,",
    letterParagraphs: [
      "Happy 21st Birthday! I am beyond overjoyed to be celebrating this special day with you and I am so proud of you! Your accomplishments, the person you have become and how you have impacted so many peoples lives. Even if you don’t always see it, I do. And I think I am one of the best examples of this.",
      "Life hasn’t always been easy for you and there will be times where it takes more strength to get through each day. However I have always believed that good things come to those who wait. All the struggles you go through, the hard work and small battles you fight each day will lead you to something beautiful that you couldn’t even imagine.",
      "I really hope that one day you get to be as happy and peaceful as you deserve. I hope life brings you some beautiful surprises and smiles that don’t require any fighting. I am truly grateful to have you in my life and I hope you know how proud I am of you.",
      "No matter what happens, even if you feel like everyone has left you, I will always be here for you. You will never have to doubt that. Happy 21st Birthday, Baby. I hope that this year is a little easier for you. Get you closer to everything you dream of and brings you all the happiness you deserve!"
    ],
    letterClosing: "Forever yours,",
    letterSignature: "With all my love",
    continueButton: "Look Back With Me",
  },

  // SCENE 4: Photo Gallery on Twinkling String Lights
  // Then, Now, & Always: Row 1 for her earlier memories, Row 2 for her recent moments!
  scene4: {
    title: "Then, Now, & Always",
    photos: [
      {
        id: 1,
        src: "/album/1.jpeg",
        caption: "Little moments that started it all ✨",
        date: "Sweet beginnings"
      },
      {
        id: 2,
        src: "/album/2.jpeg",
        caption: "That pure, timeless smile 🌸",
        date: "Through the years"
      },
      {
        id: 3,
        src: "/album/3.jpeg",
        caption: "Growing more beautiful every day 💫",
        date: "Golden memories"
      },
      {
        id: 4,
        src: "/album/4.jpeg",
        caption: "Every adventure is better with you 🗺️",
        date: "Cherished moments"
      },
      {
        id: 5,
        src: "/album/5.jpeg",
        caption: "Lighting up every room you walk into 🌟",
        date: "Pure joy"
      },
      {
        id: 6,
        src: "/album/6.jpeg",
        caption: "Here's to you at 21, and forever after 🥂",
        date: "Forever & always"
      }
    ],
    continueButton: "A Special Message",
  },

  // SCENE 5: Video Message Settings
  scene5: {
    title: "A Message From The Heart",
    subtitle: "Turn up your volume & watch this",
    poster: "", // Optional poster image path or blank
    unmutePrompt: "Tap to unmute 🔊",
    continueButton: "One Last Thing",
  },

  // SCENE 6: Emotional Final Message
  scene6: {
    title: "Happy Birthday!",
    finalMessage: [
      "May every dream you hold softly in your heart find its wings this year.",
      "Today, tomorrow, and every day after that, I am cheering for you."
    ],
    signature: "Yours Always,",
    authorName: "V",
    replayButton: "Relive The Story",
  }
};

