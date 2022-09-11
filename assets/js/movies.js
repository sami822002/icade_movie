const $ = require('jquery');
global.$ = global.jQuery = $;
/**
 *
 * @param genders
 * @param gender
 * @param search
 */
window.moviesByGender = function (genders, gender, search = '') {
    const genderId = gender.id
    const checkedgenderId = $("#genderId").val();
    $("a#gender_" + checkedgenderId).css('color', 'white');
    $("a#gender_" + checkedgenderId).css('font-weight', 'normal')
    $.each(genders, function (key, genderOne) {
        if (genderId != genderOne.id) {
            $("a#gender_" + genderOne.id).css('color', 'white');
            $("a#gender_" + genderOne.id).css('font-weight', 'normal')
        } else {
            $("a#gender_" + genderId).css('font-weight', 'bold')
            $("a#gender_" + genderId).css('color', 'orange');
        }
    });
    var host = $(location).attr('protocol') + '//' + $(location).attr('host');
    var url = host + '/movies/' + genderId;
    if (search != '') {
        url += '/' + search
    }
    $.ajax({
        url: url,
        contentType: "application/json; charset='utf-8'",
        dataType: 'json',
        type: 'GET',
        async: false,
        data:
            {},
        complete: function (response) {

            if (response.responseText == '[]') {
                console.log('no data')
            } else {
                const movies = JSON.parse(response.responseText);
                const img_host = 'https://www.themoviedb.org/t/p/w188_and_h282_bestv2';
                $("table.table.table-striped.table-hover.movies").replaceWith(`
                    <table class="table table-striped table-hover movies">`)

                if (movies.results.length == 0) {
                    $("table.table.table-striped.table-hover.movies").append(`                   
                                <h1 class="no_movie"> Aucun Film trouvé</h1></div>`);
                } else {
                    $("table.table.table-striped.table-hover.movies").append(`<tbody>`)
                    $.each(movies.results, function (key, movie) {
                        const overview_length = movie.overview.length
                        let movie_overview = movie.overview.substr(0, 127);
                        $("table.table.table-striped.table-hover.movies").append(`
                             <tr>
                                <td class="text-left align-middle show_${movie.id}">
                                    <div class="wrapper">
                                        <div class="image">
                                            <div class="poster">                                                
                                                    <img loading="lazy" class="poster" src="${img_host + movie.poster_path}">                                           
                                            </div>
                                        </div>
                                        <div class="details">
                                            <div class="wrapper">
                                                <div class="title">
                                                    <div>
                                                        <h2>${movie.title}</h2>
                                                    </div>
                                                    <span class="release_date">${movie.release_date}  
                                                    | ${getMoviegGenders(movie.genre_ids, genders)}
                                                    </span>
                                                     <p> ${getNotation(movie)}</p>
                                                </div>
                                            </div>
                                            <div class="overview">
                                                <p>${movie_overview} ...</p>
                                            </div>
                                            <div class="col">
                                                <div class="form-group show">
                                                    <button class="btn btn-primary show" data-toggle="modal" data-target="#show${movie.id}">Afficher
                                                        Details
                                                    </button>
                                                    <div class="card movie_detail">`);
                        $(".text-left.align-middle.show_" + movie.id).click(function () {
                            showModal(movie, genders)
                        });

                        $("table.table.table-striped.table-hover.movies").append(`</div>
                                                </div>                                                
                                            </div>
                                        </div>
                                    </div>
                                </td>
                             </tr>`)
                    })
                };
                $("table.table.table-striped.table-hover.movies").append(`</tbody></table>`)
                return false;
            }
        },
        error: function () {
            console.log('error data call: ' + url);
        },
    });
}

/**
 *
 * @param movie
 * @param genders
 */
function showModal(movie, genders) {
    $(".card.movie_detail").append(`    <div class="modal fade" id="show${movie.id}" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalLongTitle"
         style="display: none;" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">
                        ${movie.title}
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <iframe src="https:www.youtube.com/embed/${getVideo(movie).key}" frameborder="0" width="700"
                            height="400"
                            loading="lazy"></iframe>
                    <p>${movie.overview}</p>
                    ${getNotation(movie)}
                    <p>${getMoviegGenders(movie.genre_ids, genders)}</p>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
   `);
}

/**
 *
 * @param movie
 */
function getVideo(movie) {
    var host = $(location).attr('protocol') + '//' + $(location).attr('host');
    var url = host + '/movie/' + movie.id;
    var result = $.ajax({
        url: url,
        contentType: "application/json; charset='utf-8'",
        dataType: 'json',
        type: 'GET',
        async: false,
        data:
            {},
        complete: function (response) {
            return response
        },
        error: function () {
            console.log('error data call: ' + url);
        },
    });

    if (result.responseText == '[]') {
        console.log('no data')
    } else {
        const movy = JSON.parse(result.responseText);

        let videoElement = $.each(movy.videos.results, function (key, video) {
            if (video.type == 'Trailer') {
                return video;
            }
        });
        if (videoElement.length > 0) {
            videoElement = videoElement[0];
        }
        return videoElement;
    }
}
/**
 *
 * @param movie
 * @returns {string}
 */
function getNotation(movie) {
    const roundValue = movie.vote_average.toFixed(0);
    const starValue = roundValue % 10
    let rating = '<span class="rating">'
    for (let i = 1; i < starValue; i++) {
        rating = rating + '☆'
    }
    rating = rating + '</span><span>'
    for (let ii = starValue; ii <= 10; ii++) {
        rating = rating + '☆'
    }
    rating += '</span>  <span>' + movie.vote_average + "/10 -  " + movie.vote_count + "  votes ) </span>"
    return rating
}

/**
 *
 * @param gendersId
 * @param genders
 * @returns {string}
 */
function getMoviegGenders(gendersId, genders) {
    let list = ""
    let sep = ''
    $.each(genders, function (key, gender) {
        if ($.inArray(gender.id, gendersId) != -1) {
            list = list + sep + gender.name;
            sep = ','
        }
    });
    return list
}

$(function () {
    const genderId = $("#genderId").val();
    $("a#gender_" + genderId).css('font-weight', 'bold')
    $("a#gender_" + genderId).css('color', 'orange');
    $('a#gender_' + genderId).trigger('click');
    return false;
});