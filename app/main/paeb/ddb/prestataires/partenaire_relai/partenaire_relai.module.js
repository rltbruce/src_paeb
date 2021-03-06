(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires.partenaire_relai', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_prestataires_partenaire_relai', {
            url      : '/donnees-de-base/partenaire_relai',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/prestataires/partenaire_relai/partenaire_relai.html',
                    controller : 'Partenaire_relaiController as vm'
                }
            },
            bodyClass: 'partenaire_relai',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "partenaire_relai"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.prestataires.partenaire_relai', {
            title: "Partenaires relais",
            icon  : 'icon-engine-outline',
            state: 'app.paeb_ddb_prestataires_partenaire_relai'
        });
    }

})();
