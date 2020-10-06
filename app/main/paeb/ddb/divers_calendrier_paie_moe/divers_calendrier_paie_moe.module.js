(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.divers_calendrier_paie_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_divers_calendrier_paie_moe', {
            url      : '/donnees-de-base/divers_calendrier_paie_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/divers_calendrier_paie_moe/divers_calendrier_paie_moe.html',
                    controller : 'Divers_calendrier_paie_moeController as vm'
                }
            },
            bodyClass: 'divers_calendrier_paie_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "divers_calendrier_paie_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.divers_calendrier_paie_moe', {
            title: 'Rubrique paiement MOE',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_divers_calendrier_paie_moe',
            weight: 11
        });
    }

})();
