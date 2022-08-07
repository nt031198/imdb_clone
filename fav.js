//Select the elements by ID
const searchList = document.getElementById('search-list');
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
const resultGrid = document.getElementById('result-grid');

//array of imdbID for favourite movies
var favMovies = [];


//for fetching favourite movies from local Storage
function fetchFavs(){
        if (localStorage.getItem("fav") === null) {
          favMovies = [];
        } else {
          favMovies = JSON.parse(localStorage.getItem("fav"));
        }
        console.log(favMovies);
}
fetchFavs();

//for traversing in an array of favourite movie ids in localStorage
for(let i = 0; i < favMovies.length; i++){
    loadMovies(favMovies[i].imdbID);
}


// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?apikey=62f3389e&i=${searchTerm}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True"){
        displayMovieList(data);
    } 
}

// display movie datas like poster and title in the favourite list
function displayMovieList(movies){

        let movieListItem = document.createElement('div');
        movieListItem.setAttribute('id', movies.imdbID);
        movieListItem.classList.add('fav-movie');
        let moviePoster = "N/A";
        if(movies.Poster != "N/A")
            moviePoster = movies.Poster;
        else 
            moviePoster = "image_not_found.png";

        let img = document.createElement('img');
        img.classList.add('fav-img');
        img.src = moviePoster;
        movieListItem.appendChild(img);

        let title = document.createElement('h3');
        title.classList.add("fav-title");
        title.innerText = movies.Title;
        movieListItem.appendChild(title);

        searchList.appendChild(movieListItem);
}



// for the detailed view of a movie when any movie from the favourites list is clicked
async function loadMovieDetails(favId){
    const URL = `https://omdbapi.com/?apikey=62f3389e&i=${favId}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True"){
        displayMovieDetails(data);
    } 
}


// operation to perform after any particular movie from the favourite list is clicked
function eventTarget(e){
    console.log(e.target.parentElement);
    let favId = e.target.parentElement.id;
    console.log(favId);
    loadMovieDetails(favId);
    
}


// click listener for the favourite movie
searchList.addEventListener('click', eventTarget, false);



// event listner for modal to display the details of a movie on a modal
searchList.onclick = function() {
    modal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }


// function for the displaying details of a movies inside modal
function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <a  id="fav-detail" style="color: white; cursor: pointer;"><i class="fa-solid fa-heart"></i></a>
        <!-- <a  id="delete" style="color: white; cursor: pointer;"><i class="fa-solid fa-star"></i></a> -->
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.imdbRating}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;


    // selector for favourite icon (heart)
    var favDetail = document.getElementById('fav-detail');

    let flag = addedCheck(details.imdbID);

    if(flag)
    {
        favDetail.style.color = 'red';
    }


    
    // when fav icon is clicked its added to the persistent storage and when clicked again its removed from the storage
    favDetail.addEventListener('click', function(){
        if(flag)
        {
            removeLocalFavs(details.imdbID);
            favDetail.style.color = 'white';
            flag = false;
        }
        else
        {
            favDetail.style.color = 'red';
            saveLocalFavs(details.imdbID);
            flag = true;
        }
        
    });

    
    // function for saving the movie's imdbId to the localStorage
    function saveLocalFavs(id) {
        let fav;
        if (localStorage.getItem("fav") === null) {
          fav = [];
        } else {
          fav = JSON.parse(localStorage.getItem("fav"));
        }
        let obj = {
            imdbID : id
        }

        fav.push(obj);
        localStorage.setItem("fav", JSON.stringify(fav));
      }


      // function for checking whether the movie is already added to the favourites list or not
      function addedCheck(id) {
        let fav;
        if (localStorage.getItem("fav") === null) {
          fav = [];
        } else {
          fav = JSON.parse(localStorage.getItem("fav"));
        }

        const delIndex = fav.findIndex(function(item, index){
            if(item.imdbID == id)
            {
                return true;
            }
        });
        if(delIndex > -1)
            return true;

      }

      
      
      // removing fav movie from the local storage
      function removeLocalFavs(id) {
        let fav;
        if (localStorage.getItem("fav") === null) {
          fav = [];
        } else {
          fav = JSON.parse(localStorage.getItem("fav"));
        }
        const delIndex = fav.findIndex(function(item, index){
            if(item.imdbID == id)
            {
                return true;
            }
        });


        if(delIndex > -1)
        fav.splice(delIndex, 1);
        localStorage.setItem("fav", JSON.stringify(fav));
      }
    
      favDetail.addEventListener('click', function(e){
        favDetail.style.color = 'red';
    }, true);
}
