(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_reliquat.saisie_reliquat', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_reliquat_saisie_reliquat', {
            url      : '/donnees-de-base/saisie_reliquat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_reliquat/saisie_reliquat/saisie_reliquat.html',
                    controller : 'Saisie_reliquatController as vm'
                }
            },
            bodyClass: 'saisie_reliquat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "saisie_reliquat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_reliquat.saisie_reliquat', {
            title: 'Convention C/F',
            icon  : 'icon-tile-four',
            state: 'app.paeb_gerer_situation_reliquat_saisie_reliquat',
			weight: 1
        });
    }

})();
