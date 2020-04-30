(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.localisation', [
            'app.paeb.ddb.localisation.region',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.localisation', {
            title : 'Localisation',
            icon  : 'icon-map-marker-multiple',
            weight: 1
        });
    }

})();
