(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.suivi_daff_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_traitement_suivi_daff_feffi', {
            url      : '/donnees-de-base/suivi_daff_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/traitement/suivi_daff_feffi/suivi_daff_feffi.html',
                    controller : 'Suivi_daff_feffiController as vm'
                }
            },
            bodyClass: 'suivi_daff_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi_daff_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.traitement.suivi_daff_feffi', {
            title: 'Suivi DAAF/FEFFI',
            icon  : 'icon-tile-four',
            state: 'app.paeb_traitement_suivi_daff_feffi',
			weight: 2
        });
    }

})();
