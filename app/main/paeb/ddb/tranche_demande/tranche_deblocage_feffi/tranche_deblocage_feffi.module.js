(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_deblocage_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_demande_tranche_deblocage_feffi', {
            url      : '/donnees-de-base/tranche_deblocage_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_demande/tranche_deblocage_feffi/tranche_deblocage_feffi.html',
                    controller : 'Tranche_deblocage_feffiController as vm'
                }
            },
            bodyClass: 'tranche_deblocage_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_deblocage_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande.tranche_deblocage_feffi', {
            title: 'FEFFI',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_tranche_demande_tranche_deblocage_feffi'

        });
    }

})();
