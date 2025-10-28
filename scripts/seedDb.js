// scripts/seedDb.js
import { dbService } from '../services/db.service.js';
import { logger } from '../services/logger.service.js';

function _makeId(length = 6) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

const SAMPLE_AUDIO_URLS = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
];

const SPOTIFY_PLAYLISTS = {
    "pop": [
        {
            "description": "הפלייליסט הכי גדול בישראל, עם השירים הכי חמים של היום ומחר. קאבר: אודיה  ",
            "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DWSYF6geMtQMW",
            "spotifyId": "37i9dQZF1DWSYF6geMtQMW",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f872cdc5fbf95658cf3738e9",
            "title": "הלהיטים הגדולים של ישראל"
        },
        {
            "description": "The hottest 50. Cover: Lady Gaga & Bruno Mars",
            "spotifyId": "37i9dQZF1DXcBWIGoYBM5M",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002ea546f8c6250aa17529644f7 ",
            "title": "Today's Top Hits"
        },
        {
            "description": "כל הפופ היפה והמרגש של ישראל. קאבר: נועם קלינשטיין",
            "spotifyId": "37i9dQZF1DX9sLipKPkV9T",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000228d937470519586350b3deed",
            "title": "פופ ישראלי חדש"
        },
        {
            "description": "The songs with the biggest throwback moments. Cover: Arctic Monkeys",
            "spotifyId": "37i9dQZF1DXdpy4ZQQMZKm",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000266bf3d21138dc703e2d8dced",
            "title": "Top Throwbacks 2023"
        },
        {
            "description": "Set the mood of your day with these happy songs.",
            "spotifyId": "37i9dQZF1DX0UrRvztWcAU",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000026b30471dcc036d254dcc8041",
            "title": "Wake Up Happy"
        },
        {
            "description": "A mega mix of 75 favorites from the last few years! ",
            "spotifyId": "37i9dQZF1DXbYM3nMM0oPk",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000023909428545db5e34677f01f0",
            "title": "Mega Hit Mix"
        },
        {
            "description": "להיטי הפופ הגדולים של ישראל. קאבר: סטטיק ",
            "spotifyId": "37i9dQZF1DX3PGzKQakrnm",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000024a8bbd1eb33945b4bd5042ec",
            "title": "פופ ישראלי: הלהיטים"
        },
        {
            "description": "Warm familiar pop you know and love. Cover: Adele",
            "spotifyId": "37i9dQZF1DWTwnEm1IYyoj",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000242ede53dcaaa172b7bbca101",
            "title": "Soft Pop Hits"
        },
        {
            "description": "Current favorites and exciting new music. Cover: LISA",
            "spotifyId": "37i9dQZF1DXcRXFNfZr7Tp",
            "title": "just hits",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000260ef52a79dac8aca2417ced7"
        },
        {
            "description": "Los éxitos del pop latino con Shakira.",
            "spotifyId": "37i9dQZF1DWSpF87bP6JSF",
            "title": "La Lista Pop",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028a940ca226a8dec9e2e2a90d"
        }
    ],
    "decades": [
        {
            "description": "The biggest songs of the 1980s. Cover: Bruce Springsteen",
            "spotifyId": "37i9dQZF1DX4UtSsGT1Sbe",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d6710ea346fec48e89d77dba",
            "title": "All Out 80s"
        },
        {
            "description": "The biggest songs of the 1990s. Cover: The Cardigans",
            "spotifyId": "37i9dQZF1DXbTxeAdrVG2l",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002b60e6f68fd3a593011380bf8",
            "title": "All Out 90s"
        },
        {
            "description": "Rewind and unwind with sirens of the seventies and eighties.",
            "spotifyId": "37i9dQZF1DX0JKUIfwQSJh",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002ad5378ef4192257d82676b7f",
            "title": "70s & 80s Acoustic"
        },
        {
            "description": "The biggest songs of the 2000s. Cover: The Killers",
            "spotifyId": "37i9dQZF1DX4o1oenSJRJd",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002c900fae23e2a3cf42b0e1556",
            "title": "All Out 2000s"
        },
        {
            "description": "Mellow songs from the 1980s. Cover: Tina Turner",
            "spotifyId": "37i9dQZF1DX4WELsJtFZjZ",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000025dfb78be17a842867ef21a9f",
            "title": "Soft 80s"
        },
        {
            "description": "Mellow songs from the 90s. Cover: Mariah Carey",
            "spotifyId": "37i9dQZF1DX2syo5w7a1cu",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002a2c711a42da1ca15bcc06a77",
            "title": "Soft 90s"
        },
        {
            "description": "The biggest party hits of the 1980s. Cover: Cyndi Lauper",
            "spotifyId": "37i9dQZF1DX6xnkAwJX7tn",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028e6b9a53f7c37210a843ab0a",
            "title": "80s Party"
        },
        {
            "description": "The biggest songs of the 1970s. Cover: ABBA",
            "spotifyId": "37i9dQZF1DWTJ7xPn4vNaz",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000241a94d08ee017512668505a3",
            "title": "All Out 70s"
        },
        {
            "description": "The biggest party hits of the 2000s. Cover: Shakira.",
            "spotifyId": "37i9dQZF1DX7e8TjkFNKWH",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002abf84d549f87ed110df1b750",
            "title": "Party Hits 2000s"
        },
        {
            "description": "Mellow songs from the 2010s. Cover: Adele",
            "spotifyId": "37i9dQZF1DX1uHCeFHcn8X",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f956f931f3f83d5316bda8be",
            "title": "Soft 10s"
        }
    ],
    "hiphop": [
        {
            "description": "Music from Future, Playboi Carti and Real Boston Richey. ",
            "spotifyId": "37i9dQZF1DX0XUsuxWHRQd",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d7f9ab95b206afaa4574f139",
            "title": "RapCaviar"
        },
        {
            "description": "Get your beast mode on!",
            "spotifyId": "37i9dQZF1DX76Wlfdnj7AP",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000021c85876e7d9b8633ec32a8b9",
            "title": "Beast Mode"
        },
        {
            "description": "Fourth quarter, two minutes left .. get locked in. Cover: Napheesa Collier",
            "spotifyId": "37i9dQZF1DWTl4y3vgJOXW",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000024689635e96b960d4b433bff2",
            "title": "Locked In"
        },
        {
            "description": "כל ההיפ הופ הישראלי במקום אחד. עטיפה: ישי סוויסה ומיכאל סוויסה  ",
            "spotifyId": "37i9dQZF1DX7Mc5eu3d1jD",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000284b3d839b1cf94ed8d5588fa",
            "title": "היפ הופ ישראלי"
        },
        {
            "description": "Real rap music from the golden era.",
            "spotifyId": "37i9dQZF1DX186v583rmzp",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028908106e49cde03e6d67073e",
            "title": "I Love My '90s Hip-Hop'"
        },
        {
            "description": "Energy tracks to get your beast mode on.",
            "spotifyId": "37i9dQZF1DX9oh43oAzkyx",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d2d1cbd94520146a3fecc8fd",
            "title": "Beast Mode Hip-Hop"
        },
        {
            "description": "עשרים שנה של ההיפ הופ והראפ והפאנק הישראלי הכי טוב שיש בפלייליסט אחד",
            "spotifyId": "37i9dQZF1DXcjTanFJgRnM",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000291657aabe73bd125da139953",
            "title": "דור ההיפ הופ"
        },
        {
            "description": "Classic 90s and early 00s Hip-Hop for the ultimate house party. Cover: Missy Elliott",
            "spotifyId": "37i9dQZF1DX30w0JtSIv4j",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002196d7cc59d478e50ff6d8416",
            "title": "Old School Hip-Hop House Party"
        },
        {
            "description": "Laid back cratedigger hip-hop from around the world.",
            "spotifyId": "37i9dQZF1DX8Kgdykz6OKj",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028e709fabcdb701b300bf5684",
            "title": "Jazz Rap"
        },
        {
            "description": "Taking it way back! Cover: Mos Def",
            "spotifyId": "37i9dQZF1DWVA1Gq4XHa6U",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000231918fd3f54b55956da4f2d2",
            "title": "Gold School"
        }
    ],
    "latin": [
        {
            "description": "תורידו הילוך עם שירים ישראליים נעימים ומרגשים. קאבר: ניר כנען",
            "spotifyId": "37i9dQZF1DX5mMspCVmB8S",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002703a3cdf2d9b8e6fe01b26c5",
            "title": "צ'יל ישראלי"
        },
        {
            "description": "מוזיקה רגועה להורדת הלחץ",
            "spotifyId": "37i9dQZF1DXbmiyBesoBFy",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028d9212333de7cb4e3c23a7b8",
            "title": "נושמים רגע"
        },
        {
            "description": "שירי אהבה יפים 💘",
            "spotifyId": "37i9dQZF1DX439u9DYdMGc",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000203e9ce7f1374059895a0930a",
            "title": "אהבה"
        },
        {
            "description": "להיטים שעושים מצב רוח. באחריות!",
            "spotifyId": "37i9dQZF1DWYbUY40ZDAwb",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000241391070e485ef137bd246a7",
            "title": "להיטים שמחים"
        },
        {
            "description": "Set the mood of your day with these happy songs.",
            "spotifyId": "37i9dQZF1DX0UrRvztWcAU",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000026b30471dcc036d254dcc8041",
            "title": "Wake Up Happy"
        },
        {
            "description": "Peaceful piano to help you slow down, breathe, and relax. ",
            "spotifyId": "37i9dQZF1DX4sWSpwq3LiO",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000283da657fca565320e9311863",
            "title": "Peaceful Piano"
        },
        {
            "description": "The summer needs dance hits 😎☀️",
            "spotifyId": "37i9dQZF1DWZ7eJRBxKzdO",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002c7ea8e62ee86671eaa4c341c",
            "title": "Summer Dance Hits 2024"
        },
        {
            "description": "Feel great with these timelessly fun songs!",
            "spotifyId": "37i9dQZF1DX7KNKjOK0o75",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000021a50f52ecd03dc8bd4efb2e5",
            "title": "Have a Great Day!"
        },
        {
            "description": "Hits to boost your mood and fill you with happiness!",
            "spotifyId": "37i9dQZF1DXdPec7aLTmlC",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000249a1ed33d2ca64e6a5d0e550",
            "title": "Happy Hits!"
        },
        {
            "description": "Kick back to the best new and recent chill hits.",
            "spotifyId": "37i9dQZF1DX4WYpdgoIcn6",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
            "title": "Chill Hits"
        },
        {
            "description": "Nurse your emotional wounds with these heartbreak tracks.",
            "spotifyId": "37i9dQZF1DXbrUpGvoi3TS",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f2c72a29eafebf594195be53",
            "title": "Broken Heart"
        }
    ]
}

const spotifyUser = {
    _id: 'spotify',
    username: 'Spotify',
    fullname: 'Spotify'
};
const defaultUser = {
    _id: 'user_placeholder',
    username: 'demo_user',
    fullname: 'Demo User'
};

function _generateDemoSongsForSpotifyPlaylist(playlistTitle, category) {
    const songCount = getRandomInt(15, 25);
    const songs = [];
    const themeWords = _getThemeWords(category, playlistTitle)

    for (let i = 0; i < songCount; i++) {
        const songId = _makeId(12)
        const artist = getRandomItem(themeWords.artists)

        songs.push({
            id: songId,
            title: `${getRandomItem(themeWords.adjectives)} ${getRandomItem(themeWords.nouns)}`,
            artists: artist,
            album: `${getRandomItem(themeWords.albums)}`,
            durationMs: getRandomInt(150000, 360000),
            imgUrl: `https://picsum.photos/id/${200 + i}/200`,
            addedAt: Date.now() - getRandomInt(0, 31536000000),
            addedBy: spotifyUser.fullname,
            url: getRandomItem(SAMPLE_AUDIO_URLS),
            isYouTube: false,
            isSpotifyTrack: true
        })
    }
    return songs
}

function _getThemeWords(category, playlistTitle) {
    const baseThemes = {
        pop: {
            adjectives: ['Electric', 'Bright', 'Golden', 'Shining', 'Sweet', 'Dancing', 'Dreaming', 'Rising'],
            nouns: ['Star', 'Heart', 'Light', 'Dream', 'Song', 'Beat', 'Love', 'Night'],
            artists: ['Pop Star', 'Luna Rose', 'The Bright Lights', 'Golden Hearts', 'Sweet Dreams', 'Dance Floor'],
            albums: ['Pop Perfection', 'Hit Collection', 'Chart Toppers', 'Radio Ready', 'Pop Gems']
        },
        decades: {
            adjectives: ['Classic', 'Vintage', 'Timeless', 'Retro', 'Nostalgic', 'Old School', 'Legendary'],
            nouns: ['Memories', 'Times', 'Groove', 'Soul', 'Rhythm', 'Beat', 'Sound', 'Vibe'],
            artists: ['The Classics', 'Vintage Sound', 'Retro Kings', 'Time Machine', 'Nostalgia Band'],
            albums: ['Greatest Hits', 'Classic Collection', 'Timeless Tracks', 'Vintage Vibes', 'Retro Gold']
        },
        hiphop: {
            adjectives: ['Heavy', 'Hard', 'Raw', 'Street', 'Underground', 'Fierce', 'Bold', 'Real'],
            nouns: ['Beats', 'Flow', 'Rhyme', 'Bass', 'Street', 'Game', 'Life', 'Hustle'],
            artists: ['MC Flow', 'Street Beats', 'Underground Kings', 'Raw Talent', 'Hip Hop Legends'],
            albums: ['Street Chronicles', 'Beat Collection', 'Raw Rhymes', 'Underground Hits', 'Hip Hop Classics']
        },
        latin: {
            adjectives: ['Peaceful', 'Calm', 'Serene', 'Gentle', 'Soft', 'Relaxing', 'Soothing', 'Tranquil'],
            nouns: ['Breeze', 'Waves', 'Peace', 'Calm', 'Rest', 'Breath', 'Quiet', 'Soul'],
            artists: ['Peaceful Vibes', 'Calm Waters', 'Serene Sounds', 'Gentle Waves', 'Quiet Storm'],
            albums: ['Peaceful Moments', 'Calm Collection', 'Relaxation', 'Soft Sounds', 'Tranquil Times']
        }

    }
    return baseThemes[category.toLowerCase()] || baseThemes.pop
}


function _createSpotifyStations() {
    const stations = []
    Object.entries(SPOTIFY_PLAYLISTS).forEach(([category, playlists]) => {
        playlists.forEach((playlist) => {
            const station = {
                name: playlist.title,
                description: playlist.description,
                imgUrl: playlist.imgUrl.trim(),
                createdBy: {
                    _id: spotifyUser._id,
                    fullname: spotifyUser.fullname
                },
                songs: _generateDemoSongsForSpotifyPlaylist(playlist.title, category),
                tags: [category, 'spotify', 'curated'],
                spotifyId: playlist.spotifyId,
                isSpotifyPlaylist: true,
                likedByUsers: []
            }
            stations.push(station)
        })
    })
    return stations
}


async function seedDatabase() {
    try {
        logger.info('Starting DB seeding process...')

        const collection = await dbService.getCollection('station')
        logger.info('Connected to "station" collection.')

        const deleteResult = await collection.deleteMany({})
        logger.info(`Cleared ${deleteResult.deletedCount} existing stations.`)

        const count = await collection.countDocuments()
        if (count > 0) {
            logger.info(`Collection already has ${count} stations. Skipping seeding.`);
            return
        }


        logger.info('Generating station data...')
        const stationsToInsert = _createSpotifyStations()
        logger.info(`Generated ${stationsToInsert.length} stations.`)

        if (stationsToInsert.length > 0) {
            const insertResult = await collection.insertMany(stationsToInsert);
            logger.info(`Successfully inserted ${insertResult.insertedCount} stations.`)
        } else {
            logger.warn('No stations were generated to insert.')
        }

        logger.info('DB seeding process completed successfully!')
    } catch (err) {
        logger.error('Error during DB seeding:', err)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

seedDatabase()