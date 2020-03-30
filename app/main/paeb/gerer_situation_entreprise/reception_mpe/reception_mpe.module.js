(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.reception_mpe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_reception_mpe', {
            url      : '/donnees-de-base/reception_mpe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/reception_mpe/reception_mpe.html',
                    controller : 'Reception_mpeController as vm'
                }
            },
            bodyClass: 'reception_mpe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "reception_mpe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.reception_mpe', {
            title: 'RECEPTION MPE',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_reception_mpe',
			weight: 14
        });
    }

})();
