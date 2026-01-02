console.log("Let's write some Java Script");

/*
    fetch() is a built-in JavaScript function used to request data from a URL (API, file, image, etc.).
    It works over HTTP/HTTPS and returns a Promise that resolves to a Response object.
    We have to use either async/await or .thrn() or any other promise methods in order to use fetch()
*/

/*
    async and await are features in JavaScript used to work with asynchronous code in a simpler, cleaner way than using .then() chains.

    ✅ async
    async is a keyword you put before a function to tell JavaScript that the function will use asynchronous operations and return a Promise.

    ✅ await
    await is used inside an async function.
    It pauses the function execution until a Promise is resolved, then gives you the actual value.
*/

/*
    ()=> is the arrow function syntax in JavaScript. It’s a shorter way to write a function.
    arrow function can be stored in a variable. An function can be called using <variable>()
*/

/*
    setTimeout() is a built-in JavaScript function that runs a piece of code after a delay (in milliseconds).
    It does not stop your program; it schedules the function to run later (asynchronously).
*/

/*
using '>' while targetting elements or classes means, direct child
*/
let currentSong = new Audio();  //global variable
let songs;

async function getSongs(name){
    let a = await fetch(`${name}`);
    let response = await a.text();
    //console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let listOfas = div.querySelectorAll("li a");  //note that its elements not element
    
    let songs = [];
    for (let index = 0; index < listOfas.length; index++) {
        const element = listOfas[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${name}/`)[1]);   //removing unwanted things from the song link
        }
    }
    //console.log(songs);

    return songs;
}

async function getAlbums(){
    let a = await fetch("albums");
    let response = await a.text();
    //console.log(response); 

    let div = document.createElement("div");
    div.innerHTML = response;
    let albums = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < albums.length; index++) {
        const element = albums[index];
        if(element.href.includes("albums/")){
            //console.log(element);
            //console.log(element.href.split("albums/")[1].replaceAll("%20"," "));
            let albumName = element.href.split("albums/")[1].replaceAll("%20"," ").replaceAll("%26","&");
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
                <img src="albums/${albumName}/cover.jpg" class="poster">
                <img src="assets/greenPlay.svg" class="greenPlayBtn">
                <h1>${albumName}</h1>
            `;

            document.querySelector(".my-music .card-container").append(div);
        }
    }
}

function formatTime(sec){
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,"0");

    return `${m}:${s}`;
}

const playMusic = (track) =>{
    //console.log(track);
    /*
    let audio = new Audio("songs/" + track + ".mp3");   //play as many songs simultaneoulsy as we click
    audio.play();
    */

    currentSong.src = "songs/" + track + ".mp3";    //one song at a time
    currentSong.play();
    play.src = "assets/pause.svg";
    
    document.querySelector(".song-cover-details .song-details b").innerHTML = track;

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".play-pause .lower .total-duration").textContent = formatTime(currentSong.duration);
    });
}

/*
    ✅ Why P2-Spotify Clone was dispperaring:

        Earlier I was doing:

        new Audio("/songs/" + track + ".mp3");

        That leading slash / means: “Start from server root”

        So the browser looks for:
        http://127.0.0.1:5500/songs/...

        and skips your folder P2-Spotify Clone.

        That’s why it omits it.

    ✅ Why it becomes double when you add it manually

        If you do: "/P2-Spotify Clone/songs/..."

        and your page is already inside P2-Spotify Clone, the real resolved path becomes: http://127.0.0.1:5500/P2-Spotify Clone/P2-Spotify Clone/songs/...

        So it duplicates.
*/

async function pushAllSongsIntoList(folder){
    //getting list of all songs
    songs = await getSongs(`${folder}`);
    //console.log(songs);

    //Getting all songs into our library
    let songUL = document.querySelector(".songs-list").getElementsByTagName("ul")[0];
    /*
    for(const song of songs){
        songUL.innerHTML  = songUL.innerHTML + `<li class="flex justify-center items-center hover">
                                                    <span>
                                                        <img src="assets/music.svg" class="invert" alt="cover">
                                                    </span>

                                                    <span class="about-song">
                                                        <sName href=""><b>${song.replaceAll("%20"," ").split(".mp3")[0]}</b></sName>
                                                        <br>
                                                        <aName href="">Song Artists</aName>
                                                    </span>

                                                    <span class="flex">
                                                        <img src="assets/threeDots.svg" class="invert" alt="threeDots">
                                                    </span>
                                                </li>`;
    }
    This is VERY expensive. Each time the loop runs, the browser:

        ->Reads the entire existing HTML
        ->Concatenates string
        ->Deletes the whole DOM tree
        ->Rebuilds entire <ul> again
        ->Re-parses everything
        ->Repaints
    */

    let html = "";
    for (const song of songs) {
    html += `<li class="flex justify-center items-center hover">
        <span>
        <img src="assets/music.svg" class="invert" alt="cover">
        </span>

        <span class="about-song">
        <sName><b>${song.replaceAll("%20"," ").split(".mp3")[0]}</b></sName>
        <br>
        <aName>Song Artists</aName>
        </span>

        <span class="flex">
        <img src="assets/threeDots.svg" class="invert" alt="threeDots">
        </span>
    </li>`;
    }

    songUL.innerHTML = html;

    return [songs,songUL];
}

async function main(){

    let [songs,songUL] = await pushAllSongsIntoList("songs");

    /*
    //playing the first song
    var audio = new Audio(songs[0]);
    //audio.play();
    
    audio.addEventListener("loadeddata",() => {
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime);  //in seconds
        }) 
    */

    /*
        The browser calls the arrow funciton automatically.
        
        1️⃣ You attach a listener
        
        2️⃣ When the audio finishes loading enough data to know its duration,
        the browser fires the "loadeddata" event.
        
        3️⃣ At that moment, the browser runs the callback (your arrow function).
        
        #THERE ARE SPECIAL ATTRIBUTES OF Audio IN JS USED TO GET VARIOUS META DATA ABOUT THE AUDIOS LIKE duration, currentTime, src, paused, muted, volume, etc many more
        
        ✅ What "loadeddata" means
        It fires when the browser has loaded enough media data to start playing the audio/video, at least the first frame.
    */
      
    /*
        ✅ What addEventListener() does:
        It listens for an event and then calls your function when that event occurs. Here that event is "loadeddata"
        
        ❓ Why do we need it instead of running code directly?
        Because the duration is NOT available immediately when you create the audio.
        It takes time to load. So if you run code too early, duration is NaN.
    */
     

    /*
        querySelector() → Select the first element using CSS selector syntax (class,id, tag, nested selectors).
        querySelectorAll() -> All matching CSS selectors

        .target is most commonly seen as event.target in JavaScript event handling.
        It refers to the exact element that triggered the event (the element that was actually clicked, typed in, hovered, etc.).
    */

    //Attach an event listner to each song
    function attachSongsClickListeners(){
        Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(li => {
            li.addEventListener("click", element => {
                const name = li.querySelector(".about-song > sName > b").innerHTML;
                console.log(name);
                playMusic(name);
            })
        });
    }

    attachSongsClickListeners();

    //Attach an event listner to play, next and previous
    let playButton = document.querySelector(".upper > .play-btn");
    playButton.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "assets/pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "assets/play.svg";
        }
    });

    next.addEventListener("click", () => {
        //console.log(songs);
        //console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split("songs/")[1]);
        //console.log(index);

        let nextIndex = (index+1) % songs.length;
        playMusic(songs[nextIndex].split(".mp3")[0].replaceAll("%20"," "));
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("songs/")[1]);
        //console.log(index);

        let prevIndex = (index - 1 + songs.length) % songs.length;

        playMusic(songs[prevIndex].split(".mp3")[0].replaceAll("%20"," "));
    });

    //Listen for time-update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".play-pause .lower .current-duration").textContent = formatTime(currentSong.currentTime);
        //document.querySelector(".current-instance-circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";   //use of left is laggy

        const percent = currentSong.currentTime / currentSong.duration;
        const barWidth = document.querySelector(".seek-bar").clientWidth;

        document.querySelector(".current-instance-circle").style.transform = `translate(-50%, -50%) translateX(${barWidth * percent}px)`;

        document.querySelector(".seek-bar .fill").style.width = `${percent*100}%`;
    });

    //Add event listener to seekbar
    document.querySelector(".seek-bar").addEventListener("click", e => {
        //console.log(e.offsetX , e.target.getBoundingClientRect().width);

        const percent = e.offsetX / e.target.getBoundingClientRect().width; //this will work correct if we disable clicks on .fill
        const barWidth = document.querySelector(".seek-bar").clientWidth;

        document.querySelector(".current-instance-circle").style.transform = `translate(-50%, -50%) translateX(${barWidth * percent}px)`;

        document.querySelector(".seek-bar .fill").style.width = `${percent * 100}%`;

        currentSong.currentTime = currentSong.duration * percent;
    });
    
    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        let libraryBar = document.querySelector("main > .library");
        if(libraryBar.style.left == `0%`){
            libraryBar.style.left = `-100%`;
            document.querySelector(".hamburger > img").src = "assets/hamburger.svg";
            //libraryBar.style.display = "none";    //only for phone like iphone se
        }
        else{
            libraryBar.style.left = `0%`;
            document.querySelector(".hamburger > img").src = "assets/close.svg";
            //libraryBar.style.display = "block";   //only for phone like iphone se
        }
    });

    //Add an event listener for volume button
    document.querySelector(".volume-button-and-bar > button").addEventListener("click", ()=> {
        let seekBar = document.querySelector(".volume");
        if(window.matchMedia("(max-width: 800px)").matches){
            if(seekBar.style.display == "none"){
                seekBar.style.display = "inline"
                seekBar.style.transform = "rotate(-90deg)";
            }
            else
                seekBar.style.display = "none";
        }
    });

    document.querySelector(".volume").addEventListener("change", (e) => {
        console.log(e.target.value);
        currentSong.volume = e.target.value / 100;
    });

    //Add event listeners for ALL, SONGS, PODCASTS
    document.querySelector(".songs > header .all").addEventListener("click", () =>{
        pushAllSongsIntoList("songs");
        Swal.fire({         //suggested by chat gpt
            title: "All Songs added to Library",
            text: "Enjoy listening 🎧",
            icon: "success",
            timer: 1000,
            showConfirmButton: false
        });

        //console.log("Music Tab Switched");
        document.querySelector(".songs > header .all").style.backgroundColor = "white";
        document.querySelector(".songs > header .all").style.color = "black";
        document.querySelector(".songs > header .music").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .music").style.color = "white";
        document.querySelector(".songs > header .podcasts").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .podcasts").style.color = "white";

        document.querySelector(".songs .ALL").style.display = "block";
        document.querySelector(".songs .PODCASTS").style.display = "none";
        document.querySelector(".songs .MUSIC").style.display = "none";
    });
    document.querySelector(".songs > header .music").addEventListener("click", () =>{
        //console.log("Music Tab Switched");
        document.querySelector(".MUSIC .card-container").innerHTML = "";
        getAlbums("albums");

        document.querySelector(".songs > header .music").style.backgroundColor = "white";
        document.querySelector(".songs > header .music").style.color = "black";
        document.querySelector(".songs > header .all").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .all").style.color = "white";
        document.querySelector(".songs > header .podcasts").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .podcasts").style.color = "white";

        document.querySelector(".songs .ALL").style.display = "none";
        document.querySelector(".songs .PODCASTS").style.display = "none";
        document.querySelector(".songs .MUSIC").style.display = "block";
    });
    document.querySelector(".songs > header .podcasts").addEventListener("click", () =>{
        //console.log("Music Tab Switched");
        document.querySelector(".songs > header .podcasts").style.backgroundColor = "white";
        document.querySelector(".songs > header .podcasts").style.color = "black";
        document.querySelector(".songs > header .music").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .music").style.color = "white";
        document.querySelector(".songs > header .all").style.backgroundColor = "#383838";
        document.querySelector(".songs > header .all").style.color = "white";

        document.querySelector(".songs .ALL").style.display = "none";
        document.querySelector(".songs .PODCASTS").style.display = "block";
        document.querySelector(".songs .MUSIC").style.display = "none";
    });

    //Openning specific album
    document.querySelector(".MUSIC").addEventListener("click", async (e) => {
        const card = e.target.closest(".card");
        if(!card)   return;

        let albumName = card.querySelector("h1").innerHTML;
        console.log(albumName);

        let songs = await getSongs(`albums/${albumName.replaceAll(" ","%20")}`);
        console.log(songs);

        let html = "";
        for (const song of songs) {
        html += `<li class="flex justify-center items-center hover">
            <span>
            <img src="assets/music.svg" class="invert" alt="cover">
            </span>

            <span class="about-song">
            <sName><b>${song.replaceAll("%20"," ").split(".mp3")[0]}</b></sName>
            <br>
            <aName>Song Artists</aName>
            </span>

            <span class="flex">
            <img src="assets/threeDots.svg" class="invert" alt="threeDots">
            </span>
        </li>`;
        }

        songUL.innerHTML = html;
        attachSongsClickListeners();    //When you replace innerHTML, all previous click event listeners are destroyed. Hence we need to re-attack them after inserting all required html.

        document.querySelector(".hamburger").click();

        //alert("Songs added to library");

        Swal.fire({         //suggested by chat gpt
            title: "Songs added to Library",
            text: "Enjoy listening 🎧",
            icon: "success",
            timer: 1000,
            showConfirmButton: false
        });
    });

    //Add event listener to under-dev
    document.querySelectorAll(".devAtWork").forEach(el => {     //querySelectorAll return a node-list
        el.addEventListener("click", () => {
            console.log("Under development...");
            Swal.fire({
                title: "Development At Work 🧑🏻‍💻🛠️",
                text: "Happy Learning......",
                icon: "info",
                timer: 1000,
                showConfirmButton: false,
    
                showClass: {
                    popup: 'animate__animated animate__zoomIn animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut'
                }
            })
        })
    });

}


main();
