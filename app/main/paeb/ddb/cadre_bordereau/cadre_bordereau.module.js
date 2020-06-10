(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cadre_bordereau', [
            'app.paeb.ddb.cadre_bordereau.travaux_preparatoire'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.cadre_bordereau', {
            title : 'Travaux preparatoire',
            icon  : 'icon-account-network',
            weight: 1
        });
    }

})();
