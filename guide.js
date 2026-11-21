/* North Peak Stays: the local guide, the one place each spot is described.
 *
 * The homepage's local guide (its tabs) and the guide pages (/guide/<slug>, built by
 * scripts/build-homes.mjs) both come from this file. After editing it, run
 *   node scripts/build-homes.mjs  and  node scripts/check-properties.mjs
 *
 * Each category: id, label (its tab), slug and heading (its page), intro (the page's opening).
 * Each spot: name, tag, text, where (drive time and town), link {href, label}, and optionally
 * photo + photoAlt (with credit {place, author, source, license} for photos we didn't take)
 * and logo + logoAlt (ski areas). Spots without a photo show an icon.
 */
window.NP_GUIDE = [
  {
    "id": "ski",
    "slug": "ski-mountains-near-campton-nh",
    "heading": "Ski mountains near Campton, NH",
    "intro": "Four ski areas are within about 35 minutes of North Peak, from an easygoing local hill for first-timers to big-mountain terrain for experts. Here is how they compare.",
    "label": "Ski mountains",
    "spots": [
      {
        "name": "Waterville Valley Resort",
        "tag": "All ages",
        "text": "Family-friendly trails, lessons for every level and night skiing, with a full resort village at the base.",
        "where": "About 20 min · Waterville Valley",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Waterville+Valley+Resort+NH",
          "label": "Map"
        },
        "photo": "img/guide/waterville.jpg",
        "photoAlt": "Waterville Valley Resort base area and slopes",
        "logo": "img/guide/logo-waterville.png",
        "logoAlt": "Waterville Valley Resort logo",
        "credit": {
          "place": "Waterville Valley",
          "author": "EgorovaSvetlana",
          "source": "https://commons.wikimedia.org/wiki/File:Waterville_Valley_Resort_view.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "Loon Mountain",
        "tag": "All ages",
        "text": "Big-mountain skiing across three peaks with a scenic gondola, plus summer adventures when the snow melts.",
        "where": "About 25 min · Lincoln",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Loon+Mountain+Resort+Lincoln+NH",
          "label": "Map"
        },
        "photo": "img/guide/loon.jpg",
        "photoAlt": "Chairlift on Loon Mountain's North Peak in winter",
        "logo": "img/guide/logo-loon.png",
        "logoAlt": "Loon Mountain logo",
        "credit": {
          "place": "Loon Mountain",
          "author": "Luinfana",
          "source": "https://commons.wikimedia.org/wiki/File:Loonmtn_northpeak.JPG",
          "license": "public domain"
        }
      },
      {
        "name": "Tenney Mountain",
        "tag": "Families",
        "text": "A laid-back local hill with snow tubing and terrain parks, a great pick for beginners and young kids.",
        "where": "About 20 min · Plymouth",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Tenney+Mountain+Plymouth+NH",
          "label": "Map"
        },
        "photo": "img/guide/tenney.jpg",
        "photoAlt": "Upper Racer trail at Tenney Mountain",
        "logo": "img/guide/logo-tenney.png",
        "logoAlt": "Tenney Mountain logo",
        "credit": {
          "place": "Tenney Mountain",
          "author": "MConradWard",
          "source": "https://commons.wikimedia.org/wiki/File:Upper_Racer_trail_at_Tenney_Mountain,_NH.jpg",
          "license": "CC BY 4.0"
        }
      },
      {
        "name": "Cannon Mountain",
        "tag": "Experienced",
        "text": "Steep, classic New England terrain with sweeping views over Franconia Notch.",
        "where": "About 35 min · Franconia Notch",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Cannon+Mountain+Franconia+NH",
          "label": "Map"
        },
        "photo": "img/guide/cannon.jpg",
        "photoAlt": "Skiers at Cannon Mountain with Mount Lafayette behind",
        "logo": "img/guide/logo-cannon.png",
        "logoAlt": "Cannon Mountain logo",
        "credit": {
          "place": "Cannon Mountain",
          "author": "Ericshawwhite",
          "source": "https://commons.wikimedia.org/wiki/File:Mt._Layfayette_from_Cannon_Mountain_Ski.JPG",
          "license": "CC BY-SA 3.0"
        }
      }
    ]
  },
  {
    "id": "family",
    "slug": "family-things-to-do-near-campton-nh",
    "heading": "Family things to do near Campton, NH",
    "intro": "Rainy day or sunny one, there is plenty for kids within half an hour of North Peak: live animals, glacial caves, train rides and a summer waterpark.",
    "label": "Family fun",
    "spots": [
      {
        "name": "Granite State Railway",
        "tag": "All ages",
        "text": "Pedal motor-assisted rail bikes along a scenic stretch of historic track through the forest.",
        "where": "Book ahead online",
        "link": {
          "href": "https://gsscenic.com/",
          "label": "Tickets"
        },
        "photo": "img/site/railbikes-900.jpg",
        "photoAlt": "Rail bikes crossing an iron bridge"
      },
      {
        "name": "Squam Lakes Natural Science Center",
        "tag": "All ages",
        "text": "A live animal trail with black bears, mountain lions and bald eagles, plus seasonal lake cruises.",
        "where": "About 15 min · Holderness",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Squam+Lakes+Natural+Science+Center+Holderness+NH",
          "label": "Map"
        },
        "photo": "img/guide/squam.jpg",
        "photoAlt": "Squam Lake from above",
        "credit": {
          "place": "Squam Lake",
          "author": "Andromeda321",
          "source": "https://commons.wikimedia.org/wiki/File:SquamLake.JPG",
          "license": "public domain"
        }
      },
      {
        "name": "Clark's Bears",
        "tag": "Kids",
        "text": "Trained bear shows, a steam train and old-time attractions, run by the Clark family since 1949.",
        "where": "About 25 min · Lincoln",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Clark%27s+Bears+Lincoln+NH",
          "label": "Map"
        },
        "photo": "img/guide/clarks.jpg",
        "photoAlt": "Clark's Trading Post sign in Lincoln",
        "credit": {
          "place": "Clark's Trading Post",
          "author": "rickpilot_2000",
          "source": "https://commons.wikimedia.org/wiki/File:Clark%27s_Trading_Post.jpg",
          "license": "CC BY 2.0"
        }
      },
      {
        "name": "Whale's Tale Waterpark",
        "tag": "All ages",
        "text": "A giant wave pool, water slides and a lazy river for hot summer days.",
        "where": "About 25 min · Lincoln · Summer",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Whale%27s+Tale+Waterpark+Lincoln+NH",
          "label": "Map"
        },
        "photo": "img/guide/whales-tale.jpg",
        "photoAlt": "Whale's Tale Waterpark",
        "credit": {
          "place": "Whale's Tale",
          "author": "Ken Gallager",
          "source": "https://commons.wikimedia.org/wiki/File:Whales_Tale_Lincoln_NH_2018.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "Polar Caves Park",
        "tag": "Kids",
        "text": "Nine glacial caves to squeeze through, nature trails and animals to feed.",
        "where": "About 20 min · Rumney",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Polar+Caves+Park+Rumney+NH",
          "label": "Map"
        },
        "photo": "img/guide/polar-caves.jpg",
        "photoAlt": "White fallow deer at the Polar Caves animal exhibit",
        "credit": {
          "place": "Polar Caves",
          "author": "EgorovaSvetlana",
          "source": "https://commons.wikimedia.org/wiki/File:Fallow_Deer_Animal_Exhibit_Polar_Caves_Park_Rumney_New_Hampshire.jpg",
          "license": "CC BY-SA 4.0"
        }
      }
    ]
  },
  {
    "id": "outdoors",
    "slug": "hikes-and-waterfalls-near-campton-nh",
    "heading": "Hikes, waterfalls and scenic drives near Campton, NH",
    "intro": "The White Mountains are right on the doorstep. These are our favorite walks, hikes and drives, from easy boardwalks through granite gorges to open summit ledges.",
    "label": "Outdoors",
    "spots": [
      {
        "name": "Flume Gorge",
        "tag": "All ages",
        "text": "A two-mile walkway through a granite gorge at the base of Mount Liberty. Book tickets online ahead.",
        "where": "About 30 min · Franconia Notch",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Flume+Gorge+Lincoln+NH",
          "label": "Map"
        },
        "photo": "img/guide/flume.jpg",
        "photoAlt": "Boardwalk through Flume Gorge",
        "credit": {
          "place": "Flume Gorge",
          "author": "MyCatIsAChonk",
          "source": "https://commons.wikimedia.org/wiki/File:Flume_Gorge_July_2023.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "Kancamagus Highway",
        "tag": "All ages",
        "text": "New England's famous scenic drive, with waterfalls and overlooks. Unforgettable in foliage season.",
        "where": "About 25 min · Starts in Lincoln",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Kancamagus+Highway+Lincoln+NH",
          "label": "Map"
        },
        "photo": "img/guide/kancamagus.jpg",
        "photoAlt": "Fall foliage along the Kancamagus Highway",
        "credit": {
          "place": "Kancamagus Highway",
          "author": "King of Hearts",
          "source": "https://commons.wikimedia.org/wiki/File:Kancamagus_Highway_October_2021_HDR.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "Welch–Dickey Loop",
        "tag": "Teens & adults",
        "text": "A favorite half-day hike with open granite ledges and big views of the valley.",
        "where": "About 15 min · Thornton",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Welch+Dickey+Loop+Trailhead+Thornton+NH",
          "label": "Map"
        },
        "photo": "img/guide/welch-dickey.jpg",
        "photoAlt": "Welch and Dickey mountains seen from Campton",
        "credit": {
          "place": "Welch and Dickey",
          "author": "Ken Gallager",
          "source": "https://commons.wikimedia.org/wiki/File:Welch_and_Dickey_from_Campton_July_2020.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "Lost River Gorge",
        "tag": "All ages",
        "text": "Boardwalks, waterfalls and boulder caves to explore in Kinsman Notch.",
        "where": "About 30 min · North Woodstock",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Lost+River+Gorge+%26+Boulder+Caves+NH",
          "label": "Map"
        },
        "photo": "img/guide/lost-river.jpg",
        "photoAlt": "Waterfall and platform at Lost River Gorge",
        "credit": {
          "place": "Lost River Gorge",
          "author": "Jllm06",
          "source": "https://commons.wikimedia.org/wiki/File:Lost_River_Gorge_waterfall_and_platform.jpg",
          "license": "CC BY-SA 4.0"
        }
      }
    ]
  },
  {
    "id": "eat",
    "slug": "restaurants-near-campton-nh",
    "heading": "Restaurants near Campton, NH",
    "intro": "From a hearty local tavern to farm-to-table dinners by the river and a brewpub in an old train station, these are the places we send our guests.",
    "label": "Eat & drink",
    "spots": [
      {
        "name": "Mad River Tavern",
        "tag": "Close by",
        "text": "A hearty New England menu and live music, just down the road.",
        "where": "Campton",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Mad+River+Tavern+Campton+NH",
          "label": "Map"
        }
      },
      {
        "name": "Covered Bridge Farm Table",
        "tag": "Date night",
        "text": "Farm-to-table dining overlooking the Pemigewasset River and the Blair covered bridge.",
        "where": "Campton",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Covered+Bridge+Farm+Table+Campton+NH",
          "label": "Map"
        },
        "photo": "img/guide/blair-bridge.jpg",
        "photoAlt": "The Blair covered bridge in Campton",
        "credit": {
          "place": "Blair Bridge",
          "author": "Ken Gallager",
          "source": "https://commons.wikimedia.org/wiki/File:Blair_Bridge_Campton_NH.jpg",
          "license": "CC BY-SA 3.0"
        }
      },
      {
        "name": "Woodstock Inn Brewery",
        "tag": "Brewpub",
        "text": "A big, festive brewpub in a late-1800s train station, brewing its own beer since 1982.",
        "where": "About 25 min · North Woodstock",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Woodstock+Inn+Brewery+North+Woodstock+NH",
          "label": "Map"
        },
        "photo": "img/guide/woodstock-inn.jpg",
        "photoAlt": "Woodstock Inn Brewery in North Woodstock",
        "credit": {
          "place": "Woodstock Inn Brewery",
          "author": "Kenneth C. Zirkel",
          "source": "https://commons.wikimedia.org/wiki/File:Woodstock_Inn_Brewery_New_Hampshire.jpg",
          "license": "CC BY-SA 4.0"
        }
      },
      {
        "name": "The Common Man",
        "tag": "Family-friendly",
        "text": "Cozy, classic New Hampshire comfort food. A reliable dinner for the whole group.",
        "where": "About 25 min · Lincoln",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=The+Common+Man+Lincoln+NH",
          "label": "Map"
        }
      },
      {
        "name": "Black Mountain Burger",
        "tag": "Après-ski",
        "text": "Burgers and local beer after a day on the slopes at Loon.",
        "where": "About 25 min · Lincoln",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Black+Mountain+Burger+Lincoln+NH",
          "label": "Map"
        }
      },
      {
        "name": "Café Monte Alto",
        "tag": "Coffee",
        "text": "A downtown café stop before a day of exploring.",
        "where": "About 15 min · Plymouth",
        "link": {
          "href": "https://www.google.com/maps/search/?api=1&query=Cafe+Monte+Alto+Plymouth+NH",
          "label": "Map"
        },
        "photo": "img/guide/plymouth.jpg",
        "photoAlt": "Historic view of Main Street, Plymouth",
        "credit": {
          "place": "Main Street, Plymouth",
          "author": "unknown",
          "source": "https://commons.wikimedia.org/wiki/File:Main_St.,_Plymouth,_NH.jpg",
          "license": "public domain"
        }
      }
    ]
  }
];
