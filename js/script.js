
const currentSong = new Audio();
let songs;
let currFolder;
let prevVol;

function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    } 

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure that minutes and seconds are formatted with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }        
    }

    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="songName">${song.replaceAll("%20"," ").replace("(PagalWorld.Ink).mp3", " ").replaceAll("-", " ")}</div>
                                <div class="singerName">Shivanshu</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="  invert" src="img/playbtn.svg" alt="">
                            </div>
                        </li>` ;
    }

    // Attach events listener to each song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML).trim();
        });
    });

    return songs;
}

const playMusic = (track,pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if(!pause) {
        currentSong.play();
    play.src = "img/pause.svg";
    }
    let decodedTrack = decodeURI(track).replaceAll("%20", " ").replace("(PagalWorld.Ink).mp3", " ").replaceAll("-", " ");

    document.querySelector(".songinfo").innerHTML = decodedTrack;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let array = Array.from(anchor)
    let cardContainer = document.querySelector(".cardContainer")
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs") &&  !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML  = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div  class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#141B34" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
                </svg>
            </div>


            <img src="/songs/${folder}/cover.jpeg">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }

         // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click",async item=> {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
        
    }

}

async function main() {
    // get the list of all songs
     songs = await getSongs(`songs/cs`);
    playMusic(songs[0],true);

    // Display all the albums on the page
    await displayAlbums();

    // Attach EventListener to prev, next, and play

    play.addEventListener("click", ()=> {
        if(currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/playbtn.svg";
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=> {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });
       
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=> {
       let precent = (e.offsetX/e.target.getBoundingClientRect().width)*100;     
        document.querySelector(".circle").style.left = precent + "%";
        currentSong.currentTime = ((currentSong.duration)*precent)/100;
    })
 
    // Add Event Listener to humburger
    document.querySelector(".humburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    });

     // Add Event Listener to close
     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
     
    // Add Event Listener to Previous
    previous.addEventListener("click", () => {
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if(index-1 >= 0) {
            playMusic(songs[index-1]);
        }
    })

     // Add Event Listener to Next
     next.addEventListener("click", () => {
        currentSong.pause();1

        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if(index+1 < songs.length) {
            playMusic(songs[index+1]);
        }
    })

    // Add EventListener to the volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value)/100;
    })

    // Add eventListener to mute track 
    document.querySelector(".volume>img").addEventListener("click", e=> {
        if(e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            prevVol = currentSong.volume;
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg" );
            currentSong.volume = prevVol;
            document.querySelector(".range").getElementsByTagName("input")[0].value = prevVol*100;
        }
    })

}


main();