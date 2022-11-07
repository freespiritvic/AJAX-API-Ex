const missingImage = "http://tinyurl.com/missing-tv";

async function searchShows(query) {
     const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

     const tvShows = response.data.map(result => {
        const show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : missingImage,
        };
     });
     return tvShows;
};


async function populateShows(shows) {
    const $showsList = $('#shows-list');
    $showsList.empty();

    for(let show of shows ) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
               <div class="card" data-show-id="${show.id}">
                 <img class="card-img-top" src="${show.image}">
                 <div class="card-body">
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <button class="btn btn-primary get-episodes">Episodes</button>
                 </div>
               </div>  
             </div>
            `);
            $showsList.append($item);
    };
};

$('#search-form').on('submit', async function handleSearch(e) {
    e.preventDefault();

    const querySearch = $('#search-query').val();
    if(!querySearch) return;
    
    $('#episodes-area').hide();

    let showSearch = await searchShows(querySearch);

    populateShows(showSearch);
})

async function getEpisodes(id) {
    const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  const episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

function populateEpisodes(episodes) {
    const $episodesList = $("#episodes-list");
    $episodesList.empty();
      
    for (let episode of episodes) {
      let $item = $(
        `<li>
           ${episode.name}
           (season ${episode.season}, episode ${episode.number})
         </li>
        `);
  
      $episodesList.append($item);
    }
  
    $("#episodes-area").show();
  }

  $("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(e) {
    const showId = $(e.target).closest(".Show").data("show-id");
    const episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  });