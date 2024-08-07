console.log("just start the java script");
let currentsong = new Audio();
let songs;
let currfolder;
function convertSecondsToTime(seconds) {
    // Ensure seconds is a number
    seconds = parseInt(seconds);

    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros
    let formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    let formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return formatted time in "00:12" format
    return `${formattedMinutes}:${formattedSeconds}`;
}






async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`/${folder}/`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
      songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // show all songs in playlist

    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML =songul.innerHTML+`<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                              <div class="songname"> ${song.replaceAll("%20"," ")}</div>
                               <div class="songartist">-${folder}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now </span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div</li>`;
                            // Attache The Event listener :
    }
                         Array.from( document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
                            e.addEventListener("click",element=>{
                                
                                playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
                                
                            })    
                         })
                     
                        
    
                         return songs;
   

   
   
    

}
const playmusic =(track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentsong.src=`/${currfolder}/`+track;
    
    if(!pause){
        currentsong.play();      
    }
    play.src="img/paused.svg"; 
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
        document.querySelector(".songtime").innerHTML=`00:00 / 00:00`


}
async function displayAlbum(){
    let a = await fetch(`/songs/`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
 let anchors =  div.getElementsByTagName("a")
 let cardContainer=document.querySelector(".card-container")
 let array =Array.from(anchors)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    if(e.href.includes("/songs")){

        let folder=e.href.split("/").slice(-2)[0]
        // get the meta deta of the folder
        let a = await fetch(`/songs/${folder}/info.json`)
      
        let response = await a.json();
       
        cardContainer.innerHTML=cardContainer.innerHTML+`
                     <div data-folder="${folder}" class="card" >
                        <div class="img-but">

                            <div class="play">
                                <i class="fa-solid fa-play"></i>
                            </div>
                            <img src="/songs/${folder}/cover.jpeg" alt="">
                        </div>
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>  `
    }
 }
  // load the playlist from the folder while the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
     
    e.addEventListener("click",async item=>{
       
        songs= await getsongs(`songs/${ item.currentTarget.dataset.folder}`);
           playmusic(songs[0])
    })
})
    
}

async function main(){
  
    //get the list of songs
    await getsongs("songs/ncs");
    playmusic(songs[0],true)

    // display all the allbums on the page
    displayAlbum();

   
   
    //Attach an event Listner to play ,next and previous:
    play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src="img/paused.svg";
    }
    else    
    {
    currentsong.pause();
    play.src="img/play.svg";
    }
    })
                      
    //  Listen for time upadate Event
    currentsong.addEventListener("timeupdate",()=>{                           
        document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentsong.currentTime)}/${convertSecondsToTime(currentsong.duration)}`
        document.querySelector(".circul").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%";
        })  
    // add event listener in seakbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circul").style.left = percent+"%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
        })
        //add an event listner for humberger
    document.querySelector(".hambarger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left=0;
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left=-140+"%";
    })

    // add event listner for previous and next
    previous.addEventListener("click",()=>{
        let index=songs.indexOf( currentsong.src.split("/").slice(-1) [0])
        if((index-1)>=0)
        {
            playmusic(songs[index-1])
        }
        else
        {
            playmusic(songs[songs.length-1]);
        }
        
    })
      

    next.addEventListener("click",()=>{
       let index=songs.indexOf( currentsong.src.split("/").slice(-1) [0])
      
        if((index+1)<=songs.length-1)
        {
            playmusic(songs[index+1]);
        }
        else
        {
            playmusic(songs[0]);
        }
    })
    //    add and event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume =parseInt(e.target.value)/100
    })

    // add event listner to mute the volume
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
       
        if(e.target.src.includes("img/volume.svg"))
        {
            e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg");
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg");
            currentsong.volume =.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
           
        }
        
      
    })
   

   


   
  
   
                     
}
    

    


main()


