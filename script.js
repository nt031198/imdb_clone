// Titles: https://omdbapi.com/?s=thor&page=1&apikey=62f3389e
// details: http://www.omdbapi.com/?i=tt3896198&apikey=62f3389e

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=62f3389e`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True"){
        displayMovieList(data.Search);

    } 
}


// for searching movies from the given input
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}


// display movie on the search list
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}


// for loading movie details
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=62f3389e`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}


// for displaying the detailed view of the movie
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


    // element selector for fav icon (heart)
    var favDetail = document.getElementById('fav-detail');
    let flag = addedCheck(details.imdbID);

    if(flag)
    {
        favDetail.style.color = 'red';
    }


    
    // event listner for the fav icon
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


    // adding movies to the favourites of local storage
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



      // for checking whether or not movie is added to the favouites list
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

      
      
      // for removing favourites movie from the local storage
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


      // evnet listner for the fav icon
        favDetail.addEventListener('click', function(e){
            console.log('Inside fav');
            favDetail.style.color = 'red';
        }, true);
    
}






