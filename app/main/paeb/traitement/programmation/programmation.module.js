(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.programmation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_traitement_programmation', {
            url      : '/donnees-de-base/programmation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/traitement/programmation/programmation.html',
                    controller : 'ProgrammationController as vm'
                }
            },
            bodyClass: 'programmation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Programmation"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.traitement.programmation', {
            title: 'Programmation annuelle',
            icon  : 'icon-tile-four',
            state: 'app.paeb_traitement_programmation',
			weight: 2
        });
    }

})();
