
// Mount splides
function mountSplides() {
    var elms = document.getElementsByClassName('splide');
    
    for ( var i = 0; i < elms.length; i++ ) {
      new Splide( elms[i] , {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        drag: 'free',
        snap: true,
        pagination: false,
        breakpoints: {
            800: {
                perPage: 2,
                gap: '0.7rem',
            },
            480: {
                perPage: 1,
                gap: '0.7rem',
            }
        }
      }
        ).mount();
    }
}


// Do when page loads
document.addEventListener( 'DOMContentLoaded', function () {
    mountSplides();
} );