(function ()
{
    'use strict';

    angular
        .module('app.paeb.autre_information.site_disponible', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_autre_information_site_disponible', {
            url      : '/donnees-de-base/site_disponible',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/autre_information/site_disponible/site_disponible.html',
                    controller : 'Site_disponibleController as vm'
                }
            },
            bodyClass: 'Nouveau site subventioné',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "site_disponible"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.autre_information.site_disponible', {
            title: 'Site disponible',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_autre_information_site_disponible',
            weight: 1
        });
    }

})();
