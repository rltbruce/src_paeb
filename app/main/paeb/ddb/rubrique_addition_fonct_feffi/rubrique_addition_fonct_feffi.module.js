(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.rubrique_addition_fonct_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_rubrique_addition_fonct_feffi', {
            url      : '/donnees-de-base/rubrique_addition_fonct_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/rubrique_addition_fonct_feffi/rubrique_addition_fonct_feffi.html',
                    controller : 'Rubrique_addition_fonct_feffiController as vm'
                }
            },
            bodyClass: 'rubrique_addition_fonct_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "rubrique_addition_fonct_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.rubrique_addition_fonct_feffi', {
            title: 'Rubrique addition fonctionnement FEFFI',
            icon  : 'icon-fullscreen-exit',
            state: 'app.paeb_ddb_rubrique_addition_fonct_feffi',
            weight: 15
        });
    }

})();
