console.log("start")
let currentsong = new Audio()
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds || seconds < 0)) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);


    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    


    //show all the songs in the play list
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
      <img class="invert" src="img/music.svg" alt="">
      <div class="info">
          <div> ${song.replaceAll("%20", "")}</div>
          <div>Nikhil</div>
      </div>
      <div class="playnow">
          <span>PLay Now</span>
          <img class="invert" src="img/play.svg" alt="">
      </div>  </li> `;

    }

    //attach a event listner to  each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {


            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs

}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    currentsong.play()

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00 / 00.00"

}

async function main() {
    //get the list of all songs
    await getSongs("songs/Ost")
    playmusic(songs[0], true)


    //attach an event listner to play ,previous, next

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"

        }

        else (
            currentsong.pause(),
            play.src = "img/play.svg"
        )
    })

    //listen for time update event

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime /
            currentsong.duration) * 100 + "%";
    })

    //add an event listen to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"

        currentsong.currentTime = ((currentsong.duration) * percent) / 100

    })

    //add an event listner for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })


    //add an event listner for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"

    })

    //add an event listeners to previous and next

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if (index-1>= 0) {

            playmusic(songs[index - 1])

        }

    })
    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {

            playmusic(songs[index + 1])

        }
    })

    //add an event listener to the volume input
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100

    })


    //load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("cards")).forEach(e => {

        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic (songs[0])
            document.querySelector(".left").style.left = "0"

        })

    })



  

 


}


main()
