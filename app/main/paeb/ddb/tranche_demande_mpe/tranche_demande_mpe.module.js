(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande_mpe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_tranche_demande_mpe', {
            url      : '/donnees-de-base/tranche_demande_mpe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/tranche_demande_mpe/tranche_demande_mpe.html',
                    controller : 'Tranche_demande_mpeController as vm'
                }
            },
            bodyClass: 'tranche_demande_mpe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "tranche_demande_mpe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.tranche_demande_mpe', {
            title: 'Tranche demande mpe',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_tranche_demande_mpe'

        });
    }

})();
