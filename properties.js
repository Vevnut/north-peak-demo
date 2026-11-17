/* North Peak Stays: the one place each home is described.
 *
 * The page builds the Stay menu, the Our Homes tabs and panels, the footer list and the
 * photo galleries from this file. To add a home: copy an entry, give it a new id, add its
 * photos, then run  node scripts/check-properties.mjs  before pushing.
 *
 * status
 *   "bookable"  open, booked online through booking.url
 *   "text"      open, booked by text message
 *   "upcoming"  shown with "Coming soon" (or its approved opening date), never a booking button
 *   "hidden"    kept here but not shown
 *
 * approved
 *   Booking links, the texting number and opening dates show on the launched site only when
 *   approved is true (the owner has confirmed them). Previews show them either way so the
 *   demo stays complete; add ?as=live to a preview address to see exactly what launch shows.
 */
window.NP_SITE = {
  // Hostnames of the launched site, e.g. the owner's domain. Empty until launch day.
  liveHosts: [],
  // Number guests text to book or ask about dates.
  text: { number: "+16178160401", approved: false },
  // Booking links must point to one of these hosts (checked by scripts/check-properties.mjs).
  bookingHosts: ["checkout.lodgify.com"]
};

window.NP_PROPERTIES = [
  {
    id: "mountain-view",
    name: "Mountain View A-Frame",
    status: "bookable",
    bedrooms: 5, baths: 4, beds: 9, sleeps: 13, sqft: null,
    summary: "A stunning A-frame with soaring 30-foot ceilings and dramatic floor-to-ceiling windows. Take in the mountain views, soak in the private hot tub, and unwind on the deck under the stars. Perfect for groups and families.",
    features: ["Private hot tub", "Mountain views", "Fire pit", "Pets welcome", "Dedicated workspace", "Full kitchen"],
    booking: { url: "https://checkout.lodgify.com/en/northpeakstay/807795/reservation?currency=USD", approved: false },
    // Old Lodgify page; shown on previews only, since it stops working once the domain moves.
    detailsUrl: "https://staynorthpeak.com/en/overview",
    photos: {
      kind: "photo",
      coverAlt: "Mountain View A-Frame open living room and kitchen",
      // Still loaded from Lodgify's image server; self-host before launch.
      files: [
        "https://l.icdbcdn.com/oh/0a457e9b-28a5-460c-a73a-d70fccd644e0.jpg",
        "https://l.icdbcdn.com/oh/457673a0-8f9e-4c7e-a39f-36dfade7089e.png",
        "https://l.icdbcdn.com/oh/0ec39ae9-a05d-4fa8-b776-dffee859578c.jpg",
        "https://l.icdbcdn.com/oh/c007a647-62ab-4860-83cb-efed7e58149a.jpg",
        "https://l.icdbcdn.com/oh/b0db1a34-1133-4e75-8c3f-ccbe2547d116.jpg",
        "https://l.icdbcdn.com/oh/ca70dad3-6e9d-4e11-b603-70d28cc43b9f.jpg",
        "https://l.icdbcdn.com/oh/fff5d14a-1169-405a-b11f-c849669c79c4.jpg",
        "https://l.icdbcdn.com/oh/63b64c13-b69e-418d-840e-e2665bdc7ea6.jpg",
        "https://l.icdbcdn.com/oh/f328b934-9703-4cee-b66d-14a6de54cef8.jpg",
        "https://l.icdbcdn.com/oh/13f64337-a30a-4a7e-9a82-dde8c28f2fca.jpg",
        "https://l.icdbcdn.com/oh/48bd37e6-d47c-4c69-a490-d0ac3907d9ad.jpg",
        "https://l.icdbcdn.com/oh/85a095ac-0c10-4ecf-b95c-8f6e112946a3.jpg",
        "https://l.icdbcdn.com/oh/b19a900f-c66f-45a5-8436-9f4433e6ed9e.jpg",
        "https://l.icdbcdn.com/oh/0b1a36d4-4dcc-400f-a9b7-3c6a5ca31dc4.jpg",
        "https://l.icdbcdn.com/oh/a4594eef-8d31-4dbb-b188-ec64a9070331.jpg",
        "https://l.icdbcdn.com/oh/bc01bc2a-81d9-45b7-8b1a-49e34a270d4a.jpg",
        "https://l.icdbcdn.com/oh/99cbd37a-1bd2-441f-a36a-ea6140d8265e.jpg",
        "https://l.icdbcdn.com/oh/3a0c1c93-a737-4c69-8f50-fe425328776b.jpg",
        "https://l.icdbcdn.com/oh/219a4248-4aac-4cc8-a346-53c84b0575f6.jpg",
        "https://l.icdbcdn.com/oh/627c1f32-7bb0-4ccb-a72d-8f2f93b583b3.jpg",
        "https://l.icdbcdn.com/oh/0f6d8347-7736-4f63-ab4d-d7309a3694a7.jpg",
        "https://l.icdbcdn.com/oh/36009815-5567-4f86-a07f-c782921a08a0.jpg",
        "https://l.icdbcdn.com/oh/a19ecd7e-5512-4e06-9cae-1cc7913f7bc8.jpg",
        "https://l.icdbcdn.com/oh/4068b73d-a33d-4ca3-a8ca-80e364b5cb6a.jpg",
        "https://l.icdbcdn.com/oh/e5fe16d8-5c56-437e-92ff-8df6c74eb388.jpg",
        "https://l.icdbcdn.com/oh/39031d2c-b077-416f-a345-90023b3dc58a.jpg",
        "https://l.icdbcdn.com/oh/90d0c313-ca38-4c45-8fbd-cf6d9ae902d9.jpg",
        "https://l.icdbcdn.com/oh/3ded2fee-5eed-4348-9789-805ed3a20a54.jpg",
        "https://l.icdbcdn.com/oh/70347e08-ee3f-47e0-b5b1-a41321b49c1d.jpg",
        "https://l.icdbcdn.com/oh/193707bc-a9b4-41f3-9f1c-b3de214b1ab5.jpg",
        "https://l.icdbcdn.com/oh/c54fe991-0dfa-4938-bc46-c1687a16ba75.jpg",
        "https://l.icdbcdn.com/oh/c9e21fe3-911f-4897-9ab7-481a676a1105.jpg",
        "https://l.icdbcdn.com/oh/b65b8908-580e-4b72-b050-c0000bc8db09.jpg",
        "https://l.icdbcdn.com/oh/4b6d0c98-018f-4e64-933a-4ffc536d0d0b.jpg",
        "https://l.icdbcdn.com/oh/46c58b12-c5fd-4477-87a7-f43865153b89.jpg",
        "https://l.icdbcdn.com/oh/62cb3351-eca4-428c-b3ec-14e8607f7488.jpg",
        "https://l.icdbcdn.com/oh/272d7f34-9e7b-46f7-925b-aff01bb4f643.jpg",
        "https://l.icdbcdn.com/oh/0b994070-eb8d-4a2e-b3f1-b8b3c13df750.jpg",
        "https://l.icdbcdn.com/oh/a1d17a46-ff41-455c-9206-9b65bce73fc5.jpg",
        "https://l.icdbcdn.com/oh/77f04551-8267-4f61-8705-98aaec08e97d.jpg",
        "https://l.icdbcdn.com/oh/b53ce5bb-a85b-48d7-9807-e3b9fd401d84.jpg"
      ]
    }
  },
  {
    id: "forest",
    name: "Forest A-Frame",
    status: "text",
    bedrooms: 5, baths: 4, sqft: 4000,
    summary: "Our largest home, tucked into the trees with a sauna, hot tub and a playground for the kids. Made for big family trips and friends' weekends.",
    features: ["Sauna", "Hot tub", "Kids playground", "Fire pit", "Outdoor living space", "4,000 sq ft"],
    booking: null,
    detailsUrl: "https://staynorthpeak.com/en/custom-page-name",
    photos: { kind: "rendering", files: [
      "img/homes/forest-1.jpg",
      "img/homes/forest-2.jpg",
      "img/homes/forest-3.jpg",
      "img/homes/forest-4.jpg",
      "img/homes/forest-5.jpg",
      "img/homes/forest-6.jpg"
    ] }
  },
  {
    id: "barn",
    name: "Modern Barn",
    status: "upcoming",
    opening: { label: "Opening December 2026", approved: false },
    bedrooms: 3, baths: 3, sqft: 2000,
    summary: "A clean-lined modern barn with a private hot tub, fire pit and playground, sized just right for two families sharing a getaway.",
    features: ["Private hot tub", "Fire pit", "Kids playground", "Outdoor living space"],
    textAboutDates: true,
    detailsUrl: "https://staynorthpeak.com/en/custom-page-name1",
    photos: { kind: "rendering", files: [
      "img/homes/barn-1.jpg",
      "img/homes/barn-2.jpg",
      "img/homes/barn-3.jpg",
      "img/homes/barn-4.jpg",
      "img/homes/barn-5.jpg",
      "img/homes/barn-6.jpg",
      "img/homes/barn-7.jpg"
    ] }
  },
  {
    id: "cozy",
    name: "Cozy Barn Cabin",
    status: "upcoming",
    opening: { label: "Opening December 2026", approved: false },
    bedrooms: 2, baths: 2, sqft: 1200,
    summary: "A warm, wood-lined cabin for couples or a small family, with its own hot tub and a fire pit for long mountain evenings.",
    features: ["Private hot tub", "Fire pit", "Outdoor living space", "1,200 sq ft"],
    textAboutDates: true,
    detailsUrl: "https://staynorthpeak.com/en/cozy-barn-cabin",
    photos: { kind: "rendering", files: [
      "img/homes/cozy-1.jpg",
      "img/homes/cozy-2.jpg",
      "img/homes/cozy-3.jpg",
      "img/homes/cozy-4.jpg",
      "img/homes/cozy-5.jpg"
    ] }
  },
  {
    id: "half",
    name: "Half A-Frame",
    status: "upcoming",
    opening: { label: "Opening December 2026", approved: false },
    bedrooms: 2, baths: 1, sqft: 800,
    summary: "A striking half A-frame with big glass and a small footprint: an easy, romantic escape with a hot tub just outside the door.",
    features: ["Private hot tub", "Fire pit", "Outdoor living space", "800 sq ft"],
    textAboutDates: true,
    detailsUrl: "https://staynorthpeak.com/en/half-a-frame-2b1b",
    photos: { kind: "rendering", files: [
      "img/homes/half-1.jpg",
      "img/homes/half-2.jpg",
      "img/homes/half-3.jpg",
      "img/homes/half-4.jpg",
      "img/homes/half-5.jpg",
      "img/homes/half-6.jpg"
    ] }
  }
];
