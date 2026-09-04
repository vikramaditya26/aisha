/* ============================================================================
   content.js — THE ONLY FILE YOU NEED TO EDIT
   ----------------------------------------------------------------------------
   PHOTOS ARE AUTOMATIC. Each memory names a day, like day:"2026-08-23", and
   picks up every photo taken that day.  pick:[1,3] uses only the 1st and 3rd.
   To add photos: put them in incoming/, run  python3 scripts/import.py
   ==========================================================================*/

window.CONTENT = {

  config: { name: "Aisha", hideFromGoogle: false },

  /* ---- the opening title card ------------------------------------------ */
  intro: { word: "AISHA", tap: "Tap to start", line: "Happy birthday, Aisha" },

  profiles: {
    heading: "Who's watching?",
    people: [
      { name:"Aisha",  color:"#E50914", enters:true, avatar:"photos/2026-08-30-193707.jpg" },
      { name:"Aditya", color:"#2E77D0", enters:true, avatar:"photos/2026-08-30-194636.jpg" },
      { name:"Us",     color:"#D9A441", enters:true, avatar:"photos/2026-08-26-212910.jpg" }
    ]
  },

  billboard: { tag:"Season Finale", id:"dhaba" },

  moments: [

    { id:"uniqlo", day:"2026-07-27", date:"27 July", year:"2026",
      title:"Uniqlo, Then Anand", place:"Uniqlo · Anand", match:"92% Match",
      duration:"An evening", tags:["Shopping","Food"],
      story:"You picked out things I would never have chosen for myself, and you were right about every one of them. Then Anand, and we sat there long enough that they started wanting the table back." },

    { id:"lake1", day:"2026-08-02", to:"1800", date:"2 August", year:"2026",
      title:"The Lake", place:"The lake", match:"95% Match",
      duration:"An afternoon", tags:["Outdoors"],
      story:"We didn't do anything at the lake. We sat, the afternoon went, and neither of us suggested leaving. I've been there plenty of times without you and I couldn't tell you a single thing about any of those." },

    { id:"meghana", day:"2026-08-02", from:"2200", date:"2 August", year:"2026",
      title:"Biryani At Meghana", place:"Meghana Foods", match:"94% Match",
      duration:"Late", tags:["Food"],
      story:"Same day, much later. I kept trying to get one decent photo of the two of us and you kept moving. We got one. It's the one where you're laughing at me for trying." },

    { id:"balcony", day:"2026-08-08", to:"1800", date:"8 August", year:"2026",
      title:"The Balcony", place:"The balcony", match:"97% Match",
      badge:"TOP 10", duration:"Before we went out", tags:["Best Of"],
      story:"Late afternoon on the balcony, before we went anywhere. Nothing to do, nowhere to be yet, and the light was doing something good. I have looked at these more than almost anything else on this page." },

    { id:"pizzabakery", day:"2026-08-08", from:"1900", date:"8 August", year:"2026",
      title:"Pizza Bakery", place:"Pizza Bakery", match:"98% Match",
      duration:"A long evening", tags:["Food","Best Of"],
      story:"We left the balcony and went straight to Pizza Bakery, and these run from the walk over to the very end of the night. Somewhere in the middle of it I remember thinking that I would want to come back to this evening one day. This whole page is that thought, followed through." },

    { id:"aug09", day:"2026-08-09", date:"9 August", year:"2026",
      title:"The Angry One", place:"—", match:"90% Match",
      duration:"A morning", tags:["Ordinary Days"],
      title2:"", story:"One photo, taken for no reason at all, of you being annoyed about something neither of us could name afterwards. It is one of my favourite photographs of you and I have never been able to explain why." },

    { id:"fight", day:"2026-08-15", date:"15 August", year:"2026",
      title:"The Big Fight", place:"Outside the house", match:"81% Match",
      badge:"NOT A CUT", duration:"A whole day", tags:["The Hard Parts"],
      story:"We had a real one on the fifteenth, and it took the whole day to get out the other side of it.\n\nIt's in here because a page with only the good days would be a lie about us. These were taken that night, after. Look at our faces — it was already over. That's the part I'm proud of. Not that we don't fight. That we have never once left one unfinished." },

    { id:"aug16", day:"2026-08-16", date:"16 August", year:"2026",
      title:"Waiting For An Auto", place:"Outside our house", match:"96% Match",
      badge:"TOP 10", duration:"The morning after", tags:["Best Of"],
      story:"The morning after the fight, outside our house, waiting for an auto that was taking its time. You kissed me while we waited.\n\nOf everything on this page, this is the one I would keep as proof. The day before had been the worst one we have had, and here we are the next morning, in the street, completely fine." },

    { id:"aug22", day:"2026-08-22", date:"22 August", year:"2026",
      title:"The Lake, The Room, The Auto", place:"The lake · home · the back of an auto",
      match:"93% Match", duration:"All day", tags:["Outdoors","Ordinary Days"],
      videos:["videos/web/2026-08-22-auto-masti.mp4"],
      story:"A day that moved around. The lake first, then back to the room, then poker, then an auto somewhere with the two of us behaving like people with nowhere to be. Someone got annoyed somewhere in the middle of it and I am fairly sure it was not me.\n\nWatch the video with the sound on." },

    { id:"churchstreet", day:"2026-08-23", date:"23 August", year:"2026",
      title:"Ramen, Ice Cream, Pav Bhaji", place:"Church Street · Westside",
      match:"96% Match", duration:"A whole afternoon", tags:["Food","Shopping"],
      videos:["videos/web/2026-08-23-church-street.mp4","videos/web/2026-08-23-pav-bhaji.mp4"],
      story:"Church Street, and an afternoon that refused to end. You had ramen, I had ice cream, there was pav bhaji somewhere in the middle, and neither of us ever admitted the other had ordered better. Westside after. One of the easiest days we've had." },

    { id:"aug24", day:"2026-08-24", date:"24 August", year:"2026",
      title:"The Note On The Mirror", place:"Home", match:"100% Match",
      badge:"TOP 10", duration:"One photo", tags:["Best Of"],
      story:"I was not home. You left a note stuck to the mirror before you went.\n\n\u201cBye bye, love you, miss me darling.\u201d\n\nOne photograph, and it is the only thing on this entire page that I did not take of you. You made it for me to find. I found it." },

    { id:"birthday", day:"2026-08-26", skip:["173359","213233","213329"],
      date:"26 August", year:"2026",
      title:"My Birthday. Yours, Really.", place:"—", match:"100% Match",
      badge:"SPECIAL", duration:"All day", tags:["Best Of","Why This Exists"],
      videos:["videos/web/2026-08-26-birthday.mp4"],
      story:"You brought chocolates. You brought flowers. You brought a cake. You bought me clothes and then wore the matching one, so it looked like we had planned it, and somehow we had.\n\nWe took photos together outside our house in the evening, went to Meghana for dinner, and came back and took more with the bouquet you had carried around all day.\n\nI did not do a single thing that day. You did all of it, and then behaved as though it was nothing worth mentioning. That is the day this started." },

    { id:"poker", day:"2026-08-29", date:"29 August", year:"2026",
      title:"Poker, And One Furious Face", place:"Poker night",
      match:"91% Match", duration:"A few hands too many", tags:["The Hard Parts"],
      story:"You lost. You were properly annoyed about it. And you looked so good annoyed that I took a photograph instead of saying anything comforting. I would do it again." },

    { id:"thyme", day:"2026-08-30", date:"30 August", year:"2026",
      title:"Thyme & Whisk, Then Poker Again", place:"Thyme & Whisk",
      match:"94% Match", badge:"NEW", duration:"Dinner, and then some",
      tags:["Food"],
      videos:["videos/web/2026-08-30-thyme-whisk.mp4","videos/web/2026-08-30-poker.mp4"],
      story:"Dinner first. Most of these are of one of us rather than both, which is what happens when the food is good enough to stop the conversation.\n\nThen poker again, because apparently the twenty-ninth had settled nothing." },

    { id:"dhaba", day:"2026-08-31", date:"31 August", year:"2026",
      title:"Sadda Punjabi Dhaba", place:"Sadda Punjabi Dhaba",
      match:"100% Match", badge:"NEW", duration:"Until very late",
      tags:["Food","Best Of"],
      videos:["videos/web/2026-08-31-dhaba.mp4"],
      story:"The last time I saw you, and the best photographs we have. If I could keep one night out of all of this, it would be this one. It's on the front page for a reason." }
  ],

  rows: [
    { title:"Continue Watching for Aisha", kind:"moments", progress:true,
      ids:["dhaba","thyme","poker","birthday"] },

    { title:"New Releases", kind:"moments",
      ids:["dhaba","thyme","poker","birthday","aug24","churchstreet","aug22"] },

    { title:"Top 10 Moments This Year", kind:"moments", ranked:true,
      ids:["dhaba","birthday","aug24","aug16","balcony","pizzabakery",
           "churchstreet","aug22","meghana","fight"] },

    { title:"The Early Seasons", kind:"childhood" },

    { title:"Because You Like Eating Out", kind:"moments",
      ids:["dhaba","thyme","pizzabakery","meghana","churchstreet","uniqlo"] },

    { title:"Quiet Episodes, No Plot", kind:"moments",
      ids:["lake1","aug09","balcony","meghana","uniqlo"] },

    { title:"Watch The Whole Story, In Order", kind:"moments",
      ids:["uniqlo","lake1","meghana","balcony","pizzabakery","aug09","fight",
           "aug16","aug22","churchstreet","aug24","birthday","poker","thyme","dhaba"] },

    { title:"The Long-Distance Episodes", kind:"videocalls" }
  ],

  childhood: { subtitle:"Before my time", captions:[] },

  videocalls: { subtitle:"On a call" },

  letter: {
    label: "After Credits",
    title: "One Last Thing",
    body: [
      "You brought chocolates. You brought flowers. You brought a cake, and clothes you had picked out for me, and then you stood there and said it was nothing.",
      "So I made you this. Everything I have of us, in order, from April right through to last week.",
      "The ones I keep coming back to are the quiet ones. A morning where nothing happened. An ordinary afternoon. Something very late that I still can't explain to you. I saved every single one of those without ever deciding to.",
      "You are the person my ordinary days are about now. That is the whole thing.",
      "Happy birthday, Aisha."
    ],
    photos: ["photos/2026-08-26-212910.jpg","photos/2026-08-26-213128.jpg",
             "photos/2026-08-26-170820.jpg","photos/2026-08-26-213640.jpg"],
    signoff: "From Vikram Aditya, with love.",
    renew: {
      label: "Start the next chapter",
      done: "Chapter two",
      message: "Chapter two starts today. Same two people, more restaurants, more photographs of nothing at all. I will show you the whole thing again on your next birthday."
    }
  }
};
