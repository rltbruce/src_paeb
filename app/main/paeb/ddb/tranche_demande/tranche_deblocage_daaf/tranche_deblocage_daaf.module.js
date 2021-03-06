(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_deblocage_daaf', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_demande_tranche_deblocage_daaf', {
            url      : '/donnees-de-base/tranche_deblocage_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_demande/tranche_deblocage_daaf/tranche_deblocage_daaf.html',
                    controller : 'Tranche_deblocage_daafController as vm'
                }
            },
            bodyClass: 'tranche_deblocage_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_deblocage_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande.tranche_deblocage_daaf', {
            title: 'DAAF',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_tranche_demande_tranche_deblocage_daaf'

        });
    }

})();
