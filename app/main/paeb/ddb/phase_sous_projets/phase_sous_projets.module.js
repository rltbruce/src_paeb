(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.phase_sous_projets', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_phase_sous_projets', {
            url      : '/donnees-de-base/phase_sous_projets',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/phase_sous_projets/phase_sous_projets.html',
                    controller : 'Phase_sous_projetsController as vm'
                }
            },
            bodyClass: 'phase_sous_projets',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "phase_sous_projets"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.phase_sous_projets', {
            title: 'Phase sous projet',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_phase_sous_projets'
        });
    }

})();
