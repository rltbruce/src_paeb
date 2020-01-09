(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.suivi_daff_ufp', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_traitement_suivi_daff_ufp', {
            url      : '/donnees-de-base/suivi_daff_ufp',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/traitement/suivi_daff_ufp/suivi_daff_ufp.html',
                    controller : 'Suivi_daff_ufpController as vm'
                }
            },
            bodyClass: 'suivi_daff_ufp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi_daff_ufp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.traitement.suivi_daff_ufp', {
            title: 'Suivi DAAF/UFP',
            icon  : 'icon-tile-four',
            state: 'app.paeb_traitement_suivi_daff_ufp',
			weight: 2
        });
    }

})();
